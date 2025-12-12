import React from 'react';
import LogoImg from '../assets/logo.png';
const Logo = () => {
    return (
        <div className='flex items-center gap-2'>
            <img src={LogoImg} alt="" className='w-10 item-end' />
            <h1 className='font-bold text-blue-600'>AssetsVerse</h1>

        </div>
    );
};

export default Logo;