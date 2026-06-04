import { Package, AlertTriangle, TrendingDown, Plus, Minus } from 'lucide-react';

const categoryIcons = {
  'Mantenimiento': '🔧',
  'Seguridad':     '🔒',
  'Limpieza':      '🧹',
  'Eléctrico':     '⚡',
};

export default function Inventory({ items, onUpdateQuantity }) {
  const lowStock  = items.filter(item => item.quantity <= item.minStock);
  const categories = [...new Set(items.map(item => item.category))];

  return (
    <div>
      {/* Header */}
      <div className="page-header d-flex align-items-start justify-content-between gap-3">
        <div>
          <h1 className="page-title">Inventario</h1>
          <p className="page-subtitle">Control de insumos y materiales del edificio</p>
        </div>
        <div className="d-flex gap-2">
          <div className="kpi-card" style={{ padding: '12px 16px' }}>
            <div className="kpi-icon-wrap" style={{ background: 'var(--surface-2)', width: 36, height: 36 }}>
              <Package size={18} color="var(--text-secondary)" />
            </div>
            <div>
              <div className="kpi-value" style={{ fontSize: '20px' }}>{items.length}</div>
              <div className="kpi-label">Productos</div>
            </div>
          </div>
          {lowStock.length > 0 && (
            <div className="kpi-card" style={{ padding: '12px 16px' }}>
              <div className="kpi-icon-wrap" style={{ background: 'var(--danger-soft)', width: 36, height: 36 }}>
                <AlertTriangle size={18} color="var(--danger)" />
              </div>
              <div>
                <div className="kpi-value" style={{ fontSize: '20px', color: 'var(--danger)' }}>{lowStock.length}</div>
                <div className="kpi-label">Stock bajo</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert */}
      {lowStock.length > 0 && (
        <div className="alert-nodus alert-danger-nodus mb-4">
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              Alerta de Stock Bajo — {lowStock.length} {lowStock.length === 1 ? 'producto necesita' : 'productos necesitan'} reabastecimiento
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {lowStock.map(item => (
                <li key={item.id} style={{ fontSize: '13px' }}>
                  · <strong>{item.name}</strong>: {item.quantity} {item.unit} (mínimo: {item.minStock})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="d-flex flex-column gap-3">
        {categories.map(category => {
          const catItems = items.filter(i => i.category === category);
          const catLow   = catItems.filter(i => i.quantity <= i.minStock).length;

          return (
            <div key={category} className="card-nodus">
              <div className="card-header-nodus">
                <h3 className="card-header-title">
                  <span style={{ fontSize: '16px' }}>{categoryIcons[category] || '📦'}</span>
                  {category}
                </h3>
                {catLow > 0 && (
                  <span className="badge-nodus badge-danger">
                    <AlertTriangle size={11} />
                    {catLow} con stock bajo
                  </span>
                )}
              </div>

              <div className="card-body">
                <div className="d-flex flex-column gap-2">
                  {catItems.map(item => {
                    const isLow    = item.quantity <= item.minStock;
                    const pct      = Math.min(100, Math.round((item.quantity / (item.minStock * 2)) * 100));
                    const barColor = isLow
                      ? 'var(--danger)'
                      : item.quantity < item.minStock * 1.5
                        ? 'var(--warning)'
                        : 'var(--success)';

                    return (
                      <div
                        key={item.id}
                        className={`inventory-row${isLow ? ' low-stock' : ''}`}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{item.name}</span>
                            {isLow && (
                              <span className="badge-nodus badge-danger">
                                <TrendingDown size={10} /> Stock Bajo
                              </span>
                            )}
                          </div>
                          <div className="d-flex align-items-center gap-3 flex-wrap" style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 6 }}>
                            <span>Stock: <strong style={{ color: isLow ? 'var(--danger)' : 'var(--text-primary)' }}>{item.quantity} {item.unit}</strong></span>
                            <span>·</span>
                            <span>Mínimo: {item.minStock} {item.unit}</span>
                            <span>·</span>
                            <span>Última reposición: {item.lastRestocked}</span>
                          </div>
                          <div className="progress-nodus" style={{ width: '120px' }}>
                            <div
                              className="progress-nodus-bar"
                              style={{ width: `${pct}%`, background: barColor }}
                            />
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="d-flex align-items-center gap-2 ms-3 flex-shrink-0">
                          <button
                            className="btn-icon"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            disabled={item.quantity === 0}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{
                            minWidth: 44,
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '16px',
                            fontFamily: 'var(--font-mono)',
                            color: isLow ? 'var(--danger)' : 'var(--text-primary)',
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            className="btn-icon"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
