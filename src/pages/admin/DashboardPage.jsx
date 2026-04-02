import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function DashboardPage() {
  const { products, categories } = useData();

  const visibleCount = products.filter(p => p.visible).length;
  const featuredCount = products.filter(p => p.featured).length;

  return (
    <div className="space-y-6">
      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/productos" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow no-underline flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-oliva-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-oliva-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{products.length}</div>
            <div className="text-sm text-gray-500">Productos</div>
          </div>
        </Link>
        <Link to="/admin/categorias" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow no-underline flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-oliva-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-oliva-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{categories.length}</div>
            <div className="text-sm text-gray-500">Categorías</div>
          </div>
        </Link>
        <Link to="/admin/configuracion" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow no-underline flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-oliva-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-oliva-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">Configuración</div>
            <div className="text-xs text-gray-500">Contacto, redes, horario</div>
          </div>
        </Link>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Productos visibles</div>
          <div className="text-2xl font-bold text-gray-800">{visibleCount} <span className="text-sm font-normal text-gray-400">/ {products.length}</span></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Productos destacados</div>
          <div className="text-2xl font-bold text-gray-800">{featuredCount}</div>
        </div>
      </div>

      {/* Productos recientes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Últimos productos</h2>
          <Link to="/admin/productos" className="text-sm text-oliva-600 hover:text-oliva-700 no-underline">Ver todos</Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Categoría</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Precio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.slice(0, 5).map(product => {
                const cat = categories.find(c => c.id === product.categoryId);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{cat?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 hidden sm:table-cell">{product.price != null ? `${product.price.toFixed(2)}€` : '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        product.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.visible ? 'Visible' : 'Borrador'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
