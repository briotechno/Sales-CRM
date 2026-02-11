const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function addCatalogIdColumn() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // Check if column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'pipelines' AND COLUMN_NAME = 'catalog_id'
        `, [process.env.DB_NAME]);

        if (columns.length > 0) {
            console.log('Column catalog_id already exists in pipelines table.');
        } else {
            console.log('Adding catalog_id column to pipelines table...');
            await connection.query(`
                ALTER TABLE pipelines 
                ADD COLUMN catalog_id INT NULL,
                ADD CONSTRAINT fk_pipeline_catalog FOREIGN KEY (catalog_id) REFERENCES catalogs(id) ON DELETE SET NULL
            `);
            console.log('Column catalog_id added successfully.');
        }

    } catch (error) {
        console.error('Error adding catalog_id column:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addCatalogIdColumn();
