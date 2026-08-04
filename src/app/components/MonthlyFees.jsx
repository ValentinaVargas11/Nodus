import { useState } from 'react';
import { Search, CheckCircle, Clock, AlertTriangle, DollarSign, Mail, Phone } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import styles from './MonthlyFees.module.css';

const statusConfig = {
  paid:    { label: 'Pagada',    badgeClass: 'badge-success', icon: CheckCircle  },
  pending: { label: 'Pendiente', badgeClass: 'badge-warning', icon: Clock        },
  overdue: { label: 'Vencida',   badgeClass: 'badge-danger',  icon: AlertTriangle },
};

function summaryCards(fees) {
  const byStatus = (status) => fees.filter(f => f.status === status);
  const total = (status) => formatCurrency(byStatus(status).reduce((s, f) => s + f.total, 0));
  return [
    {
      key: 'paid', label: 'Cobrado', color: 'var(--success)', bg: 'var(--success-soft)',
      icon: CheckCircle, value: total('paid'), sub: `${byStatus('paid').length} pagadas`,
    },
    {
      key: 'pending', label: 'Pendiente', color: 'var(--warning)', bg: 'var(--warning-soft)',
      icon: Clock, value: total('pending'), sub: `${byStatus('pending').length} pendientes`,
    },
    {
      key: 'overdue', label: 'Vencido', color: 'var(--danger)', bg: 'var(--danger-soft)',
      icon: AlertTriangle, value: total('overdue'), sub: `${byStatus('overdue').length} vencidas`,
    },
  ];
}

const filterTabs = [
  { key: 'all',     label: 'Todas'     },
  { key: 'paid',    label: 'Pagadas'   },
  { key: 'pending', label: 'Pendientes' },
  { key: 'overdue', label: 'Vencidas'  },
];

const toInputDate = (ddmmyyyy) => {
  if (!ddmmyyyy) return '';
  const m = String(ddmmyyyy).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return ddmmyyyy;
};

const fromInputDate = (value) => {
  if (!value) return '';
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return value;
};

const emptyCreateForm = {
  unitNumber: '',
  tenantName: '',
  month: '',
  amount: '',
  extraCharges: 0,
  dueDate: '',
  status: 'pending',
  paidDate: '',
};

