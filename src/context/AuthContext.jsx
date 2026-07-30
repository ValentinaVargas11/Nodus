import { createContext, useContext, useReducer, useEffect } from 'react';
import { setAccessToken, clearAccessToken } from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 'demo-1', email: 'admin@nodus.com',      nombre: 'Carlos',   apellido: 'Méndez',    cargo: 'Administrador General' },
  { id: 'demo-2', email: 'backoffice@nodus.com', nombre: 'Laura',    apellido: 'Fernández', cargo: 'Backoffice'            },
  { id: 'demo-3', email: 'limpieza@nodus.com',   nombre: 'Roberto',  apellido: 'Suárez',    cargo: 'Limpieza'              },
  { id: 'demo-4', email: 'encargado@nodus.com',  nombre: 'Patricia', apellido: 'Torres',    cargo: 'Encargada de Edificio' },
];

const initialState = {
  user: null,
  loading: true,
  error: null,
  isDemo: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null };
    case 'AUTH_LOGIN':
      return { user: action.payload, loading: false, error: null, isDemo: false };
    case 'AUTH_DEMO_LOGIN':
      return { user: action.payload, loading: false, error: null, isDemo: true };
    case 'AUTH_LOGOUT':
      return { user: null, loading: false, error: null, isDemo: false };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      dispatch({ type: 'AUTH_DEMO_LOGIN', payload: JSON.parse(demoUser) });
      return;
    }
    restaurarSesion();
  }, []);

  async function restaurarSesion() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      dispatch({ type: 'AUTH_LOGOUT' });
      return;
    }
    try {
      const tokens = await authService.refresh(refreshToken);
      setAccessToken(tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      const user = await authService.getMe();
      dispatch({ type: 'AUTH_LOGIN', payload: user });
    } catch {
      localStorage.removeItem('refreshToken');
      clearAccessToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }

  function loginDemo(email) {
    const user = DEMO_USERS.find(u => u.email === email);
    if (!user) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Usuario demo no encontrado' });
      return null;
    }
    localStorage.setItem('demoUser', JSON.stringify(user));
    dispatch({ type: 'AUTH_DEMO_LOGIN', payload: user });
    return user;
  }

  async function login(email, password) {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const res = await authService.login(email, password);
      setAccessToken(res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      dispatch({ type: 'AUTH_LOGIN', payload: res.user });
      return res.user;
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al iniciar sesión';
      dispatch({ type: 'AUTH_ERROR', payload: mensaje });
      throw err;
    }
  }

  async function logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // si el logout en backend falla, igual limpiamos local
    } finally {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('demoUser');
      clearAccessToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, login, loginDemo, logout, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
