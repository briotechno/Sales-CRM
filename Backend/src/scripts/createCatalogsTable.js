const { pool } = require('../config/db');

const createCatalogsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS catalogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            catalog_id VARCHAR(50) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(255),
            vendor VARCHAR(255),
            description TEXT,
            minPrice DECIMAL(15, 2),
            maxPrice DECIMAL(15, 2),
            status ENUM('Active', 'Inactive') DEFAULT 'Active',
            image VARCHAR(500),
            images JSON,
            features JSON,
            specifications JSON,
            deliveryTime VARCHAR(255),
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('Catalogs table created successfully');
    } catch (error) {
        console.error('Error creating catalogs table:', error);
    }
};

createCatalogsTable();
