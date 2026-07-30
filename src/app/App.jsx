import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import LoginPage from '../pages/LoginPage';
import Dashboard from './components/Dashboard';
import RoomGrid from './components/RoomGrid';
import RoomDetailModal from './components/RoomDetailModal';
import MonthlyFees from './components/MonthlyFees';
import MaintenanceTasks from './components/MaintenanceTasks';
import Inventory from './components/Inventory';

const TOAST_STYLE = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: '13.5px', borderRadius: '10px', padding: '12px 16px',
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: TOAST_STYLE }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<Navigate to="/unidades" replace />} />
            <Route path="dashboard"
              element={<ProtectedRoute allowedRoles={['Administrador General', 'Backoffice', 'Encargada de Edificio', 'Encargado de Edificio']}>
                <DashboardSection />
              </ProtectedRoute>} />
            <Route path="unidades"
              element={<ProtectedRoute allowedRoles={['Administrador General', 'Limpieza', 'Encargada de Edificio', 'Encargado de Edificio']}>
                <RoomsSection />
              </ProtectedRoute>} />
            <Route path="cuotas"
              element={<ProtectedRoute allowedRoles={['Administrador General', 'Backoffice']}>
                <FeesSection />
              </ProtectedRoute>} />
            <Route path="reparaciones"
              element={<ProtectedRoute allowedRoles={['Administrador General', 'Limpieza', 'Encargada de Edificio', 'Encargado de Edificio']}>
                <TasksSection />
              </ProtectedRoute>} />
            <Route path="inventario"
              element={<ProtectedRoute allowedRoles={['Administrador General', 'Limpieza', 'Encargada de Edificio', 'Encargado de Edificio']}>
                <InventorySection />
              </ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/unidades" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

/* Mock sections — reemplazar con API calls en fases posteriores */

function DashboardSection() {
  const [mockStats] = useState({
    totalRooms: 16, occupied: 7, available: 5, cleaning: 2,
    maintenance: 2, totalGuests: 18, occupancyRate: 44,
    totalFees: 886000, paidFees: 3, pendingFees: 3, overdueFees: 1,
  });
  return <Dashboard stats={mockStats} />;
}

function RoomsSection() {
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
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <>
      <RoomGrid rooms={rooms} onRoomClick={setSelectedRoom} />
      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onChangeStatus={(roomId, newStatus) => {
          setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
          setSelectedRoom(null);
        }}
      />
    </>
  );
}

function FeesSection() {
  const [fees, setFees] = useState([
    { id: '1', unitNumber: '1A', tenantName: 'Juan Pérez',       email: 'juan.perez@email.com',       phone: '+54 9 11 4567-8901', month: 'Abril 2026', amount: 85000,  extraCharges: 12000, total: 97000,  status: 'paid',    paidDate: '05/04/2026' },
    { id: '2', unitNumber: '2A', tenantName: 'María González',   email: 'maria.g@email.com',          phone: '+54 9 11 5678-9012', month: 'Abril 2026', amount: 120000, extraCharges: 8000,  total: 128000, status: 'paid',    paidDate: '03/04/2026' },
    { id: '3', unitNumber: '2C', tenantName: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', phone: '+54 9 11 6789-0123', month: 'Abril 2026', amount: 95000,  extraCharges: 15000, total: 110000, status: 'pending', dueDate: '10/04/2026' },
    { id: '4', unitNumber: '3B', tenantName: 'Ana Martínez',     email: 'ana.martinez@email.com',     phone: '+54 9 11 7890-1234', month: 'Abril 2026', amount: 98000,  extraCharges: 5000,  total: 103000, status: 'pending', dueDate: '10/04/2026' },
    { id: '5', unitNumber: '4C', tenantName: 'Familia López',    email: 'lopez.familia@email.com',    phone: '+54 9 11 8901-2345', month: 'Abril 2026', amount: 125000, extraCharges: 20000, total: 145000, status: 'overdue', dueDate: '10/03/2026' },
    { id: '6', unitNumber: '5C', tenantName: 'Pedro Fernández',  email: 'pedro.f@email.com',          phone: '+54 9 11 9012-3456', month: 'Abril 2026', amount: 92000,  extraCharges: 6000,  total: 98000,  status: 'paid',    paidDate: '01/04/2026' },
    { id: '7', unitNumber: 'PH', tenantName: 'Roberto Silva',    email: 'roberto.silva@email.com',    phone: '+54 9 11 0123-4567', month: 'Abril 2026', amount: 180000, extraCharges: 25000, total: 205000, status: 'pending', dueDate: '10/04/2026' },
  ]);

  return (
    <MonthlyFees fees={fees} onUpdateStatus={(id, status) =>
      setFees(fees.map(f => f.id === id
        ? { ...f, status, paidDate: status === 'paid' ? new Date().toLocaleDateString('es-AR') : undefined }
        : f
      ))
    } />
  );
}

function TasksSection() {
  const [tasks, setTasks] = useState([
    { id: '1', roomNumber: '3C',             title: 'Aire acondicionado no funciona',   description: 'El sistema de climatización no enciende.',                                     priority: 'high',   status: 'in_progress', reportedBy: 'Inquilino',            reportedAt: '09/04/2026', assignedTo: 'Juan Técnico' },
    { id: '2', roomNumber: '1C',             title: 'Canilla del baño pierde agua',     description: 'Pequeña pérdida de agua en la canilla del lavabo.',                              priority: 'medium', status: 'pending',     reportedBy: 'Personal de limpieza', reportedAt: '08/04/2026' },
    { id: '3', roomNumber: 'Pasillo Piso 5', title: 'Lámpara del pasillo quemada',      description: 'Lámpara central del pasillo no funciona.',                                        priority: 'low',    status: 'pending',     reportedBy: 'Encargado',            reportedAt: '07/04/2026' },
    { id: '4', roomNumber: '3A',             title: 'Reparación de persiana',           description: 'La persiana se atascó y no sube correctamente.',                                  priority: 'medium', status: 'completed',   reportedBy: 'Inquilino',            reportedAt: '05/04/2026', assignedTo: 'Pedro Mantenimiento' },
    { id: '5', roomNumber: 'Terraza',        title: 'Portón de acceso a terraza roto',  description: 'El portón no cierra correctamente, problema de seguridad.',                       priority: 'high',   status: 'pending',     reportedBy: 'Encargado',            reportedAt: '09/04/2026' },
    { id: '6', roomNumber: 'Ascensor',       title: 'Mantenimiento preventivo',         description: 'Revisión mensual programada del sistema de ascensor.',                            priority: 'medium', status: 'in_progress', reportedBy: 'Administración',       reportedAt: '08/04/2026', assignedTo: 'Servicio Técnico Ascensores SA' },
  ]);

  return (
    <MaintenanceTasks tasks={tasks}
      onUpdateTask={(id, updates) => setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t))}
      onAddTask={(newTask) => setTasks([{ ...newTask, id: Date.now().toString() }, ...tasks])} />
  );
}

