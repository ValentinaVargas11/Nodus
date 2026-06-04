import { useState } from 'react';
import { Search, CheckCircle, Clock, AlertTriangle, DollarSign, Mail, Phone } from 'lucide-react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);

const statusConfig = {
  paid:    { label: 'Pagada',    badgeClass: 'badge-success', icon: CheckCircle  },
  pending: { label: 'Pendiente', badgeClass: 'badge-warning', icon: Clock        },
  overdue: { label: 'Vencida',   badgeClass: 'badge-danger',  icon: AlertTriangle },
};

const summaryCards = (fees) => [
  {
    key: 'paid',
    label: 'Cobrado',
    color: 'var(--success)',
    bg: 'var(--success-soft)',
    border: '#bbf7d0',
    icon: CheckCircle,
    value: formatCurrency(fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.total, 0)),
    sub: `${fees.filter(f => f.status === 'paid').length} pagadas`,
  },
  {
    key: 'pending',
    label: 'Pendiente',
    color: 'var(--warning)',
    bg: 'var(--warning-soft)',
    border: '#fde68a',
    icon: Clock,
    value: formatCurrency(fees.filter(f => f.status === 'pending').reduce((s, f) => s + f.total, 0)),
    sub: `${fees.filter(f => f.status === 'pending').length} pendientes`,
  },
  {
    key: 'overdue',
    label: 'Vencido',
    color: 'var(--danger)',
    bg: 'var(--danger-soft)',
    border: '#fecaca',
    icon: AlertTriangle,
    value: formatCurrency(fees.filter(f => f.status === 'overdue').reduce((s, f) => s + f.total, 0)),
    sub: `${fees.filter(f => f.status === 'overdue').length} vencidas`,
  },
];

export default function MonthlyFees({ fees, onUpdateStatus }) {
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = fees.filter(fee => {
    const matchSearch = fee.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
                     || fee.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || fee.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const cards = summaryCards(fees);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Cuotas Mensuales / Expensas</h1>
        <p className="page-subtitle">Gestión de pagos mensuales</p>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="col-12 col-md-4">
              <div style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: 'var(--radius-lg)',
                padding: '20px 22px',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Icon size={18} color={card.color} />
                  <span style={{ fontWeight: 600, fontSize: '13.5px', color: card.color }}>{card.label}</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', color: card.color, lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '12px', marginTop: 5, color: card.color, opacity: 0.8 }}>{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + filters */}
      <div className="card-nodus mb-3">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
            <div className="input-with-icon flex-grow-1">
              <Search size={15} className="input-icon" />
              <input
                type="text"
                className="input-nodus"
                placeholder="Buscar por inquilino o unidad…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-tabs flex-shrink-0">
              {[
                { key: 'all',     label: 'Todas'     },
                { key: 'paid',    label: 'Pagadas'   },
                { key: 'pending', label: 'Pendientes' },
                { key: 'overdue', label: 'Vencidas'  },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`filter-tab${statusFilter === tab.key ? ' active' : ''}`}
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label}
                  <span className="count-badge">
                    {tab.key === 'all' ? fees.length : fees.filter(f => f.status === tab.key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-nodus">
        <div style={{ overflowX: 'auto' }}>
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
                        <div style={{
                          width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                          background: 'var(--accent-soft)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <DollarSign size={13} color="var(--accent)" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{fee.unitNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{fee.tenantName}</div>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <div className="d-flex align-items-center gap-1" style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          <Mail size={11} /> {fee.email}
                        </div>
                        <div className="d-flex align-items-center gap-1" style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          <Phone size={11} /> {fee.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13.5px' }}>{fee.month}</div>
                      {fee.paidDate && (
                        <div style={{ fontSize: '11.5px', color: 'var(--success-text)' }}>Pagado: {fee.paidDate}</div>
                      )}
                      {fee.dueDate && fee.status !== 'paid' && (
                        <div style={{ fontSize: '11.5px', color: fee.status === 'overdue' ? 'var(--danger-text)' : 'var(--warning-text)' }}>
                          Vence: {fee.dueDate}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{formatCurrency(fee.total)}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Base: {formatCurrency(fee.amount)}
                        {fee.extraCharges > 0 && ` + ${formatCurrency(fee.extraCharges)}`}
                      </div>
                    </td>
                    <td>
                      <span className={`badge-nodus ${cfg.badgeClass}`}>
                        <StatusIcon size={11} />
                        {cfg.label}
                      </span>
                    </td>
                    <td>
                      {fee.status !== 'paid' ? (
                        <button
                          onClick={() => onUpdateStatus(fee.id, 'paid')}
                          className="btn-nodus btn-success-nodus btn-sm-nodus"
                        >
                          Marcar Pagada
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(fee.id, 'pending')}
                          className="btn-nodus btn-warning-nodus btn-sm-nodus"
                        >
                          Marcar Pendiente
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-state">
              <Search size={40} className="empty-state-icon" />
              <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: 4 }}>Sin resultados</p>
              <p style={{ fontSize: '13px' }}>No se encontraron cuotas con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
