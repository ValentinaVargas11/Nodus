import { useState, useRef, useEffect } from 'react';
import { User, Mail, Briefcase, ChevronDown, LogOut, Settings, Shield } from 'lucide-react';
import styles from './UserMenu.module.css';

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

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = getInitials(user.nombre, user.apellido);
  const avatarColor = getAvatarColor(user.cargo);

  return (
    <div ref={ref} className={styles.wrapper}>
      <button
        onClick={() => setOpen(!open)}
        className={`${styles.triggerBtn} ${open ? styles.triggerBtnOpen : ''}`}
      >
        <div className={styles.avatar} style={{ background: avatarColor }}>{initials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user.nombre} {user.apellido}</div>
          <div className={styles.userRole}>{user.cargo}</div>
        </div>
        <ChevronDown size={14} color="#8a98ae" className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.profileHeader}>
            <div className={styles.profileRow}>
              <div className={styles.profileAvatar} style={{ background: avatarColor }}>{initials}</div>
              <div>
                <div className={styles.profileName}>{user.nombre} {user.apellido}</div>
                <div className={styles.roleBadge}><Shield size={10} /> {user.cargo}</div>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <InfoRow icon={<User size={14} />} label="Nombre completo" value={`${user.nombre} ${user.apellido}`} />
            <InfoRow icon={<Mail size={14} />} label="Email" value={user.email} />
            <InfoRow icon={<Briefcase size={14} />} label="Cargo" value={user.cargo} />
          </div>

          <div className={styles.actionsSection}>
            <MenuAction icon={<Settings size={15} />} label="Configuración de cuenta" sublabel="Preferencias y seguridad" onClick={() => setOpen(false)} />
            <div className={styles.divider} />
            <MenuAction icon={<LogOut size={15} />} label="Cerrar sesión" sublabel={`Sesión de ${user.nombre}`} onClick={() => { setOpen(false); onLogout(); }} danger />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon}>{icon}</div>
      <div>
        <div className={styles.infoLabel}>{label}</div>
        <div className={styles.infoValue}>{value}</div>
      </div>
    </div>
  );
}

function MenuAction({ icon, label, sublabel, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.menuBtn} ${danger ? styles.menuBtnDanger : ''}`}
    >
      <div className={`${styles.menuBtnIcon} ${danger ? styles.menuBtnIconDanger : ''}`}>{icon}</div>
      <div>
        <div className={`${styles.menuBtnLabel} ${danger ? styles.menuBtnLabelDanger : ''}`}>{label}</div>
        <div className={styles.menuBtnSublabel}>{sublabel}</div>
      </div>
    </button>
  );
}