function InventorySection() {
  const [items, setItems] = useState([
    { id: '1',  name: 'Lámparas LED',              category: 'Mantenimiento', quantity: 15,  minStock: 20,  unit: 'unidades', lastRestocked: '01/04/2026' },
    { id: '2',  name: 'Llaves de paso',            category: 'Mantenimiento', quantity: 8,   minStock: 10,  unit: 'unidades', lastRestocked: '15/03/2026' },
    { id: '3',  name: 'Pintura blanca',            category: 'Mantenimiento', quantity: 12,  minStock: 15,  unit: 'litros',   lastRestocked: '28/03/2026' },
    { id: '4',  name: 'Candados para portones',    category: 'Seguridad',     quantity: 6,   minStock: 5,   unit: 'unidades', lastRestocked: '20/03/2026' },
    { id: '5',  name: 'Llaves maestras',           category: 'Seguridad',     quantity: 8,   minStock: 10,  unit: 'unidades', lastRestocked: '10/03/2026' },
    { id: '6',  name: 'Detergente industrial',     category: 'Limpieza',      quantity: 18,  minStock: 20,  unit: 'litros',   lastRestocked: '29/03/2026' },
    { id: '7',  name: 'Desinfectante',             category: 'Limpieza',      quantity: 25,  minStock: 30,  unit: 'litros',   lastRestocked: '29/03/2026' },
    { id: '8',  name: 'Lavandina',                 category: 'Limpieza',      quantity: 32,  minStock: 25,  unit: 'litros',   lastRestocked: '05/04/2026' },
    { id: '9',  name: 'Escobas',                   category: 'Limpieza',      quantity: 8,   minStock: 10,  unit: 'unidades', lastRestocked: '15/02/2026' },
    { id: '10', name: 'Bolsas de basura 100L',     category: 'Limpieza',      quantity: 145, minStock: 100, unit: 'unidades', lastRestocked: '03/04/2026' },
    { id: '11', name: 'Papel higiénico (comunes)', category: 'Limpieza',      quantity: 85,  minStock: 60,  unit: 'rollos',   lastRestocked: '07/04/2026' },
    { id: '12', name: 'Jabón líquido',             category: 'Limpieza',      quantity: 22,  minStock: 20,  unit: 'litros',   lastRestocked: '02/04/2026' },
    { id: '13', name: 'Fusibles 10A',              category: 'Eléctrico',     quantity: 24,  minStock: 30,  unit: 'unidades', lastRestocked: '10/03/2026' },
    { id: '14', name: 'Cables eléctricos',         category: 'Eléctrico',     quantity: 45,  minStock: 40,  unit: 'metros',   lastRestocked: '22/03/2026' },
  ]);

  return (
    <Inventory items={items} onUpdateQuantity={(itemId, change) =>
      setItems(items.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      ))} />
  );
}
