
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function optimizeImages() {
    console.log('🚀 Starting Archive Image Optimization...');

    // 1. Fetch all photos
    const { data: photos, error } = await supabase
        .from('archive_photos')
        .select('*');

    if (error) {
        console.error('❌ Error fetching photos:', error);
        return;
    }

    console.log(`📸 Found ${photos.length} photos to process.`);

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const photo of photos) {
        try {
            // Check if already optimized (thumbnail is different from src and contains 'thumbnails')
            if (photo.thumbnail && photo.thumbnail !== photo.src && photo.thumbnail.includes('thumbnails/')) {
                console.log(`⏭️  Skipping ${photo.id} (already optimized)`);
                skippedCount++;
                continue;
            }

            console.log(`🔄 Processing ${photo.id}...`);

            // 2. Download image
            const response = await fetch(photo.src);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 3. Resize using sharp
            const optimizedBuffer = await sharp(buffer)
                .resize({ width: 600, withoutEnlargement: true }) // Max width 600px
                .jpeg({ quality: 80, mozjpeg: true })
                .toBuffer();

            // 4. Upload thumbnail
            // Extract original filename or create a new one
            const originalUrl = new URL(photo.src);
            const originalPath = originalUrl.pathname.split('/').pop() || `photo-${photo.id}.jpg`;
            const thumbnailPath = `thumbnails/thumb-${originalPath}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('archive-photos')
                .upload(thumbnailPath, optimizedBuffer, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            // 5. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('archive-photos')
                .getPublicUrl(thumbnailPath);

            // 6. Update database
            const { error: updateError } = await supabase
                .from('archive_photos')
                .update({ thumbnail: publicUrl })
                .eq('id', photo.id);

            if (updateError) {
                throw new Error(`Database update failed: ${updateError.message}`);
            }

            console.log(`✅ Optimized ${photo.id} -> ${publicUrl}`);
            processedCount++;

        } catch (err: any) {
            console.error(`❌ Error processing ${photo.id}:`, err.message);
            errorCount++;
        }
    }

    console.log('-----------------------------------');
    console.log('🎉 Optimization Complete!');
    console.log(`✅ Processed: ${processedCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
}

optimizeImages();
