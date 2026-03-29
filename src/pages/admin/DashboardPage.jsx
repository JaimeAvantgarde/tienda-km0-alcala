import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function DashboardPage() {
  const { products, categories, images } = useData();

  const stats = [
    { label: 'Productos', value: products.length, icon: '📦', color: 'bg-oliva-50 text-oliva-700 border-oliva-200' },
    { label: 'Categorías', value: categories.length, icon: '🏷️', color: 'bg-tierra-50 text-tierra-700 border-tierra-200' },
    { label: 'Imágenes', value: images.length, icon: '🖼️', color: 'bg-terracota-50 text-terracota-700 border-terracota-200' },
    { label: 'Visibles', value: products.filter(p => p.visible).length, icon: '👁️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ];

  const quickActions = [
    { label: 'Añadir Producto', to: '/admin/productos', icon: '➕' },
    { label: 'Añadir Categoría', to: '/admin/categorias', icon: '🏷️' },
    { label: 'Subir Imágenes', to: '/admin/imagenes', icon: '📸' },
    { label: 'Editar Contacto', to: '/admin/configuracion', icon: '⚙️' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className={`rounded-xl border p-5 ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-70 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Acciones rápidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <Link
              key={action.label}
              to={action.to}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline text-center"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium text-gray-700">{action.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent products */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Productos recientes</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Categoría</th>
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
