import React from 'react';
import Logo from './Component/Logo';
import { Outlet } from 'react-router';
import { use, useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import AuthContext from './contexts/AuthContexts';

const DashboardLayout = () => {
    const { user, LogingOut, } = use(AuthContext);
    const [role, setRole] = useState(null);
    const linkClass = ({ isActive }) => (isActive ? 'text-blue-500  font-bold' : 'default');
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:3000/users/${user?.email}`)
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
                <Logo></Logo>
            </div>
            <div className="flex">
                <div className="menu p-8 w-50 bg-base-200 text-base-content">
                    <li><NavLink>DashboardHome</NavLink></li>
                    {role === 'hr' && <>
                        <li><NavLink to='/AssetList' className={linkClass}> Asset List</NavLink></li>
                        <li> <NavLink> Profile</NavLink></li>
                        <li> <NavLink to='/AddAssert' className={linkClass}> Add Asset</NavLink> </li>
                        <li> <NavLink to='/Requirement' className={linkClass}> All Requireme</NavLink></li>
                        <li> <NavLink to='/EmployeeList' className={linkClass}> Employee List</NavLink></li>
                    </>}
                    {role === 'employee' && <>
                        <li><NavLink to='/MyAssets' className={linkClass}> My Assets</NavLink></li>
                        <li> <NavLink> Profile</NavLink></li>
                        <li> <NavLink to='/RequestAsset' className={linkClass}> Request Asset</NavLink> </li>
                        <li><NavLink to='/ myteam' className={linkClass}>My Team</NavLink></li>
                    </>}
                </div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default DashboardLayout;