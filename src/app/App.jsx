import { useState, useEffect } from 'react';
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
import * as roomService from '../services/roomService';
import * as feeService from '../services/feeService';
import * as taskService from '../services/taskService';
import * as inventoryService from '../services/inventoryService';
import toast from 'react-hot-toast';

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

function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchFn().then(res => {
      if (mounted) { setData(res); setLoading(false); }
    }).catch(err => {
      if (mounted) { setError(err); setLoading(false); }
    });
    return () => { mounted = false; };
  }, deps);

  return { data, loading, error, setData };
}

function DashboardSection() {
  const { data: roomData, loading: roomLoading } = useFetch(() => roomService.obtenerStats());
  const { data: feeData, loading: feeLoading } = useFetch(() => feeService.obtenerResumen());

  if (roomLoading || feeLoading || !roomData) return <div className="page-content"><div className="spinner" style={{ margin: '60px auto' }} /></div>;

  const stats = {
    ...roomData,
    totalFees: feeData?.totalFees || 0,
    paidFees: feeData?.paid?.count || 0,
    pendingFees: feeData?.pending?.count || 0,
    overdueFees: feeData?.overdue?.count || 0,
  };

  return <Dashboard stats={stats} />;
}

function RoomsSection() {
  const { data: rooms, loading, setData: setRooms } = useFetch(() =>
    roomService.listar().then(res => res.data)
  );
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const updated = await roomService.cambiarEstado(roomId, newStatus);
      setRooms(rooms.map(r => r.id === roomId ? updated : r));
      setSelectedRoom(updated);
      toast.success('Estado actualizado');
    } catch { toast.error('Error al actualizar estado'); }
  };

  const handleUpdateRoom = async (roomId, updates) => {
    try {
      const updated = await roomService.actualizar(roomId, updates);
      setRooms(rooms.map(r => r.id === roomId ? updated : r));
      setSelectedRoom(updated);
      toast.success('Unidad actualizada');
    } catch { toast.error('Error al actualizar la unidad'); }
  };

  if (loading || !rooms) return <div className="page-content"><div className="spinner" style={{ margin: '60px auto' }} /></div>;

  return (
    <>
      <RoomGrid rooms={rooms} onRoomClick={setSelectedRoom} />
      <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)}
        onChangeStatus={handleStatusChange} onUpdateRoom={handleUpdateRoom} />
    </>
  );
}

function FeesSection() {
  const { data: fees, loading, setData: setFees } = useFetch(() =>
    feeService.listar().then(res => res.data)
  );
  const { data: rooms, loading: roomsLoading } = useFetch(() =>
    roomService.listar().then(res => res.data)
  );

  const handleUpdateStatus = async (id, status) => {
    try {
      const updated = await feeService.cambiarEstado(id, status);
      setFees(fees.map(f => f.id === id ? updated : f));
      toast.success('Cuota actualizada');
    } catch { toast.error('Error al actualizar cuota'); }
  };

  const handleCrear = async (newFee) => {
    try {
      const created = await feeService.crear(newFee);
      const room = rooms?.find(r => r.number === newFee.unitNumber);
      const hydrated = {
        ...created,
        email: created.email || room?.email || '',
        phone: created.phone || room?.phone || '',
      };
      setFees([hydrated, ...fees]);
      toast.success('Cuota creada');
    } catch { toast.error('Error al crear cuota'); }
  };

  const handleGenerar = async (month, dueDate) => {
    try {
      const generated = await feeService.generar(month, dueDate);
      setFees([...fees, ...generated]);
      toast.success(`Generadas ${generated.length} cuotas`);
    } catch { toast.error('Error al generar cuotas'); }
  };

  const handleUpdate = async (feeId, updates) => {
    try {
      const updated = await feeService.actualizar(feeId, updates);
      setFees(fees.map(f => f.id === feeId ? updated : f));
      toast.success('Cuota actualizada');
    } catch { toast.error('Error al actualizar cuota'); }
  };

  const handleUpdateDetalles = async (feeId, updates) => {
    try {
      const updated = await feeService.actualizarDetalles(feeId, updates);
      setFees(fees.map(f => f.id === feeId ? updated : f));
      toast.success('Cuota actualizada');
    } catch { toast.error('Error al actualizar cuota'); }
  };

  const handleEliminar = async (feeId) => {
    if (!window.confirm('¿Eliminar esta cuota?')) return;
    try {
      await feeService.eliminar(feeId);
      setFees(fees.filter(f => f.id !== feeId));
      toast.success('Cuota eliminada');
    } catch { toast.error('Error al eliminar cuota'); }
  };

  if (loading || !fees || roomsLoading || !rooms) return <div className="page-content"><div className="spinner" style={{ margin: '60px auto' }} /></div>;

  return <MonthlyFees fees={fees} rooms={rooms}
    onUpdateStatus={handleUpdateStatus}
    onUpdate={handleUpdate}
    onUpdateDetalles={handleUpdateDetalles}
    onDelete={handleEliminar}
    onGenerar={handleGenerar}
    onCrear={handleCrear} />;
}

function TasksSection() {
  const { data: tasks, loading, setData: setTasks } = useFetch(() =>
    taskService.listar().then(res => res.data)
  );

  const handleUpdate = async (taskId, updates) => {
    try {
      await taskService.actualizar(taskId, updates);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
    } catch { toast.error('Error al actualizar tarea'); }
  };

  const handleAdd = async (newTask) => {
    try {
      const created = await taskService.crear(newTask);
      setTasks([created, ...tasks]);
      toast.success('Tarea creada');
    } catch { toast.error('Error al crear tarea'); }
  };

  if (loading || !tasks) return <div className="page-content"><div className="spinner" style={{ margin: '60px auto' }} /></div>;

  return <MaintenanceTasks tasks={tasks} onUpdateTask={handleUpdate} onAddTask={handleAdd} />;
}

function InventorySection() {
  const { data: items, loading, setData: setItems } = useFetch(() =>
    inventoryService.listar().then(res => res.data)
  );

  const handleUpdateQuantity = async (itemId, change) => {
    try {
      const updated = await inventoryService.ajustarStock(itemId, change);
      setItems(items.map(item => item.id === itemId ? updated : item));
    } catch { toast.error('Error al ajustar stock'); }
  };

  if (loading || !items) return <div className="page-content"><div className="spinner" style={{ margin: '60px auto' }} /></div>;

  return <Inventory items={items} onUpdateQuantity={handleUpdateQuantity} />;
}
