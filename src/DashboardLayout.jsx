import React, { use, useEffect, useState } from 'react';
import Logo from './Component/Logo';
import { Outlet, NavLink, Link, useNavigate } from 'react-router';
import AuthContext from './contexts/AuthContexts';
import Footer from './Component/Footer';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
  const { user, LogingOut, setUser } = use(AuthContext);
  const [role, setRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [dbName, setDbName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`https://asset-verse-server-phi.vercel.app/users/${user?.email}`)
        .then(r => r.json())
        .then(d => { setRole(d.role); setDbName(d.displayName || ''); })
        .catch(console.error);
    }
  }, [user]);

  const displayName = user?.displayName || dbName || user?.email?.split('@')[0] || 'User';

  const handleLogout = () => {
    LogingOut().then(() => { setUser(null); toast.success('Logged out'); navigate('/'); });
  };

  const active = 'flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-content shadow font-semibold text-sm';
  const inactive = 'flex items-center gap-3 px-4 py-3 rounded-xl text-base-content/60 hover:bg-base-300 hover:text-base-content transition font-medium text-sm';
  const lc = ({ isActive }) => isActive ? active : inactive;

  const hrLinks = [
    { to: '/Dashboard/HR',          icon: '📊', label: 'Dashboard'    },
    { to: '/Dashboard/AssetList',   icon: '📦', label: 'Asset List'   },
    { to: '/Dashboard/AddAssert',   icon: '➕', label: 'Add Asset'    },
    { to: '/Dashboard/AllRequiests',icon: '📋', label: 'All Requests' },
    { to: '/Dashboard/EmployeeList',icon: '👥', label: 'Employees'    },
    { to: '/Dashboard/Profile',     icon: '👤', label: 'Profile'      },
  ];
  const empLinks = [
    { to: '/Dashboard/Employee',    icon: '📊', label: 'Dashboard'    },
    { to: '/Dashboard/MyAssets',    icon: '📦', label: 'My Assets'    },
    { to: '/Dashboard/RequestAsset',icon: '🙋', label: 'Request Asset'},
    { to: '/Dashboard/myteam',      icon: '🤝', label: 'My Team'      },
    { to: '/Dashboard/Profile',     icon: '👤', label: 'Profile'      },
  ];
  const links = role === 'hr' ? hrLinks : role === 'employee' ? empLinks : [];

  return (
    <div className="bg-base-200 min-h-screen flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} transition-all duration-300 bg-base-100 border-r border-base-300 flex flex-col min-h-screen sticky top-0 shrink-0`}>
        {/* Top */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-base-300">
          {!collapsed && <Link to="/"><Logo /></Link>}
          <button onClick={() => setCollapsed(c => !c)} className="btn btn-ghost btn-xs btn-circle ml-auto text-lg">
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Avatar */}
        {!collapsed && user && (
          <div className="px-4 py-4 border-b border-base-300 flex items-center gap-3">
            {user.photoURL
              ? <img src={user.photoURL} className="w-10 h-10 rounded-full ring-2 ring-primary object-cover" alt="" />
              : <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                  {(user.displayName || user.email)?.[0]?.toUpperCase()}
                </div>
            }
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{displayName}</p>
              <span className={`badge badge-xs ${role === 'hr' ? 'badge-primary' : 'badge-secondary'} capitalize`}>{role || '…'}</span>
            </div>
          </div>
        )}

        {/* Links */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {links.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={lc} title={collapsed ? label : ''}>
              <span className="text-lg shrink-0">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t border-base-300">
          <button onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-error hover:bg-error/10 transition text-sm font-medium ${collapsed ? 'justify-center' : ''}`}>
            <span className="text-lg">🚪</span>
            {!collapsed && 'Log Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1"><Outlet /></div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
