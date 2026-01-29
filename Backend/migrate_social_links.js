const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log('Checking for social_links column...');
        const [columns] = await pool.query('SHOW COLUMNS FROM business_info LIKE "social_links"');

        if (columns.length === 0) {
            console.log('Adding social_links column...');
            await pool.query('ALTER TABLE business_info ADD COLUMN social_links JSON');
            console.log('Column added successfully.');
        } else {
            console.log('social_links column already exists.');
        }

        console.log('Checking for twitter_link column...');
        const [twitterColumns] = await pool.query('SHOW COLUMNS FROM business_info LIKE "twitter_link"');
        if (twitterColumns.length === 0) {
            console.log('Adding twitter_link column...');
            await pool.query('ALTER TABLE business_info ADD COLUMN twitter_link VARCHAR(255)');
            console.log('Column added successfully.');
        } else {
            console.log('twitter_link column already exists.');
        }

        // Optional: Migrate existing links to the JSON column if they exist and JSON column is empty
        // But for now, let's just make sure the column exists.
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
