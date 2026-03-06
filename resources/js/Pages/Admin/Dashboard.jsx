import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const Dashboard = () => {
    return (
        <>
            <Head title="Admin Dashboard" />
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to the admin panel.</p>
        </>
    );
};

Dashboard.layout = page => <AdminLayout children={page} />;

export default Dashboard;
