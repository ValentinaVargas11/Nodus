import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { LOGO_FULL } from '../app/logos';
import * as authService from '../services/authService';
import styles from './ResetPasswordPage.module.css';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!password || password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (confirm !== password) {
      errors.confirm = 'Las contraseñas no coinciden';
    }
    setFieldErrors(errors);
    setError('');
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const message = await authService.resetPassword(token, password);
      setSuccess(message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
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
          {!success ? (
            <>
              <h2 className={styles.title}>Nueva contraseña</h2>
              <p className={styles.subtitle}>
                Elegí una nueva contraseña para tu cuenta. Te pediremos que la confirmes.
              </p>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nueva contraseña</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPass ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres" required
                      className={styles.input}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className={styles.passwordToggle}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <span className={styles.fieldError}>{fieldErrors.password}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirmar contraseña</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showConfirm ? 'text' : 'password'} value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repetí la contraseña" required
                      className={styles.input}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className={styles.passwordToggle}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.confirm && (
                    <span className={styles.fieldError}>{fieldErrors.confirm}</span>
                  )}
                </div>

                {error && (
                  <div className={styles.errorBox}>
                    <AlertCircle size={15} className={styles.errorIcon} />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                  {submitting ? 'Guardando…' : 'Guardar nueva contraseña'}
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
              <h2 className={styles.title}>Contraseña actualizada</h2>
              <p className={styles.subtitle}>{success}</p>
              <Link to="/login" className={styles.submitBtn}>
                Ir a iniciar sesión
              </Link>
            </>
          )}
        </div>

        <p className={styles.footer}>© 2026 Nodus · Sistema de gestión</p>
      </div>
    </div>
  );
}