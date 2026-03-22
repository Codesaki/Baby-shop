import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

const Index = ({ ctas }) => {
    const destroy = (id) => {
        if (confirm('Delete this landing CTA?')) {
            router.delete(route('admin.content.landing-ctas.destroy', id));
        }
    };

    return (
        <>
            <Head title="Landing CTAs" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Landing page CTAs</h1>
                <Link href={route('admin.content.landing-ctas.create')} className="px-4 py-2 bg-blue-600 text-white rounded">
                    New CTA
                </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                These appear on the home page after the first three category sections (carousel if multiple; 30s between slides).
            </p>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3 text-left">Headline</th>
                            <th className="p-3 text-left">Button</th>
                            <th className="p-3">Order</th>
                            <th className="p-3">Active</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ctas.data.map((c) => (
                            <tr key={c.id} className="border-t">
                                <td className="p-3 font-medium">{c.headline}</td>
                                <td className="p-3 text-gray-600">{c.button_label}</td>
                                <td className="p-3 text-center">{c.sort_order}</td>
                                <td className="p-3 text-center">{c.is_active ? 'Yes' : 'No'}</td>
                                <td className="p-3 text-right space-x-2">
                                    <Link href={route('admin.content.landing-ctas.edit', c.id)} className="text-blue-600">
                                        Edit
                                    </Link>
                                    <button type="button" onClick={() => destroy(c.id)} className="text-red-600">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

Index.layout = (page) => <AdminLayout children={page} />;

export default Index;
