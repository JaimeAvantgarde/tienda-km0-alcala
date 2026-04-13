import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl mb-6">🫒</p>
        <h1 className="font-serif text-4xl font-bold text-tierra-800 mb-3">Página no encontrada</h1>
        <p className="text-tierra-500 mb-8">
          Parece que esta página se ha perdido por los olivares. Vuelve al inicio para encontrar los mejores productos de Alcalá la Real.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-oliva-500 hover:bg-oliva-600 text-white rounded-xl font-medium transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            to="/productos"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-tierra-700 border border-gray-200 rounded-xl font-medium transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}
