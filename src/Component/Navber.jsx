import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { FaRegUserCircle } from 'react-icons/fa';
import { use } from 'react';
import AuthContext from '../contexts/AuthContexts';
import Logo from './Logo';
import { toast } from 'react-toastify';

const Navber = () => {
    const { setUser, user, LogingOut } = use(AuthContext);
    const [role, setRole] = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const linkClass = ({ isActive }) =>
        isActive
            ? 'text-primary font-semibold'
            : 'text-base-content/70 hover:text-base-content transition-colors';

    /* Apply theme */
    useEffect(() => {
        const theme = darkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [darkMode]);

    /* Fetch role */
    useEffect(() => {
        if (user) {
            fetch(`https://asset-verse-server-phi.vercel.app/users/${user.email}`)
                .then(r => r.json())
                .then(d => setRole(d.role))
                .catch(console.error);
        }
    }, [user]);

    const handleLogOut = () => {
        LogingOut()
            .then(() => { setUser(null); toast.success('Logged out'); })
            .catch(console.error);
    };

    const navLinks = (
        <>
            <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/HRRegister" className={linkClass}>Register as HR</NavLink></li>
            <li><NavLink to="/EmployeeRegister" className={linkClass}>Register as Employee</NavLink></li>
            {role === 'hr'       && <li><NavLink to="/Dashboard/HR"       className={linkClass}>Dashboard</NavLink></li>}
            {role === 'employee' && <li><NavLink to="/Dashboard/Employee" className={linkClass}>Dashboard</NavLink></li>}
        </>
    );

    return (
        <nav className="navbar bg-base-100 border-b border-base-300 px-4 sticky top-0 z-50 backdrop-blur-sm bg-base-100/90">

            {/* Start — logo + mobile menu */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 border border-base-300 rounded-2xl z-50 mt-3 w-56 p-3 shadow-xl gap-1">
                        {navLinks}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost px-2">
                    <Logo />
                </Link>
            </div>

            {/* Center — desktop links */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-1 px-1 text-sm font-medium">
                    {navLinks}
                </ul>
            </div>

            {/* End — theme toggle + user */}
            <div className="navbar-end gap-2">

                {/* Theme toggle pill */}
                <button
                    onClick={() => setDarkMode(p => !p)}
                    aria-label="Toggle theme"
                    className="relative w-14 h-7 rounded-full border border-base-300 bg-base-200 flex items-center px-1 transition-all hover:border-primary"
                >
                    <span className={`absolute w-5 h-5 rounded-full shadow-sm flex items-center justify-center text-xs transition-all duration-300 ${darkMode ? 'translate-x-7 bg-primary text-white' : 'translate-x-0 bg-white text-yellow-500'}`}>
                        {darkMode ? '🌙' : '☀️'}
                    </span>
                </button>

                {user ? (
                    <div className="flex items-center gap-2">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                {user.photoURL
                                    ? <img src={user.photoURL} alt={user.displayName || 'User'} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/40" />
                                    : <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                        {(user.displayName || user.email)?.[0]?.toUpperCase()}
                                      </div>
                                }
                            </div>
                            <ul tabIndex="-1" className="dropdown-content menu bg-base-100 border border-base-300 rounded-2xl z-50 w-56 p-3 shadow-xl mt-2 gap-1 text-sm">
                                <li className="px-3 py-2 border-b border-base-300 mb-1">
                                    <div className="flex flex-col gap-0.5 pointer-events-none">
                                        <span className="font-bold truncate">{user.displayName || 'User'}</span>
                                        <span className="text-xs text-base-content/40 truncate">{user.email}</span>
                                    </div>
                                </li>
                                {role === 'hr' && <>
                                    <li><NavLink to="/Dashboard/HR"          className={linkClass}>📊 Dashboard</NavLink></li>
                                    <li><NavLink to="/Dashboard/AssetList"   className={linkClass}>📦 Asset List</NavLink></li>
                                    <li><NavLink to="/Dashboard/AddAssert"   className={linkClass}>➕ Add Asset</NavLink></li>
                                    <li><NavLink to="/Dashboard/AllRequiests"className={linkClass}>📋 All Requests</NavLink></li>
                                    <li><NavLink to="/Dashboard/EmployeeList"className={linkClass}>👥 Employees</NavLink></li>
                                    <li><NavLink to="/Dashboard/Profile"     className={linkClass}>👤 Profile</NavLink></li>
                                </>}
                                {role === 'employee' && <>
                                    <li><NavLink to="/Dashboard/Employee"    className={linkClass}>📊 Dashboard</NavLink></li>
                                    <li><NavLink to="/Dashboard/MyAssets"    className={linkClass}>📦 My Assets</NavLink></li>
                                    <li><NavLink to="/Dashboard/RequestAsset"className={linkClass}>🙋 Request Asset</NavLink></li>
                                    <li><NavLink to="/Dashboard/myteam"      className={linkClass}>🤝 My Team</NavLink></li>
                                    <li><NavLink to="/Dashboard/Profile"     className={linkClass}>👤 Profile</NavLink></li>
                                </>}
                                <li className="border-t border-base-300 mt-1 pt-1">
                                    <button onClick={handleLogOut} className="text-error hover:bg-error/10 rounded-xl px-3 py-2 w-full text-left transition">
                                        🚪 Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <Link to="/Login" className="btn btn-primary btn-sm rounded-xl px-5">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navber;
