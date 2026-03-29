import { useParams, Link, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, visibleProducts, getCategoryById, getImageById } = useData();

  const product = products.find(p => p.id === id);
  if (!product) return <Navigate to="/productos" replace />;

  const category = getCategoryById(product.categoryId);
  const productImages = (product.imageIds || []).map(getImageById).filter(Boolean);
  const relatedProducts = visibleProducts
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-crema">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-tierra-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-tierra-500">
            <Link to="/" className="hover:text-tierra-700 no-underline text-tierra-500">Inicio</Link>
            <span>/</span>
            <Link to="/productos" className="hover:text-tierra-700 no-underline text-tierra-500">Productos</Link>
            {category && (
              <>
                <span>/</span>
                <Link to={`/productos?categoria=${category.id}`} className="hover:text-tierra-700 no-underline text-tierra-500">
                  {category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-tierra-700 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden aspect-square">
              {productImages.length > 0 ? (
                <img src={productImages[0].data} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-tierra-100 flex items-center justify-center">
                  <svg className="w-24 h-24 text-tierra-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {productImages.map((img, i) => (
                  <div key={img.id} className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 border-tierra-200">
                    <img src={img.data} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {category && (
              <span className="inline-block bg-tierra-100 text-tierra-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                {category.name}
              </span>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-4">
              {product.name}
            </h1>

            <p className="text-tierra-600 text-lg leading-relaxed mb-8">
              {product.shortDescription}
            </p>

            {/* Description */}
            <div className="prose prose-tierra max-w-none mb-8">
              <h3 className="font-serif text-xl font-semibold text-tierra-800 mb-3">Sobre este producto</h3>
              {product.longDescription.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-tierra-600 leading-relaxed mb-4">{paragraph}</p>
              ))}
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl p-6 space-y-4 border border-tierra-100">
              {product.producer && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-oliva-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <dt className="text-sm font-medium text-tierra-500">Productor</dt>
                    <dd className="text-tierra-800">{product.producer}</dd>
                  </div>
                </div>
              )}
              {product.origin && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-oliva-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <dt className="text-sm font-medium text-tierra-500">Origen</dt>
                    <dd className="text-tierra-800">{product.origin}</dd>
                  </div>
                </div>
              )}
              {product.tradition && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-oliva-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <dt className="text-sm font-medium text-tierra-500">Tradición</dt>
                    <dd className="text-tierra-800 text-sm leading-relaxed">{product.tradition}</dd>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-tierra-800 mb-8">
              Otros productos que te pueden interesar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
