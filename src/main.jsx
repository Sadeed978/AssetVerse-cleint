import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import { ToastContainer } from 'react-toastify';
import App from './App.jsx'
import { router } from './Routes.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(

 <StrictMode>
  <AuthProvider> 
     <RouterProvider router={router} />
     <ToastContainer position="top-right" autoClose={3000} /> 
  </AuthProvider> ,
  </StrictMode>,
)
