const { pool } = require('./src/config/db');

async function runMigration() {
    try {
        console.log('Running migration: add_enhanced_lead_fields...');

        // Add new columns to leads table
        const alterQueries = [
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500)`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20)`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS country VARCHAR(100)`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_logo VARCHAR(500)`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS gst_number VARCHAR(50)`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_address TEXT`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS org_country VARCHAR(100)`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS referral_mobile VARCHAR(20)`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS custom_fields JSON`,
            `ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_persons JSON`
        ];

        for (const query of alterQueries) {
            try {
                await pool.query(query);
                console.log(`✓ Executed: ${query.substring(0, 60)}...`);
            } catch (error) {
                // Column might already exist, which is fine
                if (error.code === 'ER_DUP_FIELDNAME') {
                    console.log(`  Column already exists, skipping...`);
                } else {
                    console.error(`✗ Error: ${error.message}`);
                }
            }
        }

        console.log('\n✓ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
