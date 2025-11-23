import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET endpoint - fetch all photos
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('archive_photos')
            .select('id, src, title, year, month, width, height, category, filter_brightness, filter_contrast, filter_saturation, filter_vignette, crop_x, crop_y, crop_width, crop_height')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching photos:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('📤 [API GET] Fetched photos from database:', data?.length);

        // Transform crop data from database format to app format
        try {
            const transformedData = data?.map(photo => {
                const transformed: any = { ...photo };

                // If crop columns exist and have values, create crop object
                if (photo.crop_x !== null && photo.crop_y !== null &&
                    photo.crop_width !== null && photo.crop_height !== null) {
                    transformed.crop = {
                        x: photo.crop_x,
                        y: photo.crop_y,
                        width: photo.crop_width,
                        height: photo.crop_height
                    };
                    console.log(`📤 [API GET] Photo ${photo.id} has crop:`, transformed.crop);
                }

                // Remove the individual crop columns (they're now in the crop object)
                delete transformed.crop_x;
                delete transformed.crop_y;
                delete transformed.crop_width;
                delete transformed.crop_height;

                return transformed;
            });

            return NextResponse.json(transformedData);
        } catch (transformError) {
            console.error('Error transforming data:', transformError);
            console.error('Data that failed:', data);
            // Return data without transformation as fallback
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST endpoint - upload new photo
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string || null;
        const description = formData.get('description') as string || null;
        const yearStr = formData.get('year') as string;
        const year = yearStr ? parseInt(yearStr) : null;
        const month = formData.get('month') as string || null;
        const width = parseInt(formData.get('width') as string);
        const height = parseInt(formData.get('height') as string);
        const category = formData.get('category') as string;

        // Extract filter values with defaults
        const filterBrightness = parseInt(formData.get('filterBrightness') as string) || 100;
        const filterContrast = parseInt(formData.get('filterContrast') as string) || 110;
        const filterSaturation = parseInt(formData.get('filterSaturation') as string) || 95;
        const filterVignette = parseInt(formData.get('filterVignette') as string) || 40;

        // Extract crop values (nullable)
        const cropXStr = formData.get('cropX') as string;
        const cropYStr = formData.get('cropY') as string;
        const cropWidthStr = formData.get('cropWidth') as string;
        const cropHeightStr = formData.get('cropHeight') as string;

        console.log('📥 [API] Received crop strings:', { cropXStr, cropYStr, cropWidthStr, cropHeightStr });

        const cropX = cropXStr ? parseFloat(cropXStr) : null;
        const cropY = cropYStr ? parseFloat(cropYStr) : null;
        const cropWidth = cropWidthStr ? parseFloat(cropWidthStr) : null;
        const cropHeight = cropHeightStr ? parseFloat(cropHeightStr) : null;

        console.log('📥 [API] Parsed crop values:', { cropX, cropY, cropWidth, cropHeight });

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 1. Upload file to Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('archive-photos')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('archive-photos')
            .getPublicUrl(filePath);

        // 2. Insert record into Database
        const recordData = {
            src: publicUrl,
            thumbnail: publicUrl,
            title,
            year,
            month,
            width,
            height,
            category,
            description,
            filter_brightness: filterBrightness,
            filter_contrast: filterContrast,
            filter_saturation: filterSaturation,
            filter_vignette: filterVignette,
            crop_x: cropX,
            crop_y: cropY,
            crop_width: cropWidth,
            crop_height: cropHeight,
        };

        console.log('💾 [API] About to insert into database:', recordData);

        const { data: record, error: dbError } = await supabase
            .from('archive_photos')
            .insert(recordData)
            .select()
            .single();

        if (dbError) {
            // Cleanup: delete the uploaded file if DB insert fails
            await supabase.storage.from('archive-photos').remove([filePath]);
            console.error('Database error:', dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE endpoint - delete a photo
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const photoId = searchParams.get('id');

        if (!photoId) {
            return NextResponse.json({ error: 'Photo ID required' }, { status: 400 });
        }

        console.log('🗑️ [API DELETE] Deleting photo:', photoId);

        // 1. Get photo record to find the file path
        const { data: photo, error: fetchError } = await supabase
            .from('archive_photos')
            .select('src')
            .eq('id', photoId)
            .single();

        if (fetchError || !photo) {
            console.error('Error fetching photo:', fetchError);
            return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
        }

        // Extract filename from URL
        const fileName = photo.src.split('/').pop();
        console.log('🗑️ [API DELETE] File to delete:', fileName);

        // 2. Delete from storage
        if (fileName) {
            const { error: storageError } = await supabase.storage
                .from('archive-photos')
                .remove([fileName]);

            if (storageError) {
                console.error('Error deleting from storage:', storageError);
                // Continue anyway - better to delete DB record even if file delete fails
            } else {
                console.log('✅ [API DELETE] File deleted from storage');
            }
        }

        // 3. Delete from database
        const { error: dbError } = await supabase
            .from('archive_photos')
            .delete()
            .eq('id', photoId);

        if (dbError) {
            console.error('Error deleting from database:', dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        console.log('✅ [API DELETE] Photo deleted successfully');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
