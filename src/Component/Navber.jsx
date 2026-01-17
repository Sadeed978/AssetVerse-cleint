import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaRegUserCircle } from 'react-icons/fa';
import { use } from 'react';
import AuthContext from '../contexts/AuthContexts';
import Logo from './Logo';
import { NavLink } from 'react-router';
import { toast } from 'react-toastify';
const Navber = () => {
    const { setUser, user, LogingOut, } = use(AuthContext);
    const [role, setRole] = useState(null);
    const linkClass = ({ isActive }) => (isActive ? 'text-blue-500  font-bold' : 'default');

    const link = (<>
        <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
        <li><NavLink to="/HRRegister" className={linkClass}>Registration As HR</NavLink></li>
        <li><NavLink to="/EmployeeRegister" className={linkClass}>Registration As Employee</NavLink></li>
        {user && <>
            <li><NavLink to='/dashboard/profile' className={linkClass}>Profile</NavLink></li>
        </>}
        {role === 'hr' && <>
            <li> <NavLink to='/Dashboard/HR' className={linkClass}>Dashboard</NavLink></li> </>}

        {role === 'employee' && <>
                <li> <NavLink to='/Dashboard/Employee' className={linkClass}>Dashboard</NavLink></li></>}
    </>);


    const handleLogOut = () => {
        LogingOut()
            .then(() => {
                setUser(null);
                toast.success('Logout Successful');
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };
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
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-20 mt-3 w-52 p-2 shadow">
                            {link}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl"><Logo></Logo></a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {link}
                    </ul>
                </div>
                <div className="navbar-end">
                    <div className="navbar-end">
                        {user ? (
                            <div className='flex item -end gap-3'>
                                <div className="dropdown dropdown-start">
                                    <div tabIndex={0} role="button" ><div>
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName || 'User'}
                                                className='w-10 h-10 rounded-full'></img>
                                        ) : (
                                            <FaRegUserCircle className='w-10 h-10'></FaRegUserCircle>
                                        )}
                                    </div></div>
                                    <ul tabIndex="-1" className="dropdown-content menu bg-base-100  z-80 w-52 p-2 -ml-20 shadow-sm">
                                        <li className='font-bold text-black-600'>{user.name}</li>
                                        <li className='font-bold text-black-600'>{user.email}</li>
                                        {role === 'hr' && <>
                                            <li> <NavLink to='/Dashboard/HR' className={linkClass}>Dashboard</NavLink></li>
                                            <li><NavLink to='/Dashboard/AssetList' className={linkClass}> Asset List</NavLink></li>
                                            <li> <NavLink to='/Dashboard/Profile'> Profile</NavLink></li>
                                            <li> <NavLink to='/Dashboard/AddAssert' className={linkClass}> Add Asset</NavLink> </li>
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
                                    </ul>
                                </div>


                                <button onClick={handleLogOut} className='btn btn-sm btn-outline btn-warning'>Log out</button>
                            </div>) : (
                            <Link to='/Login' className="btn btn-outline text-blue-600">Login</Link>)}


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navber;