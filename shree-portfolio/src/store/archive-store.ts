import { create } from 'zustand';

export type GalleryState = 'preloader' | 'stack' | 'burst' | 'canvas' | 'lightbox';

interface ArchivePhoto {
  id: string;
  src: string;
  thumbnail?: string;
  title?: string;
  year?: number;
  month?: string;
  description?: string;
  width?: number;
  height?: number;
  position?: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    zIndex: number;
  };
  zDepth?: number; // For parallax effect (0.8 - 1.2)
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

interface ArchiveStoreState {
  // Gallery state management
  currentState: GalleryState;
  setState: (state: GalleryState) => void;

  // Animation progress
  preloadProgress: number;
  setPreloadProgress: (progress: number) => void;

  // Photos data
  photos: ArchivePhoto[];
  setPhotos: (photos: ArchivePhoto[]) => void;
  fetchPhotos: () => Promise<void>;
  updatePhotoPosition: (id: string, position: Partial<ArchivePhoto['position']>) => void;

  // Selected photo for lightbox
  selectedPhotoId: string | null;
  setSelectedPhotoId: (id: string | null) => void;

  // Canvas drag state
  canvasPosition: { x: number; y: number };
  setCanvasPosition: (position: { x: number; y: number }) => void;

  // Drag velocity for momentum
  dragVelocity: { x: number; y: number };
  setDragVelocity: (velocity: { x: number; y: number }) => void;

  // Animation flags
  isStacking: boolean;
  setIsStacking: (isStacking: boolean) => void;
  isBursting: boolean;
  setIsBursting: (isBursting: boolean) => void;

  // Preloaded image count
  loadedImagesCount: number;
  incrementLoadedImages: () => void;
  resetLoadedImages: () => void;

  // Canvas dimensions
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
}

export const useArchiveStore = create<ArchiveStoreState>((set) => ({
  // Gallery state
  currentState: 'preloader',
  setState: (state) => set({ currentState: state }),

  // Animation progress
  preloadProgress: 0,
  setPreloadProgress: (progress) => set({ preloadProgress: progress }),

  // Photos
  photos: [],
  setPhotos: (photos) => set({ photos }),
  fetchPhotos: async () => {
    try {
      const res = await fetch('/api/archive');
      if (res.ok) {
        const apiPhotos = await res.json();
        if (apiPhotos && apiPhotos.length > 0) {
          set({ photos: apiPhotos });
        }
      }
    } catch (error) {
      console.error('Failed to fetch archive photos:', error);
    }
  },
  updatePhotoPosition: (id, position) =>
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id
          ? { ...photo, position: { ...photo.position!, ...position } }
          : photo
      ),
    })),

  // Selected photo
  selectedPhotoId: null,
  setSelectedPhotoId: (id) => set({ selectedPhotoId: id }),

  // Canvas position
  canvasPosition: { x: 0, y: 0 },
  setCanvasPosition: (position) => set({ canvasPosition: position }),

  // Drag velocity
  dragVelocity: { x: 0, y: 0 },
  setDragVelocity: (velocity) => set({ dragVelocity: velocity }),

  // Animation flags
  isStacking: false,
  setIsStacking: (isStacking) => set({ isStacking }),
  isBursting: false,
  setIsBursting: (isBursting) => set({ isBursting }),

  // Loaded images
  loadedImagesCount: 0,
  incrementLoadedImages: () =>
    set((state) => ({ loadedImagesCount: state.loadedImagesCount + 1 })),
  resetLoadedImages: () => set({ loadedImagesCount: 0 }),

  // Canvas size (for infinite wrapping calculations)
  canvasSize: { width: 3000, height: 3000 }, // Default 300vw x 300vh approx
  setCanvasSize: (size) => set({ canvasSize: size }),
}));
