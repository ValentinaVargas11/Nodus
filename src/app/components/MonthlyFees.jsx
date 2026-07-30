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

export default function MonthlyFees({ fees, onUpdateStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = fees.filter(fee =>
    (fee.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     fee.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || fee.status === statusFilter)
  );

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
          <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
            <div className="input-with-icon flex-grow-1">
              <Search size={15} className="input-icon" />
              <input type="text" className="input-nodus"
                placeholder="Buscar por inquilino o unidad…"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="filter-tabs flex-shrink-0">
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
            </div>
          </div>
        </div>
      </div>

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
        </div>
      </div>
    </div>
  );
}
