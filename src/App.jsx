import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import ImagesAdmin from './pages/admin/ImagesAdmin';
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

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {isAdmin ? (
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout><DashboardPage /></AdminLayout>} />
          <Route path="/admin/productos" element={<AdminLayout><ProductsAdmin /></AdminLayout>} />
          <Route path="/admin/categorias" element={<AdminLayout><CategoriesAdmin /></AdminLayout>} />
          <Route path="/admin/imagenes" element={<AdminLayout><ImagesAdmin /></AdminLayout>} />
          <Route path="/admin/configuracion" element={<AdminLayout><SettingsAdmin /></AdminLayout>} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/productos" element={<PublicLayout><ProductsPage /></PublicLayout>} />
          <Route path="/producto/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/sobre-nosotros" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contacto" element={<PublicLayout><ContactPage /></PublicLayout>} />
        </Routes>
      )}
    </>
  );
}
