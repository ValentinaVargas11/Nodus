import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Building2, DollarSign, Wrench, Package,
  LayoutDashboard, Menu, ChevronLeft, Bell, Search,
} from 'lucide-react';
import UserMenu from '../app/components/UserMenu';
import { LOGO_ICON } from '../app/logos';
import { useAuth } from '../context/AuthContext';
import '../styles/nodus.css';
import shellStyles from './AppShell.module.css';

const TABS = [
  { id: 'dashboard',   path: '/dashboard',  label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'units',       path: '/unidades',     label: 'Unidades',        icon: Building2       },
  { id: 'fees',        path: '/cuotas',       label: 'Cuotas/Expensas', icon: DollarSign      },
  { id: 'maintenance', path: '/reparaciones', label: 'Reparaciones',    icon: Wrench          },
  { id: 'inventory',   path: '/inventario',   label: 'Inventario',      icon: Package         },
];

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/unidades':     'Unidades',
  '/cuotas':       'Cuotas / Expensas',
  '/reparaciones': 'Reparaciones',
  '/inventario':   'Inventario',
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Nodus';

  const initials = `${user?.nombre?.[0] ?? ''}${user?.apellido?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="app-shell">
      <aside className={`sidebar${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img
              src={LOGO_ICON}
              alt="Nodus"
              className={shellStyles.logoImg}
            />
            <span className="sidebar-brand-text">Nodus</span>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Colapsar' : 'Expandir'}
          >
            {sidebarOpen ? <ChevronLeft size={15} /> : <Menu size={15} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Principal</div>
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) =>
                  `nav-item${isActive ? ' active' : ''}`
                }
                title={!sidebarOpen ? tab.label : undefined}
              >
                <Icon className="nav-item-icon" size={17} />
                <span className="nav-item-label">{tab.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-footer-text">© 2026 Nodus · Sistema de gestión</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="navbar-nodus">
          <div className="navbar-breadcrumb">
            <span className="navbar-page-title">{pageTitle}</span>
          </div>

          <div className="navbar-actions">
            <button className="navbar-icon-btn" title="Buscar">
              <Search size={16} />
            </button>

            <button className={`navbar-icon-btn ${shellStyles.notifBtn}`} title="Notificaciones">
              <Bell size={16} />
              <span className="notif-dot" />
            </button>

            <div className="navbar-divider" />

            <UserMenu user={user} onLogout={logout} />
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
