import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

const Index = ({ media, folders, current_folder, filters = {} }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { data, setData, post, processing } = useForm({
        files: [],
        folder: current_folder || '',
    });

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        setData('files', files);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        setUploading(true);
        post(route('admin.media.store'), {
            onSuccess: () => {
                setSelectedFiles([]);
                setData('files', []);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setUploading(false);
            },
            onError: () => {
                setUploading(false);
            },
        });
    };

    const deleteMedia = (id) => {
        if (confirm('Are you sure you want to delete this media file?')) {
            router.delete(route('admin.media.destroy', id));
        }
    };

    const handleFolderChange = (folder) => {
        router.get(route('admin.media.index'), { folder });
    };

    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) return '🖼️';
        if (mimeType.startsWith('video/')) return '🎥';
        if (mimeType.startsWith('audio/')) return '🎵';
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
        return '📁';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            <Head title="Media Library" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Files
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                                    onChange={handleFileSelect}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {selectedFiles.length > 0 && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        {selectedFiles.length} file(s) selected
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Folder (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.folder}
                                    onChange={(e) => setData('folder', e.target.value)}
                                    placeholder="e.g., products, banners"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={selectedFiles.length === 0 || uploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Upload Files'}
                        </button>
                    </form>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Folder
                            </label>
                            <select
                                value={current_folder || ''}
                                onChange={(e) => handleFolderChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Folders</option>
                                {folders.map((folder) => (
                                    <option key={folder} value={folder}>
                                        {folder}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="text-sm text-gray-600">
                            {media.total} file(s) found
                        </div>
                    </div>
                </div>

                {/* Media Grid */}
                <div className="bg-white rounded-lg shadow p-6">
                    {media.data.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {media.data.map((item) => (
                                <div key={item.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                        {item.mime_type.startsWith('image/') ? (
                                            <img
                                                src={`/storage/${item.path}`}
                                                alt={item.original_filename}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">{getFileIcon(item.mime_type)}</div>
                                                <div className="text-xs text-gray-500 truncate px-2">
                                                    {item.original_filename}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => window.open(`/storage/${item.path}`, '_blank')}
                                                className="px-3 py-1 bg-white text-gray-900 rounded text-sm hover:bg-gray-100"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => deleteMedia(item.id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-white">
                                        <div className="text-xs text-gray-600 truncate">
                                            {item.original_filename}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {formatFileSize(item.size)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📁</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
                            <p className="text-gray-500">Upload some files to get started.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {media.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                                {media.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm border rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

Index.layout = page => <AdminLayout children={page} />;

export default Index;