const { pool } = require('../config/db');

const createCatalogCategoriesTable = async () => {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS catalog_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            status ENUM('Active', 'Inactive') DEFAULT 'Active',
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`;
        await pool.query(query);
        console.log('Catalog categories table created successfully or already exists.');
    } catch (error) {
        console.error('Error creating catalog categories table:', error);
    }
};

createCatalogCategoriesTable().then(() => process.exit());
