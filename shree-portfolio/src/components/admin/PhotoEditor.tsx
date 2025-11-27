'use client';

import { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface PhotoEditorProps {
    imageUrl: string;
    onFilterChange: (filters: FilterValues) => void;
    onCropChange?: (crop: CropValues | null) => void;
    initialFilters?: FilterValues;
    initialCrop?: CropValues | null;
}

export interface FilterValues {
    brightness: number;
    contrast: number;
    saturation: number;
    vignette: number;
}

export interface CropValues {
    x: number;
    y: number;
    width: number;
    height: number;
}

type Point = { x: number; y: number };
type Area = { x: number; y: number; width: number; height: number };

const PRESETS = {
    cinematic: {
        brightness: 100,
        contrast: 110,
        saturation: 95,
        vignette: 40,
    },
    vibrant: {
        brightness: 105,
        contrast: 115,
        saturation: 120,
        vignette: 20,
    },
    bw: {
        brightness: 100,
        contrast: 120,
        saturation: 0,
        vignette: 50,
    },
    none: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        vignette: 0,
    },
};

export function PhotoEditor({
    imageUrl,
    onFilterChange,
    onCropChange,
    initialFilters,
    initialCrop
}: PhotoEditorProps) {
    const [filters, setFilters] = useState<FilterValues>(
        initialFilters || PRESETS.cinematic
    );
    const [showOriginal, setShowOriginal] = useState(false);

    // Crop state
    const [cropMode, setCropMode] = useState(false);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null); // PERCENTAGE values
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null); // PIXEL values
    const [aspect, setAspect] = useState<number | undefined>(undefined); // undefined = free

    // Notify parent when filters change
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const updateFilter = (key: keyof FilterValues, value: number) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyPreset = (preset: keyof typeof PRESETS) => {
        setFilters(PRESETS[preset]);
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        // Store BOTH - we need percentage for saving, pixels for display
        setCroppedArea(croppedArea); // PERCENTAGE
        setCroppedAreaPixels(croppedAreaPixels); // PIXELS

        // Save percentage-based crop immediately
        if (onCropChange) {
            const cropValues: CropValues = {
                x: croppedArea.x,
                y: croppedArea.y,
                width: croppedArea.width,
                height: croppedArea.height,
            };

            onCropChange(cropValues);
        }
    }, [onCropChange]);

    const toggleCropMode = () => {
        const newCropMode = !cropMode;


        setCropMode(newCropMode);

        // When entering crop mode, initialize with full image crop if no crop exists
        if (!cropMode && !croppedArea && onCropChange) {

            const defaultCrop: CropValues = {
                x: 0,
                y: 0,
                width: 100,
                height: 100,
            };
            onCropChange(defaultCrop);
        }

        // When exiting crop mode, ensure crop is saved using PERCENTAGE values
        if (cropMode && croppedArea && onCropChange) {

            const cropValues: CropValues = {
                x: croppedArea.x,  // PERCENTAGE
                y: croppedArea.y,
                width: croppedArea.width,
                height: croppedArea.height,
            };
            onCropChange(cropValues);
        }
    };

    const resetCrop = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAspect(undefined);
        if (onCropChange) {
            onCropChange(null);
        }
    };

    return (
        <div className="space-y-4 bg-white/5 p-6 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/90 uppercase tracking-wider">
                    {cropMode ? 'Crop Photo' : 'Photo Editor'}
                </h3>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={toggleCropMode}
                        className={`text-xs px-3 py-1.5 rounded transition-colors ${cropMode
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        {cropMode ? '✓ Done Cropping' : '✂️ Crop'}
                    </button>
                    {!cropMode && (
                        <button
                            type="button"
                            onMouseDown={() => setShowOriginal(true)}
                            onMouseUp={() => setShowOriginal(false)}
                            onMouseLeave={() => setShowOriginal(false)}
                            className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors"
                        >
                            Hold to Compare
                        </button>
                    )}
                </div>
            </div>

            {/* Preview / Crop Area */}
            <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                {cropMode ? (
                    // Crop Mode
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        style={{
                            containerStyle: {
                                background: '#000',
                            },
                        }}
                    />
                ) : (
                    // Filter Preview Mode
                    <>
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            style={{
                                filter: showOriginal
                                    ? 'none'
                                    : `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`,
                            }}
                        />

                        {/* Vignette overlay */}
                        {!showOriginal && filters.vignette > 0 && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle, transparent 0%, transparent 50%, rgba(0,0,0,${filters.vignette / 100}) 100%)`,
                                }}
                            />
                        )}

                        {showOriginal && (
                            <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">
                                Original
                            </div>
                        )}
                    </>
                )}
            </div>

            {cropMode ? (
                // Crop Controls
                <>
                    {/* Aspect Ratio Buttons */}
                    <div>
                        <label className="block text-xs text-white/60 uppercase tracking-wider mb-2">
                            Aspect Ratio
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setAspect(undefined)}
                                className={`px-3 py-2 rounded text-xs transition-colors ${aspect === undefined
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                Free
                            </button>
                            <button
                                type="button"
                                onClick={() => setAspect(1)}
                                className={`px-3 py-2 rounded text-xs transition-colors ${aspect === 1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                Square
                            </button>
                            <button
                                type="button"
                                onClick={() => setAspect(4 / 3)}
                                className={`px-3 py-2 rounded text-xs transition-colors ${aspect === 4 / 3
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                4:3
                            </button>
                            <button
                                type="button"
                                onClick={() => setAspect(16 / 9)}
                                className={`px-3 py-2 rounded text-xs transition-colors ${aspect === 16 / 9
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                16:9
                            </button>
                        </div>
                    </div>

                    {/* Zoom Slider */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-xs text-white/60 uppercase tracking-wider">Zoom</label>
                            <span className="text-xs text-white/80 font-mono">{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>

                    {/* Reset Crop Button */}
                    <button
                        type="button"
                        onClick={resetCrop}
                        className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                    >
                        🔄 Reset Crop
                    </button>
                </>
            ) : (
                // Filter Controls
                <>
                    {/* Preset Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        <button
                            type="button"
                            onClick={() => applyPreset('cinematic')}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                        >
                            🎬 Cinematic
                        </button>
                        <button
                            type="button"
                            onClick={() => applyPreset('vibrant')}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                        >
                            ✨ Vibrant
                        </button>
                        <button
                            type="button"
                            onClick={() => applyPreset('bw')}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                        >
                            ⚫ B&W
                        </button>
                        <button
                            type="button"
                            onClick={() => applyPreset('none')}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                        >
                            🔄 Reset
                        </button>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-4">
                        {/* Brightness */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs text-white/60 uppercase tracking-wider">Brightness</label>
                                <span className="text-xs text-white/80 font-mono">{filters.brightness}%</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="150"
                                value={filters.brightness}
                                onChange={(e) => updateFilter('brightness', parseInt(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        {/* Contrast */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs text-white/60 uppercase tracking-wider">Contrast</label>
                                <span className="text-xs text-white/80 font-mono">{filters.contrast}%</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="150"
                                value={filters.contrast}
                                onChange={(e) => updateFilter('contrast', parseInt(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        {/* Saturation */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs text-white/60 uppercase tracking-wider">Saturation</label>
                                <span className="text-xs text-white/80 font-mono">{filters.saturation}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={filters.saturation}
                                onChange={(e) => updateFilter('saturation', parseInt(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        {/* Vignette */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs text-white/60 uppercase tracking-wider">Vignette</label>
                                <span className="text-xs text-white/80 font-mono">{filters.vignette}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={filters.vignette}
                                onChange={(e) => updateFilter('vignette', parseInt(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Slider Styles */}
            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
        </div>
    );
}
