import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from "../constants/api";
import { Navbar } from "../components/Navbar";
import { Background } from "../components/Background";
import ReactWordcloud from 'react-wordcloud';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Swal from 'sweetalert2';
import { passwordRegex } from '../constants/password';
import {useNavigate} from "react-router-dom"

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

    const navigate = useNavigate()
    const handleCreateAdmin = async() => {
        const { value: formValues } = await Swal.fire({
            title: 'Create Another Admin',
            html:
            '<input id="swal-pid" class="swal2-input" placeholder="Hokie PID">' +

                '<input id="swal-first-name" class="swal2-input" placeholder="First Name">' +
                '<input id="swal-last-name" type="swal2-input" class="swal2-input" placeholder="Last Name">' +
                '<input id="swal-major" type="swal2-input" class="swal2-input" placeholder="Major">' +
                '<input id="swal-password" type="password" class="swal2-input" placeholder="Password">',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Create',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return {
                    pid: (document.getElementById('swal-pid') as HTMLInputElement).value,
                    firstName: (document.getElementById('swal-first-name') as HTMLInputElement).value,
                    lastName: (document.getElementById('swal-last-name') as HTMLInputElement).value, 
                    newPassword: (document.getElementById('swal-password') as HTMLInputElement).value,
                    major: (document.getElementById('swal-major') as HTMLInputElement).value

                };
            },
        });

        if (formValues) {
            console.log('PID:', formValues.pid);
            console.log('New Password:', formValues.newPassword);
            console.log('New major:', formValues.major);

            // Check password complexity
            if (!isPasswordComplex(formValues.newPassword)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'Password must contain an uppercase letter, a lowercase letter, a special character, and be at least 8 characters long',
                });
            }

            else {

            const pid = formValues.pid 
            const password = formValues.newPassword 
            const firstName = formValues.firstName 
            const lastName = formValues.lastName        
            const admin = true 
            const major = formValues.major 
            const bio = null 

            try {
                const changed_pwd_response = (
                    await apiPost("/signup", {
                    pid, password, firstName, lastName, admin, major, bio 
                    })
                );


                if (changed_pwd_response.status === 200) {

                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Your password has been successfully changed",
                        showConfirmButton: true,
                    });
                }
            
            } catch (error) {
                console.log("error " + error)
            }
        }
        }
    };

    const isPasswordComplex = (password: string): boolean => {
        return passwordRegex.test(password);
    };
    
    
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

    

      const words = statistics?.majorDistribution?.map(dist => {
        return { text: dist.major, value: dist.count };
    }) || [];
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
                                        const event = statistics?.eventsPerMonth?.find(e => monthNames[e.month - 1] === month);
                                        return event ? event.count : 0;
                                    }) || [], // Provide a default value (empty array) if statistics?.eventsPerMonth is null or undefined
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
        Swal.fire({
            icon: 'error',
            title: 'You do not have access!',
            text: 'You do not have permission to access this resource!',
            showCancelButton: false,
            confirmButtonText: 'Go to Login',
            allowOutsideClick: false,   
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/login');
            }
        });
    
        return (
            <div>
                <Background />
                <Navbar />
                {/* Render a placeholder UI or nothing, as the SweetAlert will handle the error message */}
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
                
                <div className="text-lg mt-6 mb-6">
    <button onClick={handleCreateAdmin} className="bg-maroon-600 text-white py-2 px-4 rounded-md">
        Create New Admin
    </button>
</div>

            </div>
        </div>
    );
};

export default AdminDashboardPage;
