// adminhomepage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import MarkerComponent from './marker';
import styles from './adminhomepage.module.css';

function AdminHomepage() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [users, setUsers] = useState([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) setToken(savedToken);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8081/users');
                if (response.status === 200) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const logout = async () => {
        try {
            const response = await axios.post('http://localhost:8081/logout', {}, { withCredentials: true });
            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8081/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    };

    const center = users.length > 0 ? 
        { lat: parseFloat(users[0].selected_latitude), lng: parseFloat(users[0].selected_longitude) } : 
        { lat: 3.1390, lng: 101.6869 };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <button onClick={logout} className={`${styles.button} ${styles.logoutButton}`}>Logout</button>
            </header>
            <main className={styles.main}>
                <section className={styles.card}>
                    <h2>Admin Actions</h2>
                    <div className={styles.actions}>
                        <Link to="/manage-users" className={styles.actionButton}>Manage Users</Link>
                        <Link to="/view-reports" className={styles.actionButton}>View Reports</Link>
                        <Link to="/settings" className={styles.actionButton}>Settings</Link>
                    </div>
                </section>

                <section className={styles.card}>
                    <h2>User Locations</h2>
                    <LoadScript googleMapsApiKey="AIzaSyBuPum0hFde7ZQLB6arVJ0F2EQJfmPv0Rs">
                        <GoogleMap 
                            mapContainerStyle={mapContainerStyle} 
                            center={center} 
                            zoom={10}
                            onLoad={() => setIsMapLoaded(true)}
                        >
                            {isMapLoaded && users.map((user) => (
                                <MarkerComponent key={user.id} user={user} />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                </section>

                <section className={styles.card}>
                    <h2>User Database</h2>
                    {users.length > 0 ? (
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>IC</th>
                                    <th>Images</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Shop Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.ic}</td>
                                        <td>
                                            {Array.isArray(user.images) && user.images.length > 0 ? (
                                                user.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt="User"
                                                        width="40"
                                                        height="40"
                                                        style={{ marginRight: '5px', borderRadius: '8px' }}
                                                    />
                                                ))
                                            ) : <span>No images</span>}
                                        </td>
                                        <td>{user.selected_latitude}, {user.selected_longitude}</td>
                                        <td>{user.status}</td>
                                        <td>{user.selected_address}</td>
                                        <td>
                                            <button 
                                                onClick={() => deleteUser(user.id)} 
                                                className={`${styles.button} ${styles.deleteButton}`}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No users found.</p>}
                </section>
            </main>
        </div>
    );
}

export default AdminHomepage;
