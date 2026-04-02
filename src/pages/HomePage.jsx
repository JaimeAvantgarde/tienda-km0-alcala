import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  const { visibleProducts } = useData();
  const featured = visibleProducts.filter(p => p.featured);
  const rest = visibleProducts.filter(p => !p.featured);
  const featuredProducts = [...featured, ...rest].slice(0, 6);

  return (
    <>
      <Hero />

      {/* Productos destacados */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white paper-texture">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-tierra-800 mb-4">
              Productos Destacados
            </h2>
            <p className="text-tierra-500 text-lg max-w-2xl mx-auto">
              Una selección de los mejores productos de nuestra tierra
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 px-8 py-3 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg font-medium transition-colors no-underline"
            >
              Ver todos los productos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <CategoryGrid />

      {/* CTA section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-oliva-700 to-oliva-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            De nuestra tierra a tu mesa
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Cada producto cuenta una historia de tradición, pasión y amor por la tierra.
            Conoce a los productores que hacen posible lo mejor de Alcalá la Real.
          </p>
          <Link
            to="/sobre-nosotros"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-tierra-800 rounded-lg font-medium hover:bg-crema transition-colors no-underline"
          >
            Conoce nuestra historia
          </Link>
        </div>
      </section>

      {/* Contacto */}
      <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 bg-crema">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-tierra-800 mb-4">
            Contacto
          </h2>
          <p className="text-tierra-500 text-lg max-w-2xl mx-auto">
            ¿Tienes alguna consulta? Escríbenos y te responderemos lo antes posible
          </p>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
