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
      await roomService.cambiarEstado(roomId, newStatus);
      setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
      setSelectedRoom(null);
      toast.success('Estado actualizado');
    } catch { toast.error('Error al actualizar estado'); }
  };

  if (loading || !rooms) return <div className="page-content"><div className="spinner" style={{ margin: '60px auto' }} /></div>;

  return (
    <>
      <RoomGrid rooms={rooms} onRoomClick={setSelectedRoom} />
      <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} onChangeStatus={handleStatusChange} />
    </>
  );
}

function FeesSection() {
  const { data: fees, loading, setData: setFees } = useFetch(() =>
    feeService.listar().then(res => res.data)
  );

  const handleUpdateStatus = async (id, status) => {
    try {
      await feeService.cambiarEstado(id, status);
      setFees(fees.map(f => f.id === id
        ? { ...f, status, paidDate: status === 'paid' ? new Date().toLocaleDateString('es-AR') : undefined }
        : f
      ));
      toast.success('Cuota actualizada');
    } catch { toast.error('Error al actualizar cuota'); }
  };

  if (loading || !fees) return <div className="page-content"><div className="spinner" style={{ margin: '60px auto' }} /></div>;

  return <MonthlyFees fees={fees} onUpdateStatus={handleUpdateStatus} />;
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
