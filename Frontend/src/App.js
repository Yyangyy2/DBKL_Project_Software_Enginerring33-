import Login from './Component/login/login';
import Register from './Component/register/register';
import Homepage from './Component/homepage/homepage';
import Camera from './Component/Camera/Camera';
import AdminHomepage from './Component/adminhomepage/adminhomepage'; // Import AdminHomepage component

// import React router dom
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

// create a router
const router = createBrowserRouter([
  { 
    path: '/', // Default route
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
    path: '/adminhomepage', // New route for admin homepage
    element: <div><AdminHomepage/></div>
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
