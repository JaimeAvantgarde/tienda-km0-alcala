import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function LoginPage() {
  const { isAuthenticated, login } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!login(email, password)) {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-oliva-700 to-oliva-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Km0 Logo" className="h-20 w-auto mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-tierra-800">Panel de Control</h1>
            <p className="text-tierra-500 text-sm mt-1">Tienda Km0 Alcalá la Real</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tierra-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terracota-400 focus:border-transparent"
                placeholder="admin@tiendakm0.es"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-tierra-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terracota-400 focus:border-transparent"
                placeholder="Tu contraseña"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg font-medium transition-colors"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Credenciales por defecto: admin@tiendakm0.es / km0alcala2024
          </p>
        </div>
      </div>
    </div>
  );
}
