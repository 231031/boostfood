import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import all components
import Register from './components/seller/Register';
import Username from './components/seller/Username';
import Recover from './components/seller/Recover';
import Pagenotfound from './components/Pagenotfound';
import Reset from './components/seller/Reset';
import Addfood from './components/seller/Addfood';

// root routes
const router =createBrowserRouter(
  [
    {
      path: '/login',
      element : <Username></Username>
    },
    {
      path: '/register',
      element : <Register></Register>
    },
    {
      path: '/recover',
      element : <Recover></Recover>
    },
    {
      path: '/reset',
      element : <Reset></Reset>
    },
    {
      path: '/addfood',
      element : <Addfood></Addfood>
    },
    {
      path: '*',
      element : <Pagenotfound></Pagenotfound>
    },
  ]
)
function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  )
}

export default App