export default function MonthlyFees({ fees, rooms = [], onUpdateStatus, onUpdate, onUpdateDetalles, onDelete, onGenerar, onCrear }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showGenerar, setShowGenerar] = useState(false);
  const [generarMonth, setGenerarMonth] = useState('');
  const [generarDueDate, setGenerarDueDate] = useState('');
  const [editingFee, setEditingFee] = useState(null);
  const [createForm, setCreateForm] = useState(emptyCreateForm);

  const filtered = fees.filter(fee =>
    (fee.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     fee.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || fee.status === statusFilter)
  );

  const selectedRoom = rooms.find(r => r.number === createForm.unitNumber);
  const tenantList = [...new Set(rooms.filter(r => r.guestName).map(r => r.guestName.trim()).filter(Boolean))];

  const startEdit = (fee) => setEditingFee(fee);

  const cancelEdit = () => setEditingFee(null);

  const handleUnitChange = (e) => {
    const unitNumber = e.target.value;
    const room = rooms.find(r => r.number === unitNumber);
    setCreateForm(f => ({
      ...f,
      unitNumber,
      tenantName: room?.guestName || '',
    }));
  };

  const handleCreateFormChange = (field) => (e) => {
    setCreateForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const payload = {
      unitNumber: createForm.unitNumber,
      tenantName: createForm.tenantName,
      month: createForm.month,
      amount: parseFloat(createForm.amount),
      extraCharges: parseFloat(createForm.extraCharges) || 0,
      dueDate: fromInputDate(createForm.dueDate),
      status: createForm.status,
      email: selectedRoom?.email || '',
      phone: selectedRoom?.phone || '',
    };
    if (createForm.status === 'paid' && createForm.paidDate) {
      payload.paidDate = fromInputDate(createForm.paidDate);
    }
    if (onCrear) onCrear(payload);
    setShowForm(false);
    setCreateForm(emptyCreateForm);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updates = {
      month: fd.get('month'),
      amount: parseFloat(fd.get('amount')),
      extraCharges: parseFloat(fd.get('extraCharges')) || 0,
      dueDate: fromInputDate(fd.get('dueDate')),
      status: fd.get('status'),
    };
    if (updates.status === 'paid' && fd.get('paidDate')) {
      updates.paidDate = fromInputDate(fd.get('paidDate'));
    }
    if (onUpdateDetalles) onUpdateDetalles(editingFee.id, updates);
    else if (onUpdate) onUpdate(editingFee.id, updates);
    setEditingFee(null);
  };

  const handleDelete = () => {
    if (window.confirm('¿Eliminar esta cuota?')) {
      if (onDelete) onDelete(editingFee.id);
    }
    setEditingFee(null);
  };

  const handleGenerarSubmit = (e) => {
    e.preventDefault();
    onGenerar(generarMonth, generarDueDate);
    setShowGenerar(false);
    setGenerarMonth('');
    setGenerarDueDate('');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cuotas Mensuales / Expensas</h1>
        <p className="page-subtitle">Gestión de pagos mensuales</p>
      </div>

      <div className="row g-3 mb-4">
        {summaryCards(fees).map(card => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="col-12 col-md-4">
              <div className={styles.summaryCard}
                style={{ background: card.bg, border: `1px solid ${card.bg.replace('var', '')}` }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Icon size={18} color={card.color} />
                  <span className={styles.summaryIconLabel} style={{ color: card.color }}>{card.label}</span>
                </div>
                <div className={styles.summaryValue} style={{ color: card.color }}>{card.value}</div>
                <div className={styles.summarySub} style={{ color: card.color }}>{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-nodus mb-3">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center flex-wrap">
            <div className="input-with-icon flex-grow-1">
              <Search size={15} className="input-icon" />
              <input type="text" className="input-nodus"
                placeholder="Buscar por inquilino o unidad…"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="filter-tabs flex-shrink-0 d-flex flex-wrap gap-2">
              {filterTabs.map(tab => (
                <button key={tab.key}
                  className={`filter-tab${statusFilter === tab.key ? ' active' : ''}`}
                  onClick={() => setStatusFilter(tab.key)}>
                  {tab.label}
                  <span className="count-badge">
                    {tab.key === 'all' ? fees.length : fees.filter(f => f.status === tab.key).length}
                  </span>
                </button>
              ))}
              <button className="btn-nodus btn-primary-nodus" onClick={() => { setShowForm(!showForm); setShowGenerar(false); }}>
                {showForm ? '✕' : '+'} Nueva Cuota
              </button>
              <button className="btn-nodus btn-outline-nodus" onClick={() => { setShowGenerar(!showGenerar); setShowForm(false); }}>
                {showGenerar ? '✕' : '+'} Generar Cuotas
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card-nodus mb-3">
          <div className="card-header-nodus">
            <h3 className="card-header-title">Crear Nueva Cuota</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateSubmit} className="d-flex flex-column gap-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="label-nodus">Unidad</label>
                  <select name="unitNumber" className="input-nodus select-nodus" value={createForm.unitNumber} onChange={handleUnitChange} required>
                    <option value="">Seleccionar unidad…</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.number}>
                        {room.number} — {room.type} ({room.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="label-nodus">Inquilino</label>
                  {selectedRoom?.guestName ? (
                    <input type="text" className="input-nodus" value={createForm.tenantName}
                      onChange={handleCreateFormChange('tenantName')} required />
                  ) : (
                    <select name="tenantName" className="input-nodus select-nodus" value={createForm.tenantName}
                      onChange={handleCreateFormChange('tenantName')}>
                      <option value="">Seleccionar inquilino…</option>
                      {tenantList.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="label-nodus">Período</label>
                  <input type="text" name="month" className="input-nodus" placeholder="Ej: Mayo 2026"
                    value={createForm.month} onChange={handleCreateFormChange('month')} required />
                </div>
                <div className="col-md-4">
                  <label className="label-nodus">Monto Base</label>
                  <input type="number" name="amount" className="input-nodus" placeholder="Ej: 100000"
                    value={createForm.amount} onChange={handleCreateFormChange('amount')} required />
                </div>
                <div className="col-md-4">
                  <label className="label-nodus">Cargos Extra</label>
                  <input type="number" name="extraCharges" className="input-nodus" placeholder="Ej: 5000"
                    value={createForm.extraCharges} onChange={handleCreateFormChange('extraCharges')} />
                </div>
                <div className="col-md-4">
                  <label className="label-nodus">Fecha Vencimiento</label>
                  <input type="date" name="dueDate" className="input-nodus"
                    value={createForm.dueDate} onChange={handleCreateFormChange('dueDate')} required />
                </div>
                <div className="col-md-4">
                  <label className="label-nodus">Estado</label>
                  <select name="status" className="input-nodus select-nodus" value={createForm.status}
                    onChange={handleCreateFormChange('status')}>
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagada</option>
                    <option value="overdue">Vencida</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="label-nodus">Fecha de Pago</label>
                  <input type="date" name="paidDate" className="input-nodus"
                    value={createForm.paidDate} onChange={handleCreateFormChange('paidDate')} />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn-nodus btn-primary-nodus">Crear</button>
                <button type="button" className="btn-nodus btn-ghost" onClick={() => { setShowForm(false); setCreateForm(emptyCreateForm); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGenerar && (
        <div className="card-nodus mb-3">
          <div className="card-header-nodus">
            <h3 className="card-header-title">Generar Cuotas Mensuales</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleGenerarSubmit} className="d-flex flex-column gap-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="label-nodus">Mes</label>
                  <input type="text" className="input-nodus" placeholder="Ej: Mayo 2026" value={generarMonth} onChange={e => setGenerarMonth(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="label-nodus">Fecha de Vencimiento</label>
                  <input type="date" className="input-nodus" value={generarDueDate} onChange={e => setGenerarDueDate(e.target.value)} />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn-nodus btn-primary-nodus">Generar</button>
                <button type="button" className="btn-nodus btn-ghost" onClick={() => { setShowGenerar(false); setGenerarMonth(''); setGenerarDueDate(''); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card-nodus">
        <div className={styles.tableScroll}>
          <table className="table-nodus">
            <thead>
              <tr>
                <th>Unidad</th>
                <th>Inquilino</th>
                <th>Contacto</th>
                <th>Período</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(fee => {
                const cfg = statusConfig[fee.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={fee.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className={styles.unitBadge}><DollarSign size={13} color="var(--accent)" /></div>
                        <span className={styles.unitNumber}>{fee.unitNumber}</span>
                      </div>
                    </td>
                    <td><div className={styles.tenantName}>{fee.tenantName}</div></td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <div className={styles.contactRow}><Mail size={11} /> {fee.email}</div>
                        <div className={styles.contactRow}><Phone size={11} /> {fee.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.periodText}>{fee.month}</div>
                      {fee.paidDate && <div className={styles.paidDate}>Pagado: {fee.paidDate}</div>}
                      {fee.dueDate && fee.status !== 'paid' && (
                        <div className={styles.dueDate}
                          style={{ color: fee.status === 'overdue' ? 'var(--danger-text)' : 'var(--warning-text)' }}>
                          Vence: {fee.dueDate}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={styles.amountMain}>{formatCurrency(fee.total)}</div>
                      <div className={styles.amountDetail}>
                        Base: {formatCurrency(fee.amount)}
                        {fee.extraCharges > 0 && ` + ${formatCurrency(fee.extraCharges)}`}
                      </div>
                    </td>
                    <td>
                      <span className={`badge-nodus ${cfg.badgeClass}`}>
                        <StatusIcon size={11} /> {cfg.label}
                      </span>
                    </td>
                    <td>
                      {fee.status !== 'paid' ? (
                        <button onClick={() => onUpdateStatus(fee.id, 'paid')}
                          className="btn-nodus btn-success-nodus btn-sm-nodus">Marcar Pagada</button>
                      ) : (
                        <button onClick={() => onUpdateStatus(fee.id, 'pending')}
                          className="btn-nodus btn-warning-nodus btn-sm-nodus">Marcar Pendiente</button>
                      )}
                      <button onClick={() => startEdit(fee)}
                        className="btn-nodus btn-ghost btn-sm-nodus ms-2">Editar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-state">
              <Search size={40} className="empty-state-icon" />
              <p className={styles.emptyTitle}>Sin resultados</p>
              <p className={styles.emptyText}>No se encontraron cuotas con los filtros seleccionados</p>
            </div>
          )}

          {editingFee && (
            <div className="modal-overlay" onClick={() => cancelEdit()}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">Editar Cuota {editingFee.unitNumber}</h3>
                  <button className="modal-close" onClick={() => cancelEdit()}>✕</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditSubmit} className="d-flex flex-column gap-3">
                    <div>
                      <label className="label-nodus">Período</label>
                      <input type="text" name="month" className="input-nodus" defaultValue={editingFee.month} />
                    </div>
                    <div>
                      <label className="label-nodus">Monto Base</label>
                      <input type="number" name="amount" className="input-nodus" defaultValue={editingFee.amount} />
                    </div>
                    <div>
                      <label className="label-nodus">Cargos Extra</label>
                      <input type="number" name="extraCharges" className="input-nodus" defaultValue={editingFee.extraCharges} />
                    </div>
                    <div>
                      <label className="label-nodus">Fecha Vencimiento</label>
                      <input type="date" name="dueDate" className="input-nodus" defaultValue={toInputDate(editingFee.dueDate)} />
                    </div>
                    <div>
                      <label className="label-nodus">Estado</label>
                      <select name="status" className="input-nodus select-nodus" defaultValue={editingFee.status}>
                        <option value="pending">Pendiente</option>
                        <option value="paid">Pagada</option>
                        <option value="overdue">Vencida</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-nodus">Fecha de Pago</label>
                      <input type="date" name="paidDate" className="input-nodus" defaultValue={toInputDate(editingFee.paidDate)} />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn-nodus btn-primary-nodus flex-fill">Guardar</button>
                      <button type="button" className="btn-nodus btn-ghost flex-fill" onClick={() => cancelEdit()}>Cancelar</button>
                    </div>
                  </form>
                  <div className="d-flex gap-2 mt-3">
                    <button className="btn-nodus btn-danger-nodus btn-sm-nodus" onClick={handleDelete}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
