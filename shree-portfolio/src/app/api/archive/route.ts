// Read-only gallery. Uploads and deletes are deliberately unavailable publicly.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeArchivePhoto } from '@/lib/archive/photos';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Photo archive unavailable' }, { status: 503 });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('archive_photos')
      .select('id, src, thumbnail, title, year, month, width, height, category, filter_brightness, filter_contrast, filter_saturation, filter_vignette, crop_x, crop_y, crop_width, crop_height')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      return NextResponse.json({ error: 'Photo archive unavailable' }, { status: 500 });
    }
    return NextResponse.json((data || []).map(normalizeArchivePhoto));
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Photo archive unavailable' }, { status: 500 });
  }
}
