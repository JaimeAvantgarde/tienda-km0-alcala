import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function ProductCard({ product }) {
  const { getCategoryById, getImageById } = useData();
  const category = getCategoryById(product.categoryId);
  const mainImage = product.imageIds?.[0] ? getImageById(product.imageIds[0]) : null;

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 no-underline block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {mainImage ? (
          <img
            src={mainImage.data}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-tierra-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-tierra-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 bg-oliva-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            {category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-tierra-800 mb-2 group-hover:text-oliva-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-tierra-500 text-sm leading-relaxed line-clamp-2 mb-3">
          {product.shortDescription}
        </p>
        {product.price != null && (
          <p className="text-lg font-medium text-tierra-800">{product.price.toFixed(2)}<span className="text-sm ml-0.5">&euro;</span></p>
        )}
      </div>
    </Link>
  );
}
