import React from 'react';
import Logo from './Component/Logo';
import { Outlet } from 'react-router';
import { use, useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { Link } from 'react-router';
import AuthContext from './contexts/AuthContexts';
import Footer from './Component/Footer';

const DashboardLayout = () => {
    const { user, LogingOut, } = use(AuthContext);
    const [role, setRole] = useState(null);
    const linkClass = ({ isActive }) => (isActive ? 'text-blue-500  font-bold' : 'default');
    useEffect(() => {
        if (user) {
            fetch(`https://asset-verse-server-phi.vercel.app/users/${user?.email}`)
                .then(res => res.json())
                .then(data => {
                    console.log('Fetched user data:', data);
                    setRole(data.role);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [user]);
    return (
        <div className="bg-base-100 min-h-screen flex flex-col">
            <div className="bg-base-100 shadow-sm px-4 py-2">
                <Link to='/' className="">
                    <Logo></Logo>
                </Link>
            </div>
            <div className="flex flex-1">
                <div className="menu p-8 w-50 bg-base-200 text-base-content min-h-full">
                   
                    {role === 'hr' && <>
                        <li> <NavLink to='/Dashboard/HR' className={linkClass}>Dashboard</NavLink></li>
                        <li><NavLink to='/Dashboard/AssetList' className={linkClass}> Asset List</NavLink></li>
                        <li> <NavLink to='/Dashboard/Profile'> Profile</NavLink></li>
                        <li> <NavLink to='/Dashboard/AddAssert' className={linkClass}> Add Asset</NavLink></li>
                        <li> <NavLink to='/Dashboard/AllRequiests' className={linkClass}> All Request</NavLink></li>
                        <li> <NavLink to='/Dashboard/EmployeeList' className={linkClass}> Employee List</NavLink></li>
                    </>}
                    {role === 'employee' && <>
                        <li> <NavLink to='/Dashboard/Employee' className={linkClass}>Dashboard</NavLink></li>
                        <li><NavLink to='/Dashboard/MyAssets' className={linkClass}> My Assets</NavLink></li>
                        <li> <NavLink to='/Dashboard/Profile'> Profile</NavLink></li>
                        <li> <NavLink to='/Dashboard/RequestAsset' className={linkClass}> Request Asset</NavLink> </li>
                        <li><NavLink to='/Dashboard/myteam' className={linkClass}>My Team</NavLink></li>
                    </>}
                </div>
                <div className="flex-1 bg-base-100">
                    <Outlet></Outlet>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default DashboardLayout;