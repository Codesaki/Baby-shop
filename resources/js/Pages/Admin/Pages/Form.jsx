import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const PageForm = ({ page }) => {
    const { data, setData, post, put, processing } = useForm({
        title: page?.title || '',
        content: page?.content || '',
        meta_title: page?.meta_title || '',
        meta_description: page?.meta_description || '',
        status: page?.status || 'draft',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (page) {
            put(route('admin.content.pages.update', page.id), data);
        } else {
            post(route('admin.content.pages.store'), data);
        }
    };

    return (
        <>
            <Head title={page ? 'Edit Page' : 'Create Page'} />
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">{page ? 'Edit Page' : 'Create New Page'}</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            placeholder="Page title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded h-96 font-mono text-sm"
                            placeholder="Enter page content (HTML supported)"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                            <input
                                type="text"
                                value={data.meta_title}
                                onChange={(e) => setData('meta_title', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                placeholder="SEO title"
                                maxLength="60"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                        <textarea
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded h-20"
                            placeholder="SEO description"
                            maxLength="160"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                        {page ? 'Update' : 'Create'} Page
                    </button>
                </form>
            </div>
        </>
    );
};

PageForm.layout = page => <AdminLayout children={page} />;

export default PageForm;
