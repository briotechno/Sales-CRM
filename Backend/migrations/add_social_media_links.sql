-- SQL Query to add social media link columns to business_info table

ALTER TABLE business_info
ADD COLUMN whatsapp_link VARCHAR(255) DEFAULT NULL,
ADD COLUMN facebook_link VARCHAR(255) DEFAULT NULL,
ADD COLUMN linkedin_link VARCHAR(255) DEFAULT NULL,
ADD COLUMN instagram_link VARCHAR(255) DEFAULT NULL,
ADD COLUMN youtube_link VARCHAR(255) DEFAULT NULL;

-- Optional: Add comments to describe the columns
COMMENT ON COLUMN business_info.whatsapp_link IS 'WhatsApp business link or phone number';
COMMENT ON COLUMN business_info.facebook_link IS 'Facebook page URL';
COMMENT ON COLUMN business_info.linkedin_link IS 'LinkedIn company page URL';
COMMENT ON COLUMN business_info.instagram_link IS 'Instagram profile URL';
COMMENT ON COLUMN business_info.youtube_link IS 'YouTube channel URL';
