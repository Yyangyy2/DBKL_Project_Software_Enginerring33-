
import Login from '../../../dbkl/Frontend/src/Component/Admin login/admin_login'
import Register from './Component/Admin register/admin_register'
import Homepage from './Component/homepage/homepage';


//import React router dom
import{
  createBrowserRouter,
  RouterProvider,
  Navigate
}from 'react-router-dom'

//create a router
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

])

function App() {
  return (
    <>
    <div>
      <RouterProvider router={router}/>
    </div>  
    </>
  );
}

export default App;
