import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, ChevronLeft } from 'lucide-react';
import UserMenu from '../app/components/UserMenu';
import { LOGO_ICON } from '../app/logos';
import { getAllowedNavItems } from '../app/navigation';
import { useAuth } from '../context/AuthContext';
import '../styles/nodus.css';
import shellStyles from './AppShell.module.css';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/unidades':     'Unidades',
  '/cuotas':       'Cuotas / Expensas',
  '/reparaciones': 'Reparaciones',
  '/inventario':   'Inventario',
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Nodus';

  const initials = `${user?.nombre?.[0] ?? ''}${user?.apellido?.[0] ?? ''}`.toUpperCase();

  const navItems = getAllowedNavItems(user?.cargo);

  return (
    <div className="app-shell">
      <aside className={`sidebar${sidebarOpen ? '' : ' collapsed'}${mobileOpen ? ' open' : ''}`}>
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
          {navItems.map(tab => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) =>
                  `nav-item${isActive ? ' active' : ''}`
                }
                title={!sidebarOpen ? tab.label : undefined}
                onClick={closeMobile}
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

      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobile} aria-hidden="true" />
      )}

      <div className="app-main">
        <header className="navbar-nodus">
          <div className="navbar-breadcrumb">
            <button
              className="navbar-menu-btn"
              onClick={() => setMobileOpen(true)}
              title="Abrir menú"
              aria-label="Abrir menú"
            >
              <Menu size={18} />
            </button>
            <span className="navbar-page-title">{pageTitle}</span>
          </div>

          <div className="navbar-actions">
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
