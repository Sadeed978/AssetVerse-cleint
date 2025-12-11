import React from 'react';
import Navber from './Component/Navber';
import Footer from './Component/Footer';
import { Outlet } from 'react-router';
const Root = () => {
    return (
        <div>
            <Navber></Navber>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;