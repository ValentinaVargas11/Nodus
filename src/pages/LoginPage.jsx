import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { LOGO_FULL } from '../app/logos';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) navigate('/dashboard');
  };

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

            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={15} className={styles.errorIcon} />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <div className={styles.forgotRow}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <p className={styles.footer}>© 2026 Nodus · Sistema de gestión</p>
      </div>
    </div>
  );
}
