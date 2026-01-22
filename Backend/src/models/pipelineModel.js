const { pool } = require('../config/db');

const Pipeline = {
    create: async (data, userId) => {
        const { name, status, description, stages } = data;
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO pipelines (name, status, description, user_id) VALUES (?, ?, ?, ?)',
                [name, status || 'Active', description, userId]
            );
            const pipelineId = result.insertId;

            if (stages && stages.length > 0) {
                const stageValues = stages.map((stage, index) => [
                    pipelineId,
                    stage.name,
                    stage.description,
                    stage.probability,
                    stage.is_final ? 1 : 0,
                    index // stage_order
                ]);

                await connection.query(
                    'INSERT INTO pipeline_stages (pipeline_id, name, description, probability, is_final, stage_order) VALUES ?',
                    [stageValues]
                );
            }

            await connection.commit();
            return pipelineId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    findAll: async (userId) => {
        const [pipelines] = await pool.query(
            `SELECT p.*, 
            (SELECT COUNT(*) FROM leads l WHERE l.pipeline_id = p.id) as noOfDeals,
            (SELECT COALESCE(SUM(l.value), 0) FROM leads l WHERE l.pipeline_id = p.id) as totalDealValue
            FROM pipelines p 
            WHERE p.user_id = ? 
            ORDER BY p.id DESC`,
            [userId]
        );

        // Fetch stages for each pipeline? 
        // Or maybe just fetch all pipelines first. The list view shows "Number of Stages".
        // Let's do a join or separate query. For scalability, maybe getting stage count is enough for list.
        // But for "Edit", we need stages.
        // Let's fetch stages and attach them.

        for (let pipeline of pipelines) {
            const [stages] = await pool.query(
                'SELECT * FROM pipeline_stages WHERE pipeline_id = ? ORDER BY stage_order ASC',
                [pipeline.id]
            );
            pipeline.stages = stages;
            // Format for UI
            pipeline.createdDate = new Date(pipeline.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        }

        return pipelines;
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query(
            'SELECT * FROM pipelines WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        if (rows.length === 0) return null;

        const pipeline = rows[0];
        const [stages] = await pool.query(
            'SELECT * FROM pipeline_stages WHERE pipeline_id = ? ORDER BY stage_order ASC',
            [id]
        );
        pipeline.stages = stages;
        return pipeline;
    },

    update: async (id, data, userId) => {
        const { name, status, description, stages } = data;
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verify ownership
            const [check] = await connection.query('SELECT id FROM pipelines WHERE id = ? AND user_id = ?', [id, userId]);
            if (check.length === 0) throw new Error('Pipeline not found or unauthorized');

            await connection.query(
                'UPDATE pipelines SET name = ?, status = ?, description = ? WHERE id = ?',
                [name, status, description, id]
            );

            if (stages) {
                // For simplicity, delete all existing stages and re-insert. 
                // However, if leads are linked to stages, this will fail if we have FK constraints (DELETE CASCADE on Pipeline but RESTRICT on Lead -> Stage).
                // Wait, Lead -> Stage FK might prevent deleting stages if leads exist.
                // Requirement: "Do not allow deleting a Pipeline if leads are linked to it."
                // But what if we just change stages?
                // Ideally, we should update existing stages by ID if provided, delete removed ones, add new ones.
                // But if the user drastically changes stages, leads might get orphaned or need migration.
                // For this task, I'll try to sync simple way: 
                // 1. Get existing stages. 2. Compare. 
                // Or: If leads are linked, maybe we restrict stage deletion?
                // Let's simple "Delete all & Re-insert" for now, IF no leads valid constraint hits.
                // If it fails due to FK, it throws error.

                // Better approach for update:
                // Delete stages that are not in the new list (by ID).
                // Update stages that have ID.
                // Insert stages that have no ID.

                // Existing stages
                const [existingStages] = await connection.query('SELECT id FROM pipeline_stages WHERE pipeline_id = ?', [id]);
                const existingIds = existingStages.map(s => s.id);
                const incomingIds = stages.filter(s => s.id).map(s => s.id);

                // Delete removed stages
                const toDelete = existingIds.filter(eid => !incomingIds.includes(eid));
                if (toDelete.length > 0) {
                    // This might fail if leads are attached.
                    await connection.query('DELETE FROM pipeline_stages WHERE id IN (?)', [toDelete]);
                }

                // Upsert
                for (let i = 0; i < stages.length; i++) {
                    const stage = stages[i];
                    if (stage.id) {
                        await connection.query(
                            'UPDATE pipeline_stages SET name = ?, description = ?, probability = ?, is_final = ?, stage_order = ? WHERE id = ?',
                            [stage.name, stage.description, stage.probability, stage.is_final ? 1 : 0, i, stage.id]
                        );
                    } else {
                        await connection.query(
                            'INSERT INTO pipeline_stages (pipeline_id, name, description, probability, is_final, stage_order) VALUES (?, ?, ?, ?, ?, ?)',
                            [id, stage.name, stage.description, stage.probability, stage.is_final ? 1 : 0, i]
                        );
                    }
                }
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    delete: async (id, userId) => {
        // Check for dependencies (Leads)
        const [leads] = await pool.query('SELECT id FROM leads WHERE pipeline_id = ?', [id]);
        if (leads.length > 0) {
            throw new Error('Cannot delete pipeline with active leads.');
        }

        const [result] = await pool.query(
            'DELETE FROM pipelines WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Pipeline;
