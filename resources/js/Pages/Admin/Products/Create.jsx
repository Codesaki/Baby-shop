import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const Create = ({ categories, subCategories, mediaImages = [] }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        sub_category_id: '',
        short_description: '',
        long_description: '',
        quantity: 0,
        low_stock_threshold: 10,
        price: '',
        discount_price: '',
        is_featured: false,
        is_new_arrival: false,
        is_popular: false,
        images: [],
        media_ids: [],
    });

    const [subs, setSubs] = useState([]);

    useEffect(() => {
        if (data.category_id) {
            // filter local list rather than calling API
            const filtered = (subCategories || []).filter(
                s => s.category_id === parseInt(data.category_id, 10)
            );
            setSubs(filtered);
        } else {
            setSubs([]);
        }
    }, [data.category_id, subCategories]);

    const handleFileChange = (e) => {
        setData('images', Array.from(e.target.files));
    };

    const toggleMedia = (id) => {
        setData(
            'media_ids',
            data.media_ids.includes(id) ? data.media_ids.filter((x) => x !== id) : [...data.media_ids, id],
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.catalog.products.store'));
    };

    return (
        <>
            <Head title="New Product" />
            <h1 className="text-2xl font-bold mb-4">Add Product</h1>
            <form onSubmit={submit} className="space-y-4 max-w-2xl" encType="multipart/form-data">
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
                <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded p-3">
                    SKU is generated automatically from category and subcategory when you save (e.g. <span className="font-mono">BABY-ONES-000042</span>).
                </p>
                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <div className="text-red-600 text-sm">{errors.category_id}</div>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Sub-category</label>
                    <select
                        value={data.sub_category_id}
                        onChange={e => setData('sub_category_id', e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select</option>
                        {subs.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    {errors.sub_category_id && <div className="text-red-600 text-sm">{errors.sub_category_id}</div>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Short Description</label>
                    <textarea
                        value={data.short_description}
                        onChange={e => setData('short_description', e.target.value)}
                        className="w-full border p-2 rounded"
                    ></textarea>
                    {errors.short_description && <div className="text-red-600 text-sm">{errors.short_description}</div>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Long Description</label>
                    <textarea
                        value={data.long_description}
                        onChange={e => setData('long_description', e.target.value)}
                        className="w-full border p-2 rounded h-32"
                    ></textarea>
                    {errors.long_description && <div className="text-red-600 text-sm">{errors.long_description}</div>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Initial Stock (Qty)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.quantity && <div className="text-red-600 text-sm">{errors.quantity}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Low Stock Threshold</label>
                        <input
                            type="number"
                            min="0"
                            value={data.low_stock_threshold}
                            onChange={(e) => setData('low_stock_threshold', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.low_stock_threshold && <div className="text-red-600 text-sm">{errors.low_stock_threshold}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="0.00"
                        />
                        {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Discount Amount ($)</label>
                        <p className="text-xs text-gray-500 mb-1">Enter the discount amount to subtract from the price</p>
                        <input
                            type="number"
                            step="0.01"
                            value={data.discount_price}
                            onChange={e => setData('discount_price', e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="0.00"
                        />
                        {errors.discount_price && <div className="text-red-600 text-sm">{errors.discount_price}</div>}
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-medium">Product Features</label>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={e => setData('is_featured', e.target.checked)}
                                className="mr-2"
                            />
                            Featured Product
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_new_arrival}
                                onChange={e => setData('is_new_arrival', e.target.checked)}
                                className="mr-2"
                            />
                            New Arrival
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_popular}
                                onChange={e => setData('is_popular', e.target.checked)}
                                className="mr-2"
                            />
                            Popular Product
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Images (max 5)</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full"
                    />
                    {errors.images && <div className="text-red-600 text-sm">{errors.images}</div>}
                    {errors['images.*'] && <div className="text-red-600 text-sm">{errors['images.*']}</div>}
                </div>

                <div className="bg-white rounded border p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Or add from Media Library</div>
                        <div className="text-xs text-gray-500">{data.media_ids.length} selected</div>
                    </div>
                    {mediaImages.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {mediaImages.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => toggleMedia(m.id)}
                                    className={`relative rounded overflow-hidden border ${
                                        data.media_ids.includes(m.id) ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'
                                    }`}
                                    title={m.original_filename}
                                >
                                    <div className="aspect-square bg-gray-100">
                                        <img src={`/storage/${m.path}`} alt={m.original_filename} className="w-full h-full object-cover" />
                                    </div>
                                    {data.media_ids.includes(m.id) && (
                                        <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                                            ✓
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">No media images found.</div>
                    )}
                    {errors.media_ids && <div className="text-red-600 text-sm mt-2">{errors.media_ids}</div>}
                </div>
                <div>
                    <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Save
                    </button>
                </div>
            </form>
        </>
    );
};

Create.layout = page => <AdminLayout children={page} />;

export default Create;