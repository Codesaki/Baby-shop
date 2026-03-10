import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const ContactMessagesIndex = ({ messages, filters }) => {
    const [status, setStatus] = useState(filters?.status || '');
    const { get, delete: destroy } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.content.contact-messages.index'), { status });
    };

    return (
        <>
            <Head title="Contact Messages" />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>

                <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4">
                    <div className="flex gap-4">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded"
                        >
                            <option value="">All Messages</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
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
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">From</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {messages.data.map((msg) => (
                                <tr key={msg.id} className={msg.status === 'unread' ? 'bg-blue-50' : ''}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{msg.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{msg.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            msg.status === 'unread' ? 'bg-blue-100 text-blue-700' :
                                            msg.status === 'replied' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {msg.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{msg.created_at}</td>
                                    <td className="px-6 py-4">
                                        <Link href={route('admin.content.contact-messages.show', msg.id)} className="text-blue-600 hover:text-blue-700 text-sm">
                                            View
                                        </Link>
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

ContactMessagesIndex.layout = page => <AdminLayout children={page} />;

export default ContactMessagesIndex;
