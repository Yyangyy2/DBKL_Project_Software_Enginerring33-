// File: ./Component/adminhomepage/adminhomepage.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './adminhomepage.module.css';

function AdminHomepage() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [users, setUsers] = useState([]);

    // Load token from local storage on component mount
    useEffect(() => {
        const loadToken = () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) setToken(savedToken);
        };
        loadToken();
    }, []);

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8081/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200) {
                    console.log("Fetched users:", response.data); // Debugging log
                    setUsers(response.data);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
    
        fetchUsers();
    }, []);
    

    // Logout function to clear token and redirect to login page
    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8081/logout', {}, {
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('Logout successful');
                setToken(null);
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert('Logout unsuccessful!');
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Error logging out, please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </header>
            <main className={styles.main}>
                <section className={styles.section}>
                    <h2>Admin Actions</h2>
                    <div className={styles.actions}>
                        <Link to="/manage-users" className={styles.actionButton}>Manage Users</Link>
                        <Link to="/view-reports" className={styles.actionButton}>View Reports</Link>
                        <Link to="/settings" className={styles.actionButton}>Settings</Link>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>User Database</h2>
                    {users.length > 0 ? (
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>IC</th>
                                    <th>Images</th>
                                    <th>Captured Latitude</th>
                                    <th>Captured Longitude</th>
                                    <th>Selected Latitude</th>
                                    <th>Selected Longitude</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.ic}</td>
                                        <td>
                                            {user.images && user.images.length > 0 ? (
                                                user.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt="User"
                                                        width="50"
                                                        height="50"
                                                        style={{ marginRight: '5px' }}
                                                    />
                                                ))
                                            ) : (
                                                <span>No images</span>
                                            )}
                                        </td>
                                        <td>{user.captured_latitude}</td>
                                        <td>{user.captured_longitude}</td>
                                        <td>{user.selected_latitude}</td>
                                        <td>{user.selected_longitude}</td>
                                        <td>{user.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users found.</p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AdminHomepage;
