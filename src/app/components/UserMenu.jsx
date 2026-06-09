import { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Briefcase, ChevronDown, LogOut,
  Settings, Shield,
} from 'lucide-react';

function getInitials(nombre, apellido) {
  return `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();
}

function getAvatarColor(cargo) {
  const map = {
    'Administrador General': 'linear-gradient(135deg, #1E3A5F, #2563EB)',
    'Backoffice':            'linear-gradient(135deg, #4f46e5, #7c3aed)',
    'Limpieza':              'linear-gradient(135deg, #0891b2, #06b6d4)',
    'Encargada de Edificio': 'linear-gradient(135deg, #059669, #10b981)',
    'Encargado de Edificio': 'linear-gradient(135deg, #059669, #10b981)',
  };
  return map[cargo] ?? 'linear-gradient(135deg, #1E3A5F, #2563EB)';
}

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials    = getInitials(user.nombre, user.apellido);
  const avatarColor = getAvatarColor(user.cargo);

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 10px 5px 5px',
          background: open ? '#F0F3F8' : '#ffffff',
          border: '1.5px solid',
          borderColor: open ? '#2563EB' : '#E2E8F0',
          borderRadius: 10,
          cursor: 'pointer',
          transition: 'all 140ms ease',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          boxShadow: open ? '0 0 0 3px rgba(37,99,235,0.10)' : '0 1px 2px rgba(15,25,45,0.05)',
        }}
        onMouseEnter={e => {
          if (!open) e.currentTarget.style.borderColor = '#2563EB';
        }}
        onMouseLeave={e => {
          if (!open) e.currentTarget.style.borderColor = '#E2E8F0';
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}>
          {initials}
        </div>

        {/* Name + cargo */}
        <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0d1829', whiteSpace: 'nowrap' }}>
            {user.nombre} {user.apellido}
          </div>
          <div style={{ fontSize: 11, color: '#4b5a72', whiteSpace: 'nowrap' }}>
            {user.cargo}
          </div>
        </div>

        <ChevronDown
          size={14}
          color="#8a98ae"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 280,
          background: '#ffffff',
          border: '1px solid #E2E8F0',
          borderRadius: 14,
          boxShadow: '0 8px 30px rgba(15,25,45,0.16), 0 2px 8px rgba(15,25,45,0.08)',
          zIndex: 500,
          overflow: 'hidden',
          animation: 'dropDown 160ms cubic-bezier(0.16,1,0.3,1)',
        }}>

          {/* Header del perfil */}
          <div style={{
            padding: '18px 18px 14px',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)',
            borderBottom: '1px solid #EEF1F7',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 800, color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0d1829', letterSpacing: '-0.2px' }}>
                  {user.nombre} {user.apellido}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11.5, fontWeight: 600,
                  background: '#DBEAFE', color: '#1d4ed8',
                  padding: '2px 8px', borderRadius: 99, marginTop: 3,
                }}>
                  <Shield size={10} />
                  {user.cargo}
                </div>
              </div>
            </div>
          </div>

          {/* Info fields */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #EEF1F7' }}>
            <InfoRow icon={<User size={14} />} label="Nombre completo" value={`${user.nombre} ${user.apellido}`} />
            <InfoRow icon={<Mail size={14} />} label="Email" value={user.email} />
            <InfoRow icon={<Briefcase size={14} />} label="Cargo" value={user.cargo} />
          </div>

          {/* Actions */}
          <div style={{ padding: '8px' }}>
            <MenuAction
              icon={<Settings size={15} />}
              label="Configuración de cuenta"
              sublabel="Preferencias y seguridad"
              onClick={() => setOpen(false)}
            />
            <div style={{ height: 1, background: '#EEF1F7', margin: '6px 0' }} />
            <MenuAction
              icon={<LogOut size={15} />}
              label="Cerrar sesión"
              sublabel={`Sesión de ${user.nombre}`}
              onClick={() => { setOpen(false); onLogout(); }}
              danger
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 10 }}>
      <div style={{ color: '#8a98ae', marginTop: 1, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#8a98ae', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: '#0d1829', marginTop: 1 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function MenuAction({ icon, label, sublabel, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        width: '100%', padding: '9px 10px',
        background: hov ? (danger ? '#FEF2F2' : '#F5F7FA') : 'none',
        border: 'none', borderRadius: 8, cursor: 'pointer',
        textAlign: 'left', transition: 'background 120ms ease',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div style={{ color: danger ? (hov ? '#EF4444' : '#8a98ae') : (hov ? '#2563EB' : '#8a98ae'), transition: 'color 120ms ease' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: danger ? (hov ? '#EF4444' : '#0d1829') : '#0d1829', transition: 'color 120ms ease' }}>
          {label}
        </div>
        <div style={{ fontSize: 11.5, color: '#8a98ae' }}>{sublabel}</div>
      </div>
    </button>
  );
}
