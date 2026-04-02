import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img src="/tienda-hero.jpg" alt="Interior Tienda Km0 Alcalá la Real" className="absolute inset-0 w-full h-full object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <img src="/logo-white.png" alt="Km0 Logo" className="h-24 sm:h-28 w-auto mx-auto" />
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6">
          Sabores de{' '}
          <span className="text-oliva-300 italic">nuestra tierra</span>
        </h1>

        <p className="text-lg sm:text-xl text-crema/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Aceite, quesos, embutidos, dulces y mucho más. Productos artesanales
          de Alcalá la Real elaborados con la tradición y el cariño de siempre.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/productos"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg font-medium text-lg transition-colors hover:shadow-lg no-underline"
          >
            Descubrir Productos
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            to="/sobre-nosotros"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-medium text-lg backdrop-blur-sm transition-all no-underline"
          >
            Nuestra Historia
          </Link>
        </div>
      </div>

    </section>
  );
}
