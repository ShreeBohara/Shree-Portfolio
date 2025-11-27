'use client';

import { useState, useEffect, useRef } from 'react';
import { ArchivePhotoData } from '@/data/archive-photos';
import { PhotoEditor, FilterValues, CropValues } from '@/components/admin/PhotoEditor';

export default function AdminArchivePage() {
    const [photos, setPhotos] = useState<ArchivePhotoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [category, setCategory] = useState('landscape');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterValues>({
        brightness: 100,
        contrast: 110,
        saturation: 95,
        vignette: 40,
    });
    const [crop, setCrop] = useState<CropValues | null>(null);

    // Log crop changes
    useEffect(() => {

    }, [crop]);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch('/api/archive');
            if (res.ok) {
                const data = await res.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error('Failed to fetch photos', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Create preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Auto-apply cinematic preset
            setFilters({
                brightness: 100,
                contrast: 110,
                saturation: 95,
                vignette: 40,
            });
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            // Get image dimensions
            const img = new Image();
            img.src = previewUrl!;
            await new Promise((resolve) => { img.onload = resolve; });

            const formData = new FormData();
            formData.append('file', selectedFile);
            if (title) formData.append('title', title);
            if (description) formData.append('description', description);
            if (year) formData.append('year', year);
            if (month) formData.append('month', month);
            formData.append('category', category);
            formData.append('width', img.width.toString());
            formData.append('height', img.height.toString());
            formData.append('filterBrightness', filters.brightness.toString());
            formData.append('filterContrast', filters.contrast.toString());
            formData.append('filterSaturation', filters.saturation.toString());
            formData.append('filterVignette', filters.vignette.toString());

            // Add crop values if crop was applied

            if (crop) {
                formData.append('cropX', crop.x.toString());
                formData.append('cropY', crop.y.toString());
                formData.append('cropWidth', crop.width.toString());
                formData.append('cropHeight', crop.height.toString());
            } else {

            }

            const res = await fetch('/api/archive', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                // Reset form
                setTitle('');
                setDescription('');
                setYear('');
                setMonth('');
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';

                // Refresh list
                fetchPhotos();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (photoId: string, photoTitle: string) => {
        // Confirm deletion
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${photoTitle || 'this photo'}"?\n\nThis action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {


            const res = await fetch(`/api/archive?id=${photoId}`, {
                method: 'DELETE',
            });

            if (res.ok) {

                alert('Photo deleted successfully!');
                // Refresh the photo list
                fetchPhotos();
            } else {
                const error = await res.json();
                console.error('Delete failed:', error);
                alert('Failed to delete photo: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete photo. Please try again.');
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-light tracking-widest">ARCHIVE MANAGER</h1>
                    <p className="text-white/40 mt-2">Upload and manage your portfolio photos</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Upload Section */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h2 className="text-xl font-light mb-6">Upload New Photo</h2>

                            <form onSubmit={handleUpload} className="space-y-6">
                                {/* Image Preview */}
                                <div
                                    className={`aspect-[4/3] rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative cursor-pointer transition-colors ${previewUrl ? 'border-white/20 bg-black' : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <span className="block text-2xl mb-2">+</span>
                                            <span className="text-sm text-white/40">Click to select image</span>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </div>

                                {/* Photo Editor - shown when file is selected */}
                                {previewUrl && (
                                    <PhotoEditor
                                        imageUrl={previewUrl}
                                        onFilterChange={setFilters}
                                        onCropChange={setCrop}
                                        initialFilters={filters}
                                        initialCrop={crop}
                                    />
                                )}

                                {/* Inputs */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Title (Optional)</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-white/30 transition-colors"
                                            placeholder="Untitled"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Description (Optional)</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-white/30 transition-colors h-24 resize-none"
                                            placeholder="Tell a story about this photo..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Year (Optional)</label>
                                            <input
                                                type="number"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-white/30 transition-colors"
                                                placeholder="YYYY"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Month (Optional)</label>
                                            <select
                                                value={month}
                                                onChange={(e) => setMonth(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-white/30 transition-colors appearance-none"
                                            >
                                                <option value="">None</option>
                                                {months.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Category</label>
                                        <div className="relative group">
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 pr-10 focus:outline-none focus:border-white/40 focus:bg-white/10 hover:bg-white/8 transition-all appearance-none cursor-pointer text-white/90 font-medium [&>option]:bg-black [&>option]:text-white [&>option]:py-2"
                                                style={{
                                                    backgroundImage: 'none',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    colorScheme: 'dark'
                                                }}
                                            >
                                                <option value="landscape" className="bg-black text-white py-2">🏞️ Landscape</option>
                                                <option value="portrait" className="bg-black text-white py-2">🖼️ Portrait</option>
                                                <option value="street" className="bg-black text-white py-2">🚶 Street</option>
                                                <option value="architecture" className="bg-black text-white py-2">🏛️ Architecture</option>
                                                <option value="nature" className="bg-black text-white py-2">🌿 Nature</option>
                                                <option value="people" className="bg-black text-white py-2">👤 People</option>
                                                <option value="family" className="bg-black text-white py-2">👨‍👩‍👧‍👦 Family</option>
                                                <option value="friends" className="bg-black text-white py-2">🤝 Friends</option>
                                            </select>
                                            {/* Custom Dropdown Arrow */}
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:scale-110">
                                                <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!selectedFile || isUploading}
                                    className={`w-full py-3 rounded font-medium tracking-wide transition-all ${!selectedFile || isUploading
                                        ? 'bg-white/10 text-white/20 cursor-not-allowed'
                                        : 'bg-white text-black hover:bg-gray-200'
                                        }`}
                                >
                                    {isUploading ? 'UPLOADING...' : 'UPLOAD PHOTO'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-light mb-6">Library ({photos.length})</h2>

                        {isLoading ? (
                            <div className="text-white/20">Loading library...</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="group relative aspect-square bg-white/5 rounded overflow-hidden border border-white/10">
                                        <img
                                            src={photo.thumbnail || photo.src}
                                            alt={photo.title}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                            style={{
                                                clipPath: photo.crop
                                                    ? `inset(${photo.crop.y}% ${100 - photo.crop.x - photo.crop.width}% ${100 - photo.crop.y - photo.crop.height}% ${photo.crop.x}%)`
                                                    : undefined,
                                            }}
                                        />

                                        {/* Crop indicator badge */}
                                        {photo.crop && (
                                            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                <span>✂️</span>
                                                <span>Cropped</span>
                                            </div>
                                        )}

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                handleDelete(photo.id, photo.title);
                                            }}
                                            className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded opacity-80 hover:opacity-100 transition-all cursor-pointer z-10"
                                            title="Delete photo"
                                            type="button"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <p className="font-medium truncate">{photo.title}</p>
                                            <p className="text-xs text-white/50">{photo.year} • {photo.category}</p>
                                            {photo.crop && (
                                                <p className="text-xs text-blue-400 mt-1">
                                                    Crop: {photo.crop.width.toFixed(0)}% × {photo.crop.height.toFixed(0)}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {photos.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-white/20 border border-dashed border-white/10 rounded-lg">
                                        No photos in archive yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
