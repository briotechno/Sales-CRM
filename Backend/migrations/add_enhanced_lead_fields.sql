-- Migration to add new fields for enhanced lead management
-- Date: 2026-02-12

-- Add new fields to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500),
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS company_logo VARCHAR(500),
ADD COLUMN IF NOT EXISTS gst_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_address TEXT,
ADD COLUMN IF NOT EXISTS org_country VARCHAR(100),
ADD COLUMN IF NOT EXISTS referral_mobile VARCHAR(20),
ADD COLUMN IF NOT EXISTS custom_fields JSON,
ADD COLUMN IF NOT EXISTS contact_persons JSON;

-- Update type column to support 'Individual' and 'Organization' (in addition to existing 'Person')
-- Note: 'Person' will be treated as 'Individual' for backward compatibility
