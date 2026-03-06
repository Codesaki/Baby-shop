import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

const Index = ({ products }) => {
    const deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <>
            <Head title="Products" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link
                    href={route('admin.products.create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    New Product
                </Link>
            </div>

            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">SKU</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.data.map(p => (
                        <tr key={p.id} className="border-t">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2">{p.sku}</td>
                            <td className="p-2">{p.category?.name}</td>
                            <td className="p-2">{p.quantity}</td>
                            <td className="p-2">{new Date(p.created_at).toLocaleDateString()}</td>
                            <td className="p-2">
                                <Link
                                    href={route('admin.products.edit', p.id)}
                                    className="text-blue-600 mr-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => deleteProduct(p.id)}
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
