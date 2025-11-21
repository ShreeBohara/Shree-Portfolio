'use client';

import { useState, useEffect, useRef } from 'react';
import { ArchivePhotoData } from '@/data/archive-photos';

export default function AdminArchivePage() {
    const [photos, setPhotos] = useState<ArchivePhotoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [category, setCategory] = useState('landscape');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
            formData.append('title', title);
            formData.append('year', year.toString());
            formData.append('category', category);
            formData.append('width', img.width.toString());
            formData.append('height', img.height.toString());

            const res = await fetch('/api/archive', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                // Reset form
                setTitle('');
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';

                // Refresh list
                fetchPhotos();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Upload error', error);
            alert('Upload error');
        } finally {
            setIsUploading(false);
        }
    };

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

                                {/* Inputs */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-white/30 transition-colors"
                                            placeholder="e.g. Mountain View"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Year</label>
                                            <input
                                                type="number"
                                                value={year}
                                                onChange={(e) => setYear(parseInt(e.target.value))}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-white/30 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Category</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-white/30 transition-colors appearance-none"
                                            >
                                                <option value="landscape">Landscape</option>
                                                <option value="portrait">Portrait</option>
                                                <option value="street">Street</option>
                                                <option value="architecture">Architecture</option>
                                                <option value="nature">Nature</option>
                                            </select>
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
                                        <img src={photo.thumbnail || photo.src} alt={photo.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <p className="font-medium truncate">{photo.title}</p>
                                            <p className="text-xs text-white/50">{photo.year} • {photo.category}</p>
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
