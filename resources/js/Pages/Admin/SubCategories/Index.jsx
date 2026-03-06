import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

const Index = ({ subCategories }) => {
    const deleteSubCategory = (id) => {
        if (confirm('Delete this sub-category?')) {
            router.delete(route('admin.sub-categories.destroy', id));
        }
    };

    return (
        <>
            <Head title="Sub-Categories" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Sub-Categories</h1>
                <Link
                    href={route('admin.sub-categories.create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    New Sub-Category
                </Link>
            </div>

            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Slug</th>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subCategories.data.map(sub => (
                        <tr key={sub.id} className="border-t">
                            <td className="p-2">{sub.name}</td>
                            <td className="p-2">{sub.slug}</td>
                            <td className="p-2">{sub.category?.name}</td>
                            <td className="p-2 space-x-2">
                                <Link
                                    href={route('admin.sub-categories.edit', sub.id)}
                                    className="text-blue-600 mr-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => deleteSubCategory(sub.id)}
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
