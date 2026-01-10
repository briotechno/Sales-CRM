const Pipeline = require('../models/pipelineModel');
const { pool } = require('../config/db'); // Needed for stage specific ops if model doesn't support

const createPipeline = async (req, res) => {
    try {
        const { name, status, stages } = req.body;
        if (!name) return res.status(400).json({ message: 'Pipeline Name is required' });

        // Validate stages
        if (stages && Array.isArray(stages)) {
            for (const stage of stages) {
                if (!stage.name) return res.status(400).json({ message: 'Stage Name is required' });
                if (stage.probability === undefined || stage.probability < 0 || stage.probability > 100) {
                    return res.status(400).json({ message: 'Probability must be between 0 and 100' });
                }
            }
        }

        const id = await Pipeline.create(req.body, req.user.id);
        res.status(201).json({ status: true, message: 'Pipeline created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getPipelines = async (req, res) => {
    try {
        const pipelines = await Pipeline.findAll(req.user.id);
        res.status(200).json(pipelines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPipelineById = async (req, res) => {
    try {
        const pipeline = await Pipeline.findById(req.params.id, req.user.id);
        if (!pipeline) return res.status(404).json({ message: 'Pipeline not found' });
        res.status(200).json(pipeline);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePipeline = async (req, res) => {
    try {
        const { name, stages } = req.body;
        if (!name) return res.status(400).json({ message: 'Pipeline Name is required' });

        // Validate stages
        if (stages && Array.isArray(stages)) {
            // Check final stage uniqueness
            const finalStages = stages.filter(s => s.is_final);
            // Requirement: "Final Stage must be unique per pipeline." - Wait, usually only one? 
            // Or "Final Stage (Yes / No)" implies a flag. If unique, then only ONE stage can be final.
            // Let's assume max 1 final stage (Won). But "Lost" is also final?
            // "Lead Status (Open / Won / Lost)" -> this is separate.
            // Maybe "Final Stage" flag means "Completed"?
            // "Final Stage must be unique per pipeline" -> Means exactly 1 stage is "Final"? 
            // Or multiple logic? I will assume only ONE stage can have is_final=true.
            if (finalStages.length > 1) {
                return res.status(400).json({ message: 'There can be only one Final Stage per pipeline.' });
            }
        }

        await Pipeline.update(req.params.id, req.body, req.user.id);
        res.status(200).json({ status: true, message: 'Pipeline updated successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deletePipeline = async (req, res) => {
    try {
        await Pipeline.delete(req.params.id, req.user.id);
        res.status(200).json({ status: true, message: 'Pipeline deleted successfully' });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message }); // 400 for bad request (dependencies)
    }
};

// --- Pivot to Stage APIs ---
// Since we have a requirement for explicit Stage APIs, we implement them here.
// Note: Frontend likely uses updatePipeline (PUT /api/pipelines/:id) for everything.

const addPipelineStage = async (req, res) => {
    try {
        const { pipeline_id, name, probability, is_final } = req.body;
        // Verify pipeline ownership
        const [pipeline] = await pool.query('SELECT id FROM pipelines WHERE id = ? AND user_id = ?', [pipeline_id, req.user.id]);
        if (pipeline.length === 0) return res.status(404).json({ message: 'Pipeline not found' });

        await pool.query(
            'INSERT INTO pipeline_stages (pipeline_id, name, probability, is_final) VALUES (?, ?, ?, ?)',
            [pipeline_id, name, probability, is_final ? 1 : 0]
        );
        res.status(201).json({ status: true, message: 'Stage added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePipelineStage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, probability, is_final } = req.body;

        // Verify ownership via join
        const [rows] = await pool.query(`
            SELECT s.id FROM pipeline_stages s
            JOIN pipelines p ON s.pipeline_id = p.id
            WHERE s.id = ? AND p.user_id = ?
        `, [id, req.user.id]);

        if (rows.length === 0) return res.status(404).json({ message: 'Stage not found' });

        await pool.query(
            'UPDATE pipeline_stages SET name = ?, probability = ?, is_final = ? WHERE id = ?',
            [name, probability, is_final ? 1 : 0, id]
        );
        res.status(200).json({ status: true, message: 'Stage updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePipelineStage = async (req, res) => {
    try {
        const { id } = req.params;
        // Verify ownership
        const [rows] = await pool.query(`
            SELECT s.id FROM pipeline_stages s
            JOIN pipelines p ON s.pipeline_id = p.id
            WHERE s.id = ? AND p.user_id = ?
        `, [id, req.user.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Stage not found' });

        // Check leads
        const [leads] = await pool.query('SELECT id FROM leads WHERE stage_id = ?', [id]);
        if (leads.length > 0) return res.status(400).json({ message: 'Cannot delete stage with active leads' });

        await pool.query('DELETE FROM pipeline_stages WHERE id = ?', [id]);
        res.status(200).json({ status: true, message: 'Stage deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPipeline,
    getPipelines,
    getPipelineById,
    updatePipeline,
    deletePipeline,
    addPipelineStage,
    updatePipelineStage,
    deletePipelineStage
};
