import { Routes, Route, useLocation } from 'react-router-dom';
import { useData } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import AdminLayout from './components/admin/AdminLayout';

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-crema">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-oliva-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-tierra-600 text-sm">Cargando...</p>
      </div>
    </div>
  );
}

function AppError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-crema px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🫒</p>
        <h2 className="font-serif text-2xl font-bold text-tierra-800 mb-2">No podemos cargar la tienda</h2>
        <p className="text-tierra-500 text-sm mb-6">Hay un problema de conexión. Comprueba tu internet e inténtalo de nuevo.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-oliva-500 hover:bg-oliva-600 text-white rounded-xl font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { loading, dbError } = useData();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (loading) return <AppLoader />;
  if (dbError) return <AppError />;

  return (
    <>
      <ScrollToTop />
      {isAdmin ? (
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout><DashboardPage /></AdminLayout>} />
          <Route path="/admin/productos" element={<AdminLayout><ProductsAdmin /></AdminLayout>} />
          <Route path="/admin/categorias" element={<AdminLayout><CategoriesAdmin /></AdminLayout>} />
          <Route path="/admin/configuracion" element={<AdminLayout><SettingsAdmin /></AdminLayout>} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/productos" element={<PublicLayout><ProductsPage /></PublicLayout>} />
          <Route path="/producto/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/sobre-nosotros" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contacto" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/privacidad" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          <Route path="/cookies" element={<PublicLayout><CookiesPage /></PublicLayout>} />
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
      )}
    </>
  );
}
