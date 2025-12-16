import React from 'react';
import imageError from '../assets/error-404.png';
const ErrorPage = () => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <img src={imageError} alt="" />
            <h1 className='text-5xl text-center mt-20'>404 - Page Not Found</h1>
        </div>
    );
};

export default ErrorPage;