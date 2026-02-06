const { pool } = require('./src/config/db');

async function updateTable() {
    try {
        const [rows] = await pool.execute("SHOW COLUMNS FROM offer_letters LIKE 'reference_no'");
        if (rows.length === 0) {
            console.log("Updating offer_letters table...");
            await pool.execute(`
                ALTER TABLE offer_letters 
                ADD COLUMN reference_no VARCHAR(255),
                ADD COLUMN salary_model ENUM('Structured', 'Simple') DEFAULT 'Structured',
                ADD COLUMN annual_ctc DECIMAL(15, 2),
                ADD COLUMN company_info JSON,
                ADD COLUMN candidate_details JSON,
                ADD COLUMN offer_details JSON,
                ADD COLUMN salary_structure JSON,
                ADD COLUMN roles_responsibilities JSON,
                ADD COLUMN clauses JSON,
                ADD COLUMN documents_required JSON,
                ADD COLUMN acceptance_details JSON,
                ADD COLUMN legal_disclaimer JSON,
                ADD COLUMN custom_fields JSON,
                ADD COLUMN output_control JSON,
                ADD COLUMN version_number INT DEFAULT 1,
                ADD COLUMN revision_history JSON
            `);
            console.log("Table updated successfully!");
        } else {
            console.log("Columns already exist.");
        }
    } catch (error) {
        console.error("Error updating table:", error.message);
    } finally {
        process.exit();
    }
}

updateTable();
