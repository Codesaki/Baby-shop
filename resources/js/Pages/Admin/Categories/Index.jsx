import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

const Index = ({ categories }) => {
    const deleteCategory = (id) => {
        if (confirm('Delete this category? Any subcategories will also be deleted.')) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    return (
        <>
            <Head title="Categories" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Link
                    href={route('admin.categories.create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    New Category
                </Link>
            </div>

            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Slug</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.data.map(cat => (
                        <tr key={cat.id} className="border-t">
                            <td className="p-2">{cat.name}</td>
                            <td className="p-2">{cat.slug}</td>
                            <td className="p-2 space-x-2">
                                <Link
                                    href={route('admin.categories.edit', cat.id)}
                                    className="text-blue-600 mr-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => deleteCategory(cat.id)}
                                    className="text-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

Index.layout = page => <AdminLayout children={page} />;

export default Index;
