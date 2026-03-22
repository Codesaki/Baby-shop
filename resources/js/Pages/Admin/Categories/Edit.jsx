import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const Edit = ({ category }) => {
    const [imagePreview, setImagePreview] = useState(category.image_path ? `/storage/${category.image_path}` : null);
    
    const { data, setData, post, processing, errors } = useForm({
        name: category.name,
        description: category.description || '',
        image: null,
        _method: 'PUT',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.catalog.categories.update', category.id), {
            forceFormData: true,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Head title="Edit Category" />
            <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
            <form onSubmit={submit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                    {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Category Image</label>
                    {imagePreview && (
                        <div className="mb-3">
                            <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded border" />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded"
                    />
                    {errors.image && <div className="text-red-600 text-sm">{errors.image}</div>}
                </div>

                <div>
                    <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Update
                    </button>
                </div>
            </form>
        </>
    );
};

Edit.layout = page => <AdminLayout children={page} />;

export default Edit;