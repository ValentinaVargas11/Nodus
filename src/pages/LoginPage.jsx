import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Shield, Zap } from 'lucide-react';
import { LOGO_FULL } from '../app/logos';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

const userColors = {
  'Administrador General': { bg: '#DBEAFE', text: '#1d4ed8', border: '#93c5fd' },
  'Backoffice':            { bg: '#F3E8FF', text: '#7c3aed', border: '#c4b5fd' },
  'Limpieza':              { bg: '#CFFAFE', text: '#0e7490', border: '#67e8f9' },
  'Encargada de Edificio': { bg: '#DCFCE7', text: '#15803d', border: '#86efac' },
  'Encargado de Edificio': { bg: '#DCFCE7', text: '#15803d', border: '#86efac' },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, loginDemo, loading, error, DEMO_USERS } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login(email, password);
      navigate('/unidades');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Email o contraseña incorrectos.');
    }
  };

  const handleDemoLogin = (demoEmail) => {
    loginDemo(demoEmail);
    navigate('/unidades');
  };

  const displayError = localError || error;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgCircles}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
      </div>

      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <img src={LOGO_FULL} alt="Nodus" className={styles.logo} />
        </div>

        <div className={styles.card}>
          <h2 className={styles.title}>Iniciar sesión</h2>
          <p className={styles.subtitle}>Ingresá con tu cuenta de Nodus</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Contraseña</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className={styles.inputPassword}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className={styles.passwordToggle}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {displayError && (
              <div className={styles.errorBox}>
                <AlertCircle size={15} className={styles.errorIcon} />
                {displayError}
              </div>
            )}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <div className="divider" />

          <div className={styles.demoSection}>
            <div className={styles.demoLabel}>
              <Zap size={13} />
              Modo Demo (sin backend)
            </div>

            <div className={styles.demoButtons}>
              {DEMO_USERS.map(u => {
                const colors = userColors[u.cargo] || userColors['Administrador General'];
                return (
                  <button
                    key={u.id}
                    onClick={() => handleDemoLogin(u.email)}
                    className={styles.demoButton}
                    style={{
                      '--demo-btn-bg': colors.bg,
                      '--demo-btn-border': colors.border,
                      '--demo-btn-text': colors.text,
                    }}
                  >
                    <Shield size={16} color={colors.text} className={styles.demoButtonIcon} />
                    <div className={styles.demoButtonContent}>
                      <div className={styles.demoButtonName}>{u.nombre} {u.apellido}</div>
                      <div className={styles.demoButtonMeta}>{u.cargo} · {u.email}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className={styles.footer}>© 2026 Nodus · Sistema de gestión</p>
      </div>
    </div>
  );
}
