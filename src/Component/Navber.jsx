import React from 'react';
import { Link } from 'react-router';
import { FaRegUserCircle } from 'react-icons/fa';
import { use } from 'react';
import AuthContext from '../contexts/AuthContexts';
import Logo from './Logo';
const Navber = () => {
    const { setUser,user, LogingOut, } = use(AuthContext);
    const link = (<>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/HRRegister">Registration As HR</Link></li>
        <li><Link to="/EmployeeRegister">Registration As Employee</Link></li>
    </>);
    const handleLogOut = () => {
        LogingOut()
            .then(() => {
                setUser(null);
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };
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
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
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
                    { user ? (

                        <div className='flex item -end gap-3'>
                            
                               
                                <div className="dropdown dropdown-start">
                                    <div tabIndex={0} role="button" ><div>
                                    { user.photoURL ? (
                                    <img
                                        src={ user.photoURL}
                                        alt={ user.displayName || 'User'}
                                        className='w-10 h-10 rounded-full'></img>
                                ) : (
                                    <FaRegUserCircle className='w-10 h-10'></FaRegUserCircle>
                                )}
                                        </div></div>
                                    <ul tabIndex="-1" className="dropdown-content menu bg-base-100  z-1 w-52 p-2 shadow-sm">
                                       
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