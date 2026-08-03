import { useState } from 'react';
import { X, Users, Phone, Mail, Save, Pencil, Home } from 'lucide-react';
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
];

export default function RoomDetailModal({ room, onClose, onChangeStatus, onUpdateRoom }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  if (!room) return null;

  const startEdit = () => {
    setForm({
      guestName: room.guestName || '',
      guests: room.guests || 1,
      phone: room.phone || '',
      email: room.email || '',
      tenantSince: room.tenantSince || '',
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(null);
    setEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updates = {
      guestName: fd.get('guestName'),
      guests: Number(fd.get('guests')) || 1,
      phone: fd.get('phone'),
      email: fd.get('email'),
      tenantSince: fd.get('tenantSince'),
    };
    if (room.status !== 'occupied') updates.status = 'occupied';
    onUpdateRoom(room.id, updates);
    setEditing(false);
    setForm(null);
  };

  const showForm = editing || room.status !== 'occupied';
  const editingData = form || room;

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

          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <Users size={15} color="var(--accent)" />
                <span className={styles.sectionTitle}>
                  {showForm ? (room.status === 'occupied' ? 'Editar Inquilino' : 'Asignar Inquilino') : 'Información del Inquilino'}
                </span>
              </div>
              {room.status === 'occupied' && !editing && (
                <button className="btn-nodus btn-ghost btn-sm-nodus" onClick={startEdit}>
                  <Pencil size={13} /> Editar
                </button>
              )}
            </div>

            {showForm ? (
              <form onSubmit={handleSubmit} className={styles.tenantBox}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="label-nodus">Nombre completo</label>
                    <input type="text" name="guestName" className="input-nodus"
                      placeholder="Nombre del inquilino" defaultValue={editingData.guestName} />
                  </div>
                  <div className="col-6">
                    <label className="label-nodus">Personas</label>
                    <input type="number" name="guests" min="1" className="input-nodus"
                      defaultValue={editingData.guests} />
                  </div>
                  <div className="col-6">
                    <label className="label-nodus">Inquilino desde</label>
                    <input type="text" name="tenantSince" className="input-nodus"
                      placeholder="Ej: Ene 2024" defaultValue={editingData.tenantSince} />
                  </div>
                  <div className="col-12">
                    <label className="label-nodus d-flex align-items-center gap-1"><Phone size={11} /> Teléfono</label>
                    <input type="text" name="phone" className="input-nodus"
                      placeholder="+54 9 11 ..." defaultValue={editingData.phone} />
                  </div>
                  <div className="col-12">
                    <label className="label-nodus d-flex align-items-center gap-1"><Mail size={11} /> Email</label>
                    <input type="email" name="email" className="input-nodus"
                      placeholder="inquilino@email.com" defaultValue={editingData.email} />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn-nodus btn-primary-nodus flex-fill">
                    <Save size={15} /> Guardar
                  </button>
                  {editing && (
                    <button type="button" className="btn-nodus btn-ghost flex-fill"
                      onClick={cancelEdit}>Cancelar</button>
                  )}
                </div>
              </form>
            ) : (
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
                    <div className={styles.infoText}>{room.phone || '—'}</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus d-flex align-items-center gap-1"><Mail size={11} /> Email</div>
                    <div className={styles.infoSmall}>{room.email || '—'}</div>
                  </div>
                  <div className="col-6">
                    <div className="label-nodus">Inquilino desde</div>
                    <div className={styles.infoText}>{room.tenantSince || '—'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
        </div>
      </div>
    </div>
  );
}
