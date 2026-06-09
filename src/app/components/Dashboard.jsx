import { TrendingUp, DollarSign, Building2, Users, DoorOpen, Wrench, ClipboardCheck } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);

const COLORS_PIE = ['#4B5263', '#16a34a', '#d97706', '#dc2626'];

export default function Dashboard({ stats }) {
  const monthlyData = [
    { month: 'Nov', ocupadas: 10, ingresos: 850000  },
    { month: 'Dic', ocupadas: 12, ingresos: 920000  },
    { month: 'Ene', ocupadas: 9,  ingresos: 780000  },
    { month: 'Feb', ocupadas: 11, ingresos: 890000  },
    { month: 'Mar', ocupadas: 13, ingresos: 1050000 },
    { month: 'Abr', ocupadas: stats.occupied, ingresos: stats.totalFees },
  ];

  const pieData = [
    { name: 'Ocupadas',      value: stats.occupied    },
    { name: 'Disponibles',   value: stats.available   },
    { name: 'Limpieza',      value: stats.cleaning    },
    { name: 'Mantenimiento', value: stats.maintenance },
  ];

  const statCards = [
    { label: 'Unidades Totales',  value: stats.totalRooms,  icon: Building2,     bg: '#f0f1f4', color: '#4B5263' },
    { label: 'Ocupadas',          value: stats.occupied,    icon: DoorOpen,      bg: '#dcfce7', color: '#16a34a' },
    { label: 'Disponibles',       value: stats.available,   icon: Building2,     bg: '#d1fae5', color: '#059669' },
    { label: 'En Limpieza',       value: stats.cleaning,    icon: ClipboardCheck,bg: '#fef3c7', color: '#d97706' },
    { label: 'Mantenimiento',     value: stats.maintenance, icon: Wrench,        bg: '#fee2e2', color: '#dc2626' },
    { label: 'Inquilinos Activos',value: stats.totalGuests, icon: Users,         bg: '#f3e8ff', color: '#9333ea' },
  ];

  return (
    <div>
      {/* ── Header ────────────────────────────────────────── */}
      <div className="page-header d-flex align-items-start justify-content-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Vista general del edificio</p>
        </div>

        <div className="d-flex gap-3 flex-wrap">
          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: '#dcfce7' }}>
              <TrendingUp size={22} color="#16a34a" />
            </div>
            <div>
              <div className="kpi-value" style={{ color: '#16a34a' }}>{stats.occupancyRate}%</div>
              <div className="kpi-label">Tasa de ocupación</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: '#f0f1f4' }}>
              <DollarSign size={22} color="#4B5263" />
            </div>
            <div>
              <div className="kpi-value" style={{ color: '#4B5263', fontSize: '20px' }}>
                {formatCurrency(stats.totalFees)}
              </div>
              <div className="kpi-label">Ingresos del mes</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Grid ─────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="col-6 col-md-4 col-xl-2">
              <div className="stat-card">
                <div className="stat-card-icon" style={{ background: card.bg }}>
                  <Icon size={18} color={card.color} />
                </div>
                <div className="stat-card-value">{card.value}</div>
                <div className="stat-card-label">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts row ────────────────────────────────────── */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-7">
          <div className="card-nodus">
            <div className="card-header-nodus">
              <h3 className="card-header-title">Ocupación Mensual</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e6f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontFamily: 'DM Sans' }}
                    cursor={{ fill: 'rgba(79,110,247,0.05)' }}
                  />
                  <Bar dataKey="ocupadas" fill="#4B5263" name="Unidades Ocupadas" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card-nodus h-100">
            <div className="card-header-nodus">
              <h3 className="card-header-title">Distribución de Unidades</h3>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS_PIE[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e6f0', fontFamily: 'DM Sans' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ingresos chart ────────────────────────────────── */}
      <div className="card-nodus">
        <div className="card-header-nodus">
          <h3 className="card-header-title">Ingresos por Cuotas / Expensas</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={v => formatCurrency(v)}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e6f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontFamily: 'DM Sans' }}
                cursor={{ fill: 'rgba(147,51,234,0.05)' }}
              />
              <Bar dataKey="ingresos" fill="#8b5cf6" name="Ingresos" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
