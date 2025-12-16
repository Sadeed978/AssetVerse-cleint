import React from 'react';
import AuthContext from './contexts/AuthContexts';
import { Navigate, useLocation } from 'react-router';
import { use } from 'react';

const PrivateRoute = ({children}) => {
    const {user, loading}= use(AuthContext);
    const location=useLocation();
    if(loading){
        return <span className="loading loading-ball loading-lg"></span>;
    }
    if(!user){
        return <Navigate to="/login" state={{from: location}} replace></Navigate>;
    }
    return (
        children
    ) ;
    
};

export default PrivateRoute;