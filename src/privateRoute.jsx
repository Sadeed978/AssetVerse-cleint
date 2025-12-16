import React, { use } from 'react';
import AuthContext from './contexts/AuthContexts';
import { Navigate, useLocation } from 'react-router';

const privateRoute = ({children}) => {
    const location = useLocation();
    const {user, loading}= use(AuthContext);
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

export default privateRoute;