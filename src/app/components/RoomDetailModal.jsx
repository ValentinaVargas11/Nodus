import { X, Calendar, Users, Phone, Mail, CreditCard, Home } from 'lucide-react';
import styles from './RoomDetailModal.module.css';

const statusOptions = [
  { value: 'available',   label: 'Disponible',    activeClass: 'active-available'   },
  { value: 'occupied',    label: 'Ocupada',       activeClass: 'active-occupied'    },
  { value: 'cleaning',    label: 'En Limpieza',   activeClass: 'active-cleaning'    },
  { value: 'maintenance', label: 'Mantenimiento', activeClass: 'active-maintenance' },
];

const statusLabels = {
  available:   'Disponible',
  occupied:    'Ocupada',
  cleaning:    'En Limpieza',
  maintenance: 'Mantenimiento',
};

const unitDetails = (room) => [
  { label: 'Tipo', value: room.type },
  { label: 'Piso', value: room.floor },
  { label: 'Estado', value: statusLabels[room.status] },
  { label: 'Cuota mensual', value: '$95.000' },
];

export default function RoomDetailModal({ room, onClose, onChangeStatus }) {
  if (!room) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <div className={styles.headerIcon}><Home size={16} color="var(--accent)" /></div>
              <h2 className="modal-title">Unidad {room.number}</h2>
            </div>
            <p className="modal-subtitle">{room.type} · Piso {room.floor}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <label className="label-nodus">Cambiar Estado</label>
            <div className="row g-2">
              {statusOptions.map(opt => (
                <div key={opt.value} className="col-6">
                  <button onClick={() => onChangeStatus(room.id, opt.value)}
                    className={`status-btn w-100 ${room.status === opt.value ? opt.activeClass : ''}`}>
                    {opt.label}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {room.status === 'occupied' && (
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Users size={15} color="var(--accent)" />
                <span className={styles.sectionTitle}>Información del Inquilino</span>
              </div>
              <div className={styles.tenantBox}>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="label-nodus">Nombre</div>
                    <div className={styles.infoValue}>{room.guestName || '—'}</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus">Personas</div>
                    <div className={styles.infoValue}>{room.guests || 1}</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1"><Phone size={11} /> Teléfono</div>
                    <div className={styles.infoText}>+54 9 11 1234-5678</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1"><Mail size={11} /> Email</div>
                    <div className={styles.infoSmall}>ejemplo@email.com</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1"><Calendar size={11} /> Inquilino desde</div>
                    <div className={styles.infoText}>{room.tenantSince || '—'}</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1"><CreditCard size={11} /> Estado de Pago</div>
                    <span className="badge-nodus badge-success">Al día</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <span className={styles.detailTitle}>Detalles de la Unidad</span>
            <div className="row g-2">
              {unitDetails(room).map(item => (
                <div key={item.label} className="col-6">
                  <div className={styles.detailItem}>
                    <div className={`label-nodus ${styles.detailLabel}`}>{item.label}</div>
                    <div className={styles.detailValue}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn-nodus btn-primary-nodus flex-fill">
              {room.status === 'occupied' ? 'Ver Inquilino' : 'Asignar Inquilino'}
            </button>
            <button className="btn-nodus btn-ghost flex-fill">Historial</button>
          </div>
        </div>
      </div>
    </div>
  );
}
