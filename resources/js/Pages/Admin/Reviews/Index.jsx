import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const ReviewsIndex = ({ reviews, filters }) => {
    const [status, setStatus] = useState(filters?.status || '');
    const [rating, setRating] = useState(filters?.rating || '');
    const { get, patch, delete: destroy } = useForm();

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.content.reviews.index'), { status, rating });
    };

    return (
        <>
            <Head title="Reviews" />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>

                <form onSubmit={handleFilter} className="bg-white rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded"
                        >
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Filter
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reviews.data.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">{review.product_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{review.customer_name}</td>
                                    <td className="px-6 py-4 text-yellow-500">{'⭐'.repeat(review.rating)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            review.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2 text-sm">
                                        {review.status !== 'approved' && (
                                            <button
                                                onClick={() => patch(route('admin.content.reviews.approve', review.id))}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {review.status !== 'rejected' && (
                                            <button
                                                onClick={() => patch(route('admin.content.reviews.reject', review.id))}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Reject
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this review?')) {
                                                    destroy(route('admin.content.reviews.destroy', review.id));
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

ReviewsIndex.layout = page => <AdminLayout children={page} />;

export default ReviewsIndex;
