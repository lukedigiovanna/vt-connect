import React, { useState, useEffect } from 'react';
import { apiGet } from "../constants/api";
import { Navbar } from "../components/Navbar";
import { Background } from "../components/Background";
import ReactWordcloud from 'react-wordcloud';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type StatusType = 'loading' | 'success' | 'failure';
type MajorDistribution = {
    major: string;
    count: number;
};
type EventPerMonth = {
    month: number;
    count: number;
};
type CombinedStatistics = {
    userCount: number;
    eventCount: number;
    majorDistribution: MajorDistribution[];
    eventsPerMonth: EventPerMonth[];
};

export const AdminDashboardPage = () => {
    const [statistics, setStatistics] = useState<CombinedStatistics | null>(null);
    const [status, setStatus] = useState<StatusType>('loading');

    useEffect(() => {
        (async () => {
            try {
                const result = await apiGet('/admin/statistics');
                setStatistics(result.data);
                setStatus('success');
            } catch (err: any) {
                console.error('Failed to fetch data:', err);
                setStatus('failure');
            }
        })();
    }, []);

    const words = statistics?.majorDistribution.map(dist => {
        return { text: dist.major, value: dist.count };
    });

    const options = {
        rotations: 2,
        rotationAngles: [-90, 0] as [number, number],
        fontSizes: [16, 50] as [number, number],
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    const histogramData = {
        labels: monthNames,
        datasets: [
            {
                label: 'Number of Events',
                data: monthNames.map(month => {
                    const event = statistics?.eventsPerMonth.find(e => monthNames[e.month - 1] === month);
                    return event ? event.count : 0;
                }),
                backgroundColor: 'rgba(123, 17, 58, 1)',
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0
                }
            }
        },
        plugins: {
            legend: {
                display: true
            }
        }
    };

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
                <div>Failed to load data.</div>
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
                    <h2 className="text-3xl font-semibold mb-4">Statistics:</h2>
                    <p>Total Users: <span className="font-bold text-maroon-600">{statistics?.userCount}</span></p>
                    <p>Total Events: <span className="font-bold text-maroon-600">{statistics?.eventCount}</span></p>
                    
                    <h3 className="font-semibold mt-4 mb-2">User Distribution by Major:</h3>
                    {statistics && <ReactWordcloud words={words || []} options={options} />}

                    <h3 className="font-semibold mt-4 mb-2">Events Per Month:</h3>
                    <Bar data={histogramData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
