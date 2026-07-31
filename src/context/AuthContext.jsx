import { createContext, useContext, useReducer, useEffect } from 'react';
import { setAccessToken, clearAccessToken } from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null };
    case 'AUTH_LOGIN':
      return { user: action.payload, loading: false, error: null };
    case 'AUTH_LOGOUT':
      return { user: null, loading: false, error: null };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
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
      return null;
    }
  }

  async function logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
    } finally {
      localStorage.removeItem('refreshToken');
      clearAccessToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
