import {
  Building2, DollarSign, Wrench, Package, LayoutDashboard,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['Administrador General', 'Backoffice', 'Encargada de Edificio', 'Encargado de Edificio'],
  },
  {
    id: 'units',
    path: '/unidades',
    label: 'Unidades',
    icon: Building2,
    roles: ['Administrador General', 'Limpieza', 'Encargada de Edificio', 'Encargado de Edificio'],
  },
  {
    id: 'fees',
    path: '/cuotas',
    label: 'Cuotas/Expensas',
    icon: DollarSign,
    roles: ['Administrador General', 'Backoffice'],
  },
  {
    id: 'maintenance',
    path: '/reparaciones',
    label: 'Reparaciones',
    icon: Wrench,
    roles: ['Administrador General', 'Limpieza', 'Encargada de Edificio', 'Encargado de Edificio'],
  },
  {
    id: 'inventory',
    path: '/inventario',
    label: 'Inventario',
    icon: Package,
    roles: ['Administrador General', 'Limpieza', 'Encargada de Edificio', 'Encargado de Edificio'],
  },
];

export function getAllowedNavItems(cargo) {
  return NAV_ITEMS.filter(item => item.roles.includes(cargo));
}

export function getHomePath(cargo) {
  const first = getAllowedNavItems(cargo)[0];
  return first ? first.path : '/dashboard';
}