const { pool } = require('../src/config/db');

async function createProductKeyTable() {
    try {
        await pool.query(`DROP TABLE IF EXISTS product_keys`);

        await pool.query(`
            CREATE TABLE product_keys (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_key VARCHAR(50) NOT NULL UNIQUE,
                enterprise VARCHAR(255) NOT NULL,
                plan VARCHAR(100) NOT NULL,
                status ENUM('Active', 'Inactive', 'Pending', 'Used') DEFAULT 'Pending',
                enterprise_id INT,
                users INT DEFAULT 0,
                validity VARCHAR(50),
                generatedOn DATE NOT NULL,
                expiresOn DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Product Keys table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating product keys table:', error);
        process.exit(1);
    }
}

createProductKeyTable();
