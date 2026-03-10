import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const AdminUsersIndex = ({ admins, filters }) => {
    const [search, setSearch] = React.useState(filters?.search || '');
    const { get, delete: destroy } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.system.admin-users.index'), { search });
    };

    return (
        <>
            <Head title="Admin Users" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
                    <Link
                        href={route('admin.system.admin-users.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                        + Add Admin User
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded"
                        />
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Search
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roles</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {admins.data.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{admin.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {admin.admin_roles?.map((role) => (
                                            <span key={role.id} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs mr-1">
                                                {role.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 space-x-2 text-sm">
                                        <Link href={route('admin.system.admin-users.edit', admin.id)} className="text-blue-600 hover:text-blue-700">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this admin user?')) {
                                                    destroy(route('admin.system.admin-users.destroy', admin.id));
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

AdminUsersIndex.layout = page => <AdminLayout children={page} />;

export default AdminUsersIndex;
