import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

const Form = ({ cta }) => {
    const isEdit = !!cta;
    const { data, setData, post, put, processing, errors } = useForm({
        headline: cta?.headline ?? '',
        tagline: cta?.tagline ?? '',
        body_text: cta?.body_text ?? '',
        button_label: cta?.button_label ?? 'Shop now',
        button_url: cta?.button_url ?? '/',
        background_image: cta?.background_image ?? '',
        gradient_preset: cta?.gradient_preset ?? 'primary-secondary',
        sort_order: cta?.sort_order ?? 0,
        is_active: cta?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.content.landing-ctas.update', cta.id));
        } else {
            post(route('admin.content.landing-ctas.store'));
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit CTA' : 'New CTA'} />
            <div className="mb-4">
                <Link href={route('admin.content.landing-ctas.index')} className="text-blue-600 text-sm">
                    ← Back to list
                </Link>
            </div>
            <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit landing CTA' : 'New landing CTA'}</h1>

            <form onSubmit={submit} className="max-w-2xl space-y-4 bg-white p-6 rounded shadow">
                <div>
                    <label className="block text-sm font-medium mb-1">Headline *</label>
                    <input
                        type="text"
                        value={data.headline}
                        onChange={(e) => setData('headline', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.headline && <p className="text-red-600 text-sm mt-1">{errors.headline}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tagline (short line under headline)</label>
                    <input
                        type="text"
                        value={data.tagline}
                        onChange={(e) => setData('tagline', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Body text (optional)</label>
                    <textarea
                        value={data.body_text}
                        onChange={(e) => setData('body_text', e.target.value)}
                        rows={3}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Button label *</label>
                        <input
                            type="text"
                            value={data.button_label}
                            onChange={(e) => setData('button_label', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Button URL *</label>
                        <input
                            type="text"
                            value={data.button_url}
                            onChange={(e) => setData('button_url', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="/collections/clothing"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Background image URL (optional)</label>
                    <input
                        type="text"
                        value={data.background_image}
                        onChange={(e) => setData('background_image', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="https://... or leave empty for gradient"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Gradient preset (if no image)</label>
                    <select
                        value={data.gradient_preset}
                        onChange={(e) => setData('gradient_preset', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="primary-secondary">Primary → Secondary</option>
                        <option value="secondary-primary">Secondary → Primary</option>
                        <option value="primary-dark">Primary deep</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Sort order</label>
                        <input
                            type="number"
                            min="0"
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <span className="text-sm font-medium">Active</span>
                        </label>
                    </div>
                </div>
                <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">
                    {processing ? 'Saving…' : 'Save'}
                </button>
            </form>
        </>
    );
};

Form.layout = (page) => <AdminLayout children={page} />;

export default Form;
