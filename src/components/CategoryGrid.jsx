import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function CategoryGrid() {
  const { categories, getImageById } = useData();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-tierra-800 mb-4">
          Nuestras Categorías
        </h2>
        <p className="text-tierra-500 text-lg max-w-2xl mx-auto">
          Descubre la variedad de productos artesanales que ofrece nuestra tierra
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const image = cat.imageId ? getImageById(cat.imageId) : null;

          return (
            <Link
              key={cat.id}
              to={`/productos?categoria=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] no-underline"
            >
              {/* Background */}
              {image ? (
                <img src={image.data} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 bg-tierra-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-tierra-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/70 transition-all duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                  {cat.name}
                </h3>
                <p className="text-white/70 text-sm line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
