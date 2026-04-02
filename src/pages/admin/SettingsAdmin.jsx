import { useState } from 'react';
import { useData } from '../../context/DataContext';

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function SettingsAdmin() {
  const { siteConfig, updateSiteConfig } = useData();
  const [form, setForm] = useState({ ...siteConfig });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSiteConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSave}>
        <Section title="Información del Negocio">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre corto</label>
                <input
                  value={form.siteName}
                  onChange={e => setForm({ ...form, siteName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje del banner superior</label>
              <input
                value={form.bannerMessage}
                onChange={e => setForm({ ...form, bannerMessage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                placeholder="Déjalo vacío para ocultarlo"
              />
            </div>
          </div>
        </Section>

        <Section title="Contacto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                  placeholder="953 XX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                  placeholder="info@tiendakm0.es"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (con prefijo de país)</label>
              <input
                value={form.whatsapp}
                onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                placeholder="34600123456"
              />
              <p className="text-xs text-gray-400 mt-1">Al rellenar este campo aparecerá un botón flotante de WhatsApp en toda la web</p>
            </div>
          </div>
        </Section>

        <Section title="Ubicación">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={form.mapLat}
                  onChange={e => setForm({ ...form, mapLat: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={form.mapLng}
                  onChange={e => setForm({ ...form, mapLng: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Redes Sociales">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (URL completa)</label>
              <input
                value={form.instagram}
                onChange={e => setForm({ ...form, instagram: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                placeholder="https://instagram.com/tiendakm0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook (URL completa)</label>
              <input
                value={form.facebook}
                onChange={e => setForm({ ...form, facebook: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
                placeholder="https://facebook.com/tiendakm0"
              />
            </div>
          </div>
        </Section>

        <Section title="Horario">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horario de apertura</label>
            <textarea
              rows={3}
              value={form.schedule}
              onChange={e => setForm({ ...form, schedule: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400 resize-none"
              placeholder="Lunes a Viernes: 9:00 - 14:00..."
            />
          </div>
        </Section>

        <Section title="Sobre Nosotros">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título de la sección</label>
              <input
                value={form.aboutTitle}
                onChange={e => setForm({ ...form, aboutTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto (doble salto de línea para párrafos)</label>
              <textarea
                rows={8}
                value={form.aboutText}
                onChange={e => setForm({ ...form, aboutText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400 resize-none"
              />
            </div>
          </div>
        </Section>

        <Section title="Acceso al Panel">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de administrador</label>
              <input
                type="email"
                value={form.adminEmail}
                onChange={e => setForm({ ...form, adminEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="text"
                value={form.adminPassword}
                onChange={e => setForm({ ...form, adminPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
              />
            </div>
          </div>
        </Section>

        <div className="sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 flex items-center gap-4">
          <button type="submit" className="px-8 py-3 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg font-medium transition-colors">
            Guardar configuración
          </button>
          {saved && (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-oliva-600 animate-[fadeIn_0.3s_ease-in]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Cambios guardados
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
