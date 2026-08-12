import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHomePath } from '../app/navigation';
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
    return <Navigate to={getHomePath(user.cargo)} replace />;
  }

  return children;
}
