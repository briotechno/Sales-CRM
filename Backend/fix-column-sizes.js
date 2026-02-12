const { pool } = require('./src/config/db');

async function fixColumnSizes() {
    try {
        console.log('Updating column sizes to support Base64 images...');

        const alterQueries = [
            `ALTER TABLE leads MODIFY COLUMN profile_image LONGTEXT`,
            `ALTER TABLE leads MODIFY COLUMN company_logo LONGTEXT`,
            `ALTER TABLE leads MODIFY COLUMN custom_fields LONGTEXT`,
            `ALTER TABLE leads MODIFY COLUMN contact_persons LONGTEXT`,
            `ALTER TABLE leads MODIFY COLUMN interested_in TEXT`
        ];

        for (const query of alterQueries) {
            try {
                await pool.query(query);
                console.log(`✓ Executed: ${query}`);
            } catch (error) {
                console.error(`✗ Error executing ${query}: ${error.message}`);
            }
        }

        console.log('\n✓ Column sizes updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

fixColumnSizes();
