import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { LOGO_FULL } from '../logos';

const MOCK_USERS = [
  { id: 1, email: 'admin@nodus.com',      password: '123456', nombre: 'Carlos',   apellido: 'Méndez',    cargo: 'Administrador General' },
  { id: 2, email: 'backoffice@nodus.com', password: '123456', nombre: 'Laura',    apellido: 'Fernández', cargo: 'Backoffice'            },
  { id: 3, email: 'limpieza@nodus.com',   password: '123456', nombre: 'Roberto',  apellido: 'Suárez',    cargo: 'Limpieza'              },
  { id: 4, email: 'encargado@nodus.com',  password: '123456', nombre: 'Patricia', apellido: 'Torres',    cargo: 'Encargada de Edificio' },
];

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u => u.email === email.trim().toLowerCase() && u.password === password
      );
      if (user) { onLogin(user); }
      else { setError('Email o contraseña incorrectos.'); setLoading(false); }
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #080e1a 0%, #0f1c35 50%, #0d1a30 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(75,82,99,0.20) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(75,82,99,0.12) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>

        {/* Logo — directo sobre el fondo oscuro del login, mix-blend-mode elimina el negro */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img
            src={LOGO_FULL}
            alt="Nodus"
            style={{
              width: 520,
              maxWidth: '100%',
              display: 'block',
              margin: '0 auto',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff', borderRadius: 20,
          padding: '32px 32px 28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.15)',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1829', marginBottom: 6, letterSpacing: '-0.3px' }}>
            Iniciar sesión
          </h2>
          <p style={{ fontSize: 13.5, color: '#4b5a72', marginBottom: 24 }}>
            Ingresá con tu cuenta de Nodus
          </p>

          {/* Demo hint */}
          <div style={{
            background: '#f0f1f4', border: '1px solid #d1d4db',
            borderRadius: 8, padding: '10px 13px', marginBottom: 20,
            fontSize: 12.5, color: '#3a404f', lineHeight: 1.5,
          }}>
            <strong>Demo:</strong> usá cualquier email de la lista con contraseña{' '}
            <code style={{ fontFamily: 'monospace', background: '#e4e6ea', padding: '1px 5px', borderRadius: 4 }}>
              123456
            </code>
            <br />
            <span style={{ opacity: 0.75 }}>
              admin@nodus.com · backoffice@nodus.com · limpieza@nodus.com
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#4b5a72', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                style={{
                  width: '100%', padding: '9px 13px', border: '1.5px solid #E2E8F0',
                  borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0d1829',
                  outline: 'none', background: '#fff', boxSizing: 'border-box',
                  transition: 'border-color 140ms ease, box-shadow 140ms ease',
                }}
                onFocus={e => { e.target.style.borderColor = '#4B5263'; e.target.style.boxShadow = '0 0 0 3px rgba(75,82,99,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#4b5a72', marginBottom: 6 }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '9px 40px 9px 13px', border: '1.5px solid #E2E8F0',
                    borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0d1829',
                    outline: 'none', background: '#fff', boxSizing: 'border-box',
                    transition: 'border-color 140ms ease, box-shadow 140ms ease',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#4B5263'; e.target.style.boxShadow = '0 0 0 3px rgba(75,82,99,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#8a98ae', cursor: 'pointer',
                  padding: 4, display: 'flex', alignItems: 'center',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FEE2E2', border: '1px solid #FCA5A5',
                borderRadius: 8, padding: '10px 13px', marginBottom: 16,
                fontSize: 13.5, color: '#B91C1C',
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '10px 16px',
              background: loading ? '#9aa0b2' : '#4B5263',
              color: 'white', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 140ms ease',
              boxShadow: loading ? 'none' : '0 2px 8px rgba(75,82,99,0.35)',
              letterSpacing: '-0.1px',
            }}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          © 2026 Nodus · Sistema de gestión
        </p>
      </div>
    </div>
  );
}
