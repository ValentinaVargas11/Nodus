import { X, Calendar, Users, Phone, Mail, CreditCard, Home } from 'lucide-react';

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

export default function RoomDetailModal({ room, onClose, onChangeStatus }) {
  if (!room) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-soft)', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Home size={16} color="var(--accent)" />
              </div>
              <h2 className="modal-title">Unidad {room.number}</h2>
            </div>
            <p className="modal-subtitle">{room.type} · Piso {room.floor}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Cambiar estado */}
          <div className="mb-4">
            <label className="label-nodus">Cambiar Estado</label>
            <div className="row g-2">
              {statusOptions.map(opt => (
                <div key={opt.value} className="col-6">
                  <button
                    onClick={() => onChangeStatus(room.id, opt.value)}
                    className={`status-btn w-100 ${room.status === opt.value ? opt.activeClass : ''}`}
                  >
                    {opt.label}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Información del inquilino */}
          {room.status === 'occupied' && (
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Users size={15} color="var(--accent)" />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Información del Inquilino
                </span>
              </div>
              <div
                style={{
                  background: 'var(--accent-soft)',
                  border: '1px solid #c7d2fe',
                  borderRadius: 'var(--radius)',
                  padding: '16px',
                }}
              >
                <div className="row g-3">
                  <div className="col-6">
                    <div className="label-nodus">Nombre</div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{room.guestName || '—'}</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus">Personas</div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{room.guests || 1}</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1">
                      <Phone size={11} /> Teléfono
                    </div>
                    <div style={{ fontSize: '13.5px' }}>+54 9 11 1234-5678</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1">
                      <Mail size={11} /> Email
                    </div>
                    <div style={{ fontSize: '13px' }}>ejemplo@email.com</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1">
                      <Calendar size={11} /> Inquilino desde
                    </div>
                    <div style={{ fontSize: '13.5px' }}>{room.tenantSince || '—'}</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1">
                      <CreditCard size={11} /> Estado de Pago
                    </div>
                    <span className="badge-nodus badge-success">Al día</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detalles de la unidad */}
          <div className="mb-4">
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 10 }}>
              Detalles de la Unidad
            </span>
            <div className="row g-2">
              {[
                { label: 'Tipo',          value: room.type },
                { label: 'Piso',          value: room.floor },
                { label: 'Estado',        value: statusLabels[room.status] },
                { label: 'Cuota mensual', value: '$95.000' },
              ].map(item => (
                <div key={item.label} className="col-6">
                  <div style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                  }}>
                    <div className="label-nodus mb-1" style={{ marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2">
            <button className="btn-nodus btn-primary-nodus flex-fill">
              {room.status === 'occupied' ? 'Ver Inquilino' : 'Asignar Inquilino'}
            </button>
            <button className="btn-nodus btn-ghost flex-fill">
              Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
