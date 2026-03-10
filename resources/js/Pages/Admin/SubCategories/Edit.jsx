import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const Edit = ({ subCategory, categories }) => {
    const { data, setData, patch, processing, errors } = useForm({
        name: subCategory.name,
        category_id: subCategory.category_id
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.catalog.sub-categories.update', subCategory.id));
    };

    return (
        <>
            <Head title={`Edit ${subCategory.name}`} />
            <h1 className="text-2xl font-bold mb-4">Edit Sub-Category</h1>
            <form onSubmit={submit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <div className="text-red-600 text-sm">{errors.category_id}</div>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
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
