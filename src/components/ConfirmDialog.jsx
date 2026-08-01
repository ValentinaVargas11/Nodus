import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

const variantConfig = {
  danger:  { iconBg: '#FEE2E2', iconColor: '#dc2626', btnBg: '#dc2626', btnHover: '#b91c1c' },
  warning: { iconBg: '#FEF3C7', iconColor: '#d97706', btnBg: '#d97706', btnHover: '#b45309' },
  info:    { iconBg: '#DBEAFE', iconColor: '#2563EB', btnBg: '#2563EB', btnHover: '#1d4ed8' },
};

export default function ConfirmDialog({
  isOpen, title = 'Confirmar acción', message = '¿Estás seguro?',
  confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'warning',
  onConfirm, onCancel, loading = false,
}) {
  if (!isOpen) return null;

  const colors = variantConfig[variant] || variantConfig.warning;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
    >
      <div className={`modal-box ${styles.modalBox}`}>
        <div className={styles.body}>
          <div className={styles.iconCircle} style={{ background: colors.iconBg }}>
            <AlertTriangle size={24} color={colors.iconColor} />
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <button onClick={onCancel} disabled={loading} className={`btn-nodus btn-ghost ${styles.cancelBtn}`}>
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={styles.confirmBtn}
            style={{
              background: loading ? '#9ca3af' : colors.btnBg,
              '--confirm-hover': colors.btnHover,
            }}
          >
            {loading ? 'Guardando…' : confirmText}
          </button>
        </div>

        {loading && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ background: colors.btnBg }} />
          </div>
        )}
      </div>
    </div>
  );
}
