-- Add filter columns to archive_photos table
-- These store filter settings as integers (percentages)
-- 100 = normal/default, 110 = 10% increase, 90 = 10% decrease

ALTER TABLE archive_photos 
ADD COLUMN IF NOT EXISTS filter_brightness INTEGER DEFAULT 100;

ALTER TABLE archive_photos 
ADD COLUMN IF NOT EXISTS filter_contrast INTEGER DEFAULT 110;

ALTER TABLE archive_photos 
ADD COLUMN IF NOT EXISTS filter_saturation INTEGER DEFAULT 95;

ALTER TABLE archive_photos 
ADD COLUMN IF NOT EXISTS filter_vignette INTEGER DEFAULT 40;

-- Add index for potential future filtering/sorting by filter values
CREATE INDEX IF NOT EXISTS idx_archive_photos_filters 
ON archive_photos(filter_brightness, filter_contrast, filter_saturation, filter_vignette);
