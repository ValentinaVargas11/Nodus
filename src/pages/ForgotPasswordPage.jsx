import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { LOGO_FULL } from '../app/logos';
import * as authService from '../services/authService';
import styles from './ForgotPasswordPage.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_REGEX.test(value)) {
      setError('Ingresá un email válido');
      return;
    }
    setError('');
    setSending(true);
    try {
      await authService.forgotPassword(value);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo. Intentá de nuevo.');
    } finally {
      setSending(false);
    }
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
          {!sent ? (
            <>
              <h2 className={styles.title}>Restablecer contraseña</h2>
              <p className={styles.subtitle}>
                Ingresá el email de tu cuenta y te enviaremos un enlace para crear una nueva contraseña.
              </p>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <div className={styles.inputWrapper}>
                    <Mail size={15} className={styles.inputIcon} />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com" required autoFocus
                      className={styles.input}
                    />
                  </div>
                </div>

                {error && (
                  <div className={styles.errorBox}>
                    <AlertCircle size={15} className={styles.errorIcon} />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={sending} className={styles.submitBtn}>
                  {sending ? 'Enviando…' : 'Enviar enlace'}
                </button>
              </form>

              <Link to="/login" className={styles.backLink}>
                <ArrowLeft size={14} /> Volver a iniciar sesión
              </Link>
            </>
          ) : (
            <>
              <div className={styles.successIcon}>
                <CheckCircle size={28} />
              </div>
              <h2 className={styles.title}>Revisá tu casilla</h2>
              <p className={styles.subtitle}>
                Si el correo existe, recibirás un enlace para restablecer tu contraseña.
                Revisá también la carpeta de spam.
              </p>
              <Link to="/login" className={styles.submitBtn}>
                Volver a iniciar sesión
              </Link>
            </>
          )}
        </div>

        <p className={styles.footer}>© 2026 Nodus · Sistema de gestión</p>
      </div>
    </div>
  );
}
