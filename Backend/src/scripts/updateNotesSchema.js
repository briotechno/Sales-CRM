const { pool } = require('../config/db');

const updateNotesTableSchema = async () => {
    const query = `
        ALTER TABLE notes 
        MODIFY COLUMN title VARCHAR(500) NOT NULL,
        MODIFY COLUMN category VARCHAR(255) DEFAULT 'General';
    `;

    try {
        await pool.query(query);
        console.log("Notes table schema updated successfully.");
    } catch (error) {
        console.error("Error updating notes table schema:", error);
    }
};

if (require.main === module) {
    updateNotesTableSchema()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = { updateNotesTableSchema };
