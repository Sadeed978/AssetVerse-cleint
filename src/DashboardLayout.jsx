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
        <div>
            <div>
                <Link to='/' className="">
                <Logo></Logo>
                </Link>


            </div>
            <div className="flex">
                <div className="menu p-8 w-50 bg-base-200 text-base-content">
                   
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
                <Outlet></Outlet>
            </div>
           
            <div>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default DashboardLayout;