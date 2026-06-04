import { useState } from 'react';
import {
  LayoutDashboard, Building2, DollarSign, Wrench, Package,
  Menu, X, ChevronLeft
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import RoomGrid from './components/RoomGrid';
import RoomDetailModal from './components/RoomDetailModal';
import MonthlyFees from './components/MonthlyFees';
import MaintenanceTasks from './components/MaintenanceTasks';
import Inventory from './components/Inventory';
import '../styles/nodus.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Datos simulados — sin cambios ─────────────────────────
  const [rooms, setRooms] = useState([
    { id: '1',  number: '1A', floor: 1, type: '2 ambientes',  status: 'occupied',    guests: 2, guestName: 'Juan Pérez',       tenantSince: 'Ene 2024' },
    { id: '2',  number: '1B', floor: 1, type: '3 ambientes',  status: 'available',   guests: 0 },
    { id: '3',  number: '1C', floor: 1, type: '2 ambientes',  status: 'cleaning',    guests: 0 },
    { id: '4',  number: '2A', floor: 2, type: '4 ambientes',  status: 'occupied',    guests: 4, guestName: 'María González',    tenantSince: 'Mar 2023' },
    { id: '5',  number: '2B', floor: 2, type: '2 ambientes',  status: 'available',   guests: 0 },
    { id: '6',  number: '2C', floor: 2, type: '3 ambientes',  status: 'occupied',    guests: 3, guestName: 'Carlos Rodríguez',  tenantSince: 'Jul 2025' },
    { id: '7',  number: '3A', floor: 3, type: '2 ambientes',  status: 'available',   guests: 0 },
    { id: '8',  number: '3B', floor: 3, type: '3 ambientes',  status: 'occupied',    guests: 2, guestName: 'Ana Martínez',      tenantSince: 'Dic 2024' },
    { id: '9',  number: '3C', floor: 3, type: '4 ambientes',  status: 'maintenance', guests: 0 },
    { id: '10', number: '4A', floor: 4, type: '2 ambientes',  status: 'cleaning',    guests: 0 },
    { id: '11', number: '4B', floor: 4, type: '2 ambientes',  status: 'available',   guests: 0 },
    { id: '12', number: '4C', floor: 4, type: '4 ambientes',  status: 'occupied',    guests: 3, guestName: 'Familia López',     tenantSince: 'Ago 2022' },
    { id: '13', number: '5A', floor: 5, type: '2 ambientes',  status: 'available',   guests: 0 },
    { id: '14', number: '5B', floor: 5, type: '3 ambientes',  status: 'available',   guests: 0 },
    { id: '15', number: '5C', floor: 5, type: '3 ambientes',  status: 'occupied',    guests: 2, guestName: 'Pedro Fernández',   tenantSince: 'Feb 2025' },
    { id: '16', number: 'PH', floor: 6, type: 'Penthouse',    status: 'occupied',    guests: 2, guestName: 'Roberto Silva',     tenantSince: 'Nov 2021' },
  ]);

  const [monthlyFees, setMonthlyFees] = useState([
    { id: '1', unitNumber: '1A',  tenantName: 'Juan Pérez',       email: 'juan.perez@email.com',      phone: '+54 9 11 4567-8901', month: 'Abril 2026', amount: 85000,  extraCharges: 12000, total: 97000,  status: 'paid',    paidDate: '05/04/2026' },
    { id: '2', unitNumber: '2A',  tenantName: 'María González',   email: 'maria.g@email.com',         phone: '+54 9 11 5678-9012', month: 'Abril 2026', amount: 120000, extraCharges: 8000,  total: 128000, status: 'paid',    paidDate: '03/04/2026' },
    { id: '3', unitNumber: '2C',  tenantName: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com',phone: '+54 9 11 6789-0123', month: 'Abril 2026', amount: 95000,  extraCharges: 15000, total: 110000, status: 'pending', dueDate: '10/04/2026' },
    { id: '4', unitNumber: '3B',  tenantName: 'Ana Martínez',     email: 'ana.martinez@email.com',    phone: '+54 9 11 7890-1234', month: 'Abril 2026', amount: 98000,  extraCharges: 5000,  total: 103000, status: 'pending', dueDate: '10/04/2026' },
    { id: '5', unitNumber: '4C',  tenantName: 'Familia López',    email: 'lopez.familia@email.com',   phone: '+54 9 11 8901-2345', month: 'Abril 2026', amount: 125000, extraCharges: 20000, total: 145000, status: 'overdue', dueDate: '10/03/2026' },
    { id: '6', unitNumber: '5C',  tenantName: 'Pedro Fernández',  email: 'pedro.f@email.com',         phone: '+54 9 11 9012-3456', month: 'Abril 2026', amount: 92000,  extraCharges: 6000,  total: 98000,  status: 'paid',    paidDate: '01/04/2026' },
    { id: '7', unitNumber: 'PH',  tenantName: 'Roberto Silva',    email: 'roberto.silva@email.com',   phone: '+54 9 11 0123-4567', month: 'Abril 2026', amount: 180000, extraCharges: 25000, total: 205000, status: 'pending', dueDate: '10/04/2026' },
  ]);

  const [tasks, setTasks] = useState([
    { id: '1', roomNumber: '3C',            title: 'Aire acondicionado no funciona',     description: 'El sistema de climatización no enciende. Revisar conexión eléctrica y compresor.', priority: 'high',   status: 'in_progress', reportedBy: 'Inquilino',       reportedAt: '09/04/2026', assignedTo: 'Juan Técnico' },
    { id: '2', roomNumber: '1C',            title: 'Canilla del baño pierde agua',        description: 'Pequeña pérdida de agua en la canilla del lavabo.',                               priority: 'medium', status: 'pending',     reportedBy: 'Personal de limpieza', reportedAt: '08/04/2026' },
    { id: '3', roomNumber: 'Pasillo Piso 5',title: 'Lámpara del pasillo quemada',         description: 'Lámpara central del pasillo no funciona.',                                         priority: 'low',    status: 'pending',     reportedBy: 'Encargado',       reportedAt: '07/04/2026' },
    { id: '4', roomNumber: '3A',            title: 'Reparación de persiana',              description: 'La persiana se atascó y no sube correctamente.',                                   priority: 'medium', status: 'completed',   reportedBy: 'Inquilino',       reportedAt: '05/04/2026', assignedTo: 'Pedro Mantenimiento' },
    { id: '5', roomNumber: 'Terraza',       title: 'Portón de acceso a terraza roto',     description: 'El portón no cierra correctamente, problema de seguridad.',                        priority: 'high',   status: 'pending',     reportedBy: 'Encargado',       reportedAt: '09/04/2026' },
    { id: '6', roomNumber: 'Ascensor',      title: 'Mantenimiento preventivo ascensor',   description: 'Revisión mensual programada del sistema de ascensor.',                             priority: 'medium', status: 'in_progress', reportedBy: 'Administración',  reportedAt: '08/04/2026', assignedTo: 'Servicio Técnico Ascensores SA' },
  ]);

  const [inventory, setInventory] = useState([
    { id: '1',  name: 'Lámparas LED',              category: 'Mantenimiento', quantity: 15,  minStock: 20,  unit: 'unidades', lastRestocked: '01/04/2026' },
    { id: '2',  name: 'Llaves de paso',             category: 'Mantenimiento', quantity: 8,   minStock: 10,  unit: 'unidades', lastRestocked: '15/03/2026' },
    { id: '3',  name: 'Pintura blanca',             category: 'Mantenimiento', quantity: 12,  minStock: 15,  unit: 'litros',   lastRestocked: '28/03/2026' },
    { id: '4',  name: 'Candados para portones',     category: 'Seguridad',     quantity: 6,   minStock: 5,   unit: 'unidades', lastRestocked: '20/03/2026' },
    { id: '5',  name: 'Llaves maestras',            category: 'Seguridad',     quantity: 8,   minStock: 10,  unit: 'unidades', lastRestocked: '10/03/2026' },
    { id: '6',  name: 'Detergente industrial',      category: 'Limpieza',      quantity: 18,  minStock: 20,  unit: 'litros',   lastRestocked: '29/03/2026' },
    { id: '7',  name: 'Desinfectante',              category: 'Limpieza',      quantity: 25,  minStock: 30,  unit: 'litros',   lastRestocked: '29/03/2026' },
    { id: '8',  name: 'Lavandina',                  category: 'Limpieza',      quantity: 32,  minStock: 25,  unit: 'litros',   lastRestocked: '05/04/2026' },
    { id: '9',  name: 'Escobas',                    category: 'Limpieza',      quantity: 8,   minStock: 10,  unit: 'unidades', lastRestocked: '15/02/2026' },
    { id: '10', name: 'Bolsas de basura 100L',      category: 'Limpieza',      quantity: 145, minStock: 100, unit: 'unidades', lastRestocked: '03/04/2026' },
    { id: '11', name: 'Papel higiénico (áreas comunes)', category: 'Limpieza', quantity: 85,  minStock: 60,  unit: 'rollos',   lastRestocked: '07/04/2026' },
    { id: '12', name: 'Jabón líquido',              category: 'Limpieza',      quantity: 22,  minStock: 20,  unit: 'litros',   lastRestocked: '02/04/2026' },
    { id: '13', name: 'Fusibles 10A',               category: 'Eléctrico',     quantity: 24,  minStock: 30,  unit: 'unidades', lastRestocked: '10/03/2026' },
    { id: '14', name: 'Cables eléctricos',          category: 'Eléctrico',     quantity: 45,  minStock: 40,  unit: 'metros',   lastRestocked: '22/03/2026' },
  ]);

  // ── Stats — sin cambios ────────────────────────────────────
  const stats = {
    totalRooms:    rooms.length,
    occupied:      rooms.filter(r => r.status === 'occupied').length,
    available:     rooms.filter(r => r.status === 'available').length,
    cleaning:      rooms.filter(r => r.status === 'cleaning').length,
    maintenance:   rooms.filter(r => r.status === 'maintenance').length,
    totalGuests:   rooms.reduce((s, r) => s + (r.guests || 0), 0),
    occupancyRate: Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100),
    totalFees:     monthlyFees.reduce((s, f) => s + f.total, 0),
    paidFees:      monthlyFees.filter(f => f.status === 'paid').length,
    pendingFees:   monthlyFees.filter(f => f.status === 'pending').length,
    overdueFees:   monthlyFees.filter(f => f.status === 'overdue').length,
  };

  // ── Handlers — sin cambios ─────────────────────────────────
  const handleRoomStatusChange = (roomId, newStatus) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    setSelectedRoom(null);
  };

  const handleUpdateFeeStatus = (id, status) => {
    setMonthlyFees(monthlyFees.map(fee =>
      fee.id === id
        ? { ...fee, status, paidDate: status === 'paid' ? new Date().toLocaleDateString('es-AR') : undefined }
        : fee
    ));
  };

  const handleUpdateTask = (taskId, updates) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const handleAddTask = (newTask) => {
    setTasks([{ ...newTask, id: Date.now().toString() }, ...tasks]);
  };

  const handleUpdateInventory = (itemId, change) => {
    setInventory(inventory.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    ));
  };

  // ── Nav items ──────────────────────────────────────────────
  const tabs = [
    { id: 'dashboard',   label: 'Dashboard',       icon: LayoutDashboard },
    { id: 'units',       label: 'Unidades',         icon: Building2       },
    { id: 'fees',        label: 'Cuotas/Expensas',  icon: DollarSign      },
    { id: 'maintenance', label: 'Reparaciones',     icon: Wrench          },
    { id: 'inventory',   label: 'Inventario',       icon: Package         },
  ];

  return (
    <div className="app-shell">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`sidebar${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">N</div>
            <span className="sidebar-logo-text">Nodus</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`sidebar-nav-item${activeTab === tab.id ? ' active' : ''}`}
                title={!sidebarOpen ? tab.label : undefined}
              >
                <Icon className="nav-icon" size={18} />
                <span className="nav-label">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">© 2026 Nodus</div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="app-content">
        <div className="page-body">
          {activeTab === 'dashboard'   && <Dashboard stats={stats} />}
          {activeTab === 'units'       && <RoomGrid rooms={rooms} onRoomClick={setSelectedRoom} />}
          {activeTab === 'fees'        && <MonthlyFees fees={monthlyFees} onUpdateStatus={handleUpdateFeeStatus} />}
          {activeTab === 'maintenance' && <MaintenanceTasks tasks={tasks} onUpdateTask={handleUpdateTask} onAddTask={handleAddTask} />}
          {activeTab === 'inventory'   && <Inventory items={inventory} onUpdateQuantity={handleUpdateInventory} />}
        </div>
      </main>

      {/* ── Room Modal ──────────────────────────────────── */}
      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onChangeStatus={handleRoomStatusChange}
      />
    </div>
  );
}
