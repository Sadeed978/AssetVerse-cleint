import React from 'react';
import Navber from './Component/Navber';
import Footer from './Component/Footer';
import { Outlet } from 'react-router';
const Root = () => {
    return (
        <div className="bg-base-100 min-h-screen flex flex-col">
            <Navber></Navber>
            <div className="flex-1">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Root;