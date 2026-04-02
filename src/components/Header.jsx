import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-oliva-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center no-underline shrink-0">
            <img src="/logo.png" alt="Km0 Productos de la Tierra" className="h-16 sm:h-20 w-auto" />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors no-underline ${
                  location.pathname === link.to
                    ? 'bg-oliva-50 text-oliva-700'
                    : 'text-tierra-600 hover:bg-gray-50 hover:text-tierra-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-tierra-700"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 pb-4 space-y-1 border-t border-gray-100">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors no-underline ${
                location.pathname === link.to
                  ? 'bg-oliva-50 text-oliva-700'
                  : 'text-tierra-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
