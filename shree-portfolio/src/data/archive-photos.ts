// Placeholder photo data for the archive gallery
// In production, these would be your actual personal photos

export interface ArchivePhotoData {
  id: string;
  src: string;
  thumbnail: string;
  title: string;
  year: number;
  description?: string;
  width: number;
  height: number;
  category?: string;
  month?: string;
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    vignette: number;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Generate placeholder photos with varied dimensions
const generatePlaceholderPhotos = (count: number): ArchivePhotoData[] => {
  const photos: ArchivePhotoData[] = [];
  const categories = ['landscape', 'portrait', 'street', 'architecture', 'nature', 'people', 'family', 'friends'];
  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  // Common aspect ratios for variety
  const aspectRatios = [
    { width: 400, height: 600 },   // Portrait
    { width: 600, height: 400 },   // Landscape
    { width: 500, height: 500 },   // Square
    { width: 600, height: 800 },   // Tall portrait
    { width: 800, height: 600 },   // Wide landscape
    { width: 400, height: 400 },   // Small square
  ];

  for (let i = 1; i <= count; i++) {
    const ratio = aspectRatios[i % aspectRatios.length];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const year = years[Math.floor(Math.random() * years.length)];

    photos.push({
      id: `photo-${i}`,
      // Using picsum for placeholder images with consistent seed for each ID
      src: `https://picsum.photos/seed/${i}/${ratio.width}/${ratio.height}`,
      thumbnail: `https://picsum.photos/seed/${i}/200/200`,
      title: `Photo ${i}`,
      year: year,
      description: `A ${category} photograph from ${year}`,
      width: ratio.width,
      height: ratio.height,
      category: category,
      filters: {
        brightness: 100,
        contrast: 110,
        saturation: 95,
        vignette: 40,
      },
    });
  }

  return photos;
};

// Export 50 placeholder photos for the archive
export const archivePhotos: ArchivePhotoData[] = generatePlaceholderPhotos(50);

// Helper to get a subset of photos (for initial stack)
export const getStackPhotos = (count: number = 50): ArchivePhotoData[] => {
  return archivePhotos.slice(0, count);
};

// Helper to get all photos for the full canvas
export const getAllPhotos = (): ArchivePhotoData[] => {
  return archivePhotos;
};
