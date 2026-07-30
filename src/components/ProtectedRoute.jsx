import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './ProtectedRoute.module.css';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingContent}>
          <div className="spinner" />
          <p className={styles.loadingText}>Cargando sesión…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.cargo)) {
    return (
      <div className={styles.deniedWrapper}>
        <div className={styles.deniedContent}>
          <h2 className={styles.deniedTitle}>Acceso denegado</h2>
          <p className={styles.deniedMessage}>No tenés permisos para ver esta sección.</p>
        </div>
      </div>
    );
  }

  return children;
}
