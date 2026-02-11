
ALTER TABLE pipelines ADD COLUMN catalog_id INT NULL;
ALTER TABLE pipelines ADD CONSTRAINT fk_pipeline_catalog FOREIGN KEY (catalog_id) REFERENCES catalogs(id) ON DELETE SET NULL;

