/** Convert saved database adjustments to the shape used by the gallery. */
export function normalizeArchivePhoto(photo: Record<string, unknown>) {
  const {
    filter_brightness, filter_contrast, filter_saturation, filter_vignette,
    crop_x, crop_y, crop_width, crop_height, ...rest
  } = photo;
  const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
  const hasFilters = [filter_brightness, filter_contrast, filter_saturation, filter_vignette].some(finite);
  const hasCrop = finite(crop_x) && finite(crop_y) && finite(crop_width) && finite(crop_height)
    && crop_width > 0 && crop_height > 0;

  return {
    ...rest,
    ...(hasFilters ? {
      filters: {
        brightness: finite(filter_brightness) ? filter_brightness : 100,
        contrast: finite(filter_contrast) ? filter_contrast : 110,
        saturation: finite(filter_saturation) ? filter_saturation : 95,
        vignette: finite(filter_vignette) ? filter_vignette : 40,
      },
    } : {}),
    ...(hasCrop ? { crop: { x: crop_x, y: crop_y, width: crop_width, height: crop_height } } : {}),
  };
}
