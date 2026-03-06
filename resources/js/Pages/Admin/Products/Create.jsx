import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const Create = ({ categories }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        category_id: '',
        sub_category_id: '',
        short_description: '',
        long_description: '',
        price: '',
        discount_price: '',
        is_featured: false,
        is_new_arrival: false,
        is_popular: false,
        images: []
    });

    const [subs, setSubs] = useState([]);

    useEffect(() => {
        if (data.category_id) {
            fetch(`/api/categories/${data.category_id}/sub-categories`)
                .then(res => res.json())
                .then(data => setSubs(data));
        } else {
            setSubs([]);
        }
    }, [data.category_id]);

    const handleFileChange = (e) => {
        setData('images', Array.from(e.target.files));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
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
                <div>
                    <label className="block text-sm font-medium">SKU</label>
                    <input
                        type="text"
                        value={data.sku}
                        onChange={e => setData('sku', e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.sku && <div className="text-red-600 text-sm">{errors.sku}</div>}
                </div>
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
                <div className="grid grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium">Discount Price ($)</label>
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