-- ============================================
-- ARCHIVE PHOTOS CROP COLUMNS MIGRATION
-- ============================================
-- Run this in your Supabase SQL Editor AFTER the filter migration
-- This adds crop coordinate columns for cropping features

ALTER TABLE archive_photos 
ADD COLUMN IF NOT EXISTS crop_x DECIMAL(5,2);

ALTER TABLE archive_photos 
ADD COLUMN IF NOT EXISTS crop_y DECIMAL(5,2);

ALTER TABLE archive_photos 
ADD COLUMN IF NOT EXISTS crop_width DECIMAL(5,2);

ALTER TABLE archive_photos 
ADD COLUMN IF NOT EXISTS crop_height DECIMAL(5,2);

-- Add index for potential future filtering
CREATE INDEX IF NOT EXISTS idx_archive_photos_crop 
ON archive_photos(crop_x, crop_y, crop_width, crop_height);

-- Verify the migration
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'archive_photos' 
AND column_name LIKE 'crop%';
