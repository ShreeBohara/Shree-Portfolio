// Read-only endpoint. The POST (upload) and DELETE handlers were removed on 2026-09-01:
// they ran with the Supabase service-role key and had no authentication, so anyone could
// add or delete photos. Uploads now happen from a local script. See the Portfolio 2.0 plan.

import { NextResponse } from 'next/server';
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
            .select('id, src, thumbnail, title, year, month, width, height, category, filter_brightness, filter_contrast, filter_saturation, filter_vignette, crop_x, crop_y, crop_width, crop_height')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching photos:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }



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
