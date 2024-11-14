import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './Component/login/login';
import Register from './Component/register/register';
import Homepage from './Component/homepage/homepage';
import Camera from './Component/Camera/Camera';
import AdminHomepage from './Component/adminhomepage/adminhompage';
import ManageUsers from './Component/adminhomepage/manageuser';

const router = createBrowserRouter([
    { 
        path: '/', 
        element: <Navigate to="/login" replace /> // Redirect to /login
    },
    {
        path: '/login',
        element: <div><Login/></div>
    },
    {
        path: '/register',
        element: <div><Register/></div>
    },
    {
        path: '/homepage',
        element: <div><Homepage/></div>
    },
    {
        path: '/camera',
        element: <div><Camera/></div>
    },
    {
        path: '/adminhomepage', 
        element: <div><AdminHomepage/></div>
    },
    {
        path: '/manageuser', 
        element: <div><ManageUsers/></div>
    }
]);

function App() {
    return (
        <div>
            <RouterProvider router={router}/>
        </div>  
    );
}

export default App;