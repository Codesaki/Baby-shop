import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const Edit = ({ category }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.catalog.categories.update', category.id));
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