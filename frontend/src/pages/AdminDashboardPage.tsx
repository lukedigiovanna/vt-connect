import React, { useState, useEffect } from 'react';
import { apiGet } from "../constants/api";
import { Navbar } from "../components/Navbar";
import { Background } from "../components/Background";

type StatusType = 'loading' | 'success' | 'failure';
type AdminStatistics = {
    userCount: number;
    eventCount: number;
};

export const AdminDashboardPage = () => {
    const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
    const [status, setStatus] = useState<StatusType>('loading');

    useEffect(() => {
        (async () => {
            try {
                const result = await apiGet('/admin/statistics');
                setStatistics(result.data);
                setStatus('success');
            } catch (err: any) {
                console.error('Failed to fetch statistics:', err);
                setStatus('failure');
            }
        })();
    }, []);

    if (status === 'loading') {
        return (
            <div>
                <Background />
                <Navbar />
                <div>Loading...</div>
            </div>
        );
    }

    if (status === 'failure') {
        return (
            <div>
                <Background />
                <Navbar />
                <div>Failed to load statistics.</div>
            </div>
        );
    }

    return (
        <div>
            <Background />
            <Navbar />

            <div className="mx-auto my-0 max-w-4xl bg-gray-50/90 px-8 py-4">
                <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
                <div className="text-lg">
                    <h2 className="text-2xl font-semibold mb-4">Statistics:</h2>
                    <p className="mb-2">Total Users: <span className="font-bold text-maroon-600">{statistics?.userCount}</span></p>
                    <p>Total Events: <span className="font-bold text-maroon-600">{statistics?.eventCount}</span></p>
                    {/* More detailed statistics and charts here */}
                </div>
            </div>
        </div>
    );
};
