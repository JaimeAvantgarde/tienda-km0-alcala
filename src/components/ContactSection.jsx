import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function ContactSection() {
  const { siteConfig } = useData();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d800!2d${siteConfig.mapLng}!3d${siteConfig.mapLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6def2ae5ace3ab%3A0x18ff0799d200f9!2sTienda%20Km0%20Alcal%C3%A1%20la%20Real!5e0!3m2!1ses!2ses!4v1`;

  return (
    <section id="contacto" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-crema">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-tierra-100 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-tierra-800 mb-6">
              Envíanos un mensaje
            </h3>

            {sent && (
              <div className="mb-6 p-4 bg-oliva-50 border border-oliva-200 rounded-lg text-oliva-700 text-sm">
                ¡Mensaje enviado correctamente! Te responderemos pronto.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tierra-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-tierra-200 bg-crema text-tierra-800 placeholder:text-tierra-400 focus:outline-none focus:ring-2 focus:ring-terracota-400 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tierra-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-tierra-200 bg-crema text-tierra-800 placeholder:text-tierra-400 focus:outline-none focus:ring-2 focus:ring-terracota-400 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tierra-700 mb-1">Asunto</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-tierra-200 bg-crema text-tierra-800 placeholder:text-tierra-400 focus:outline-none focus:ring-2 focus:ring-terracota-400 focus:border-transparent"
                  placeholder="Asunto de tu consulta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tierra-700 mb-1">Mensaje</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-tierra-200 bg-crema text-tierra-800 placeholder:text-tierra-400 focus:outline-none focus:ring-2 focus:ring-terracota-400 focus:border-transparent resize-none"
                  placeholder="Escribe tu mensaje..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg font-medium transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Map & info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-tierra-100 shadow-sm h-[300px] sm:h-[350px]">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Tienda Km0"
              />
            </div>

            {/* Info card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-tierra-100 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-tierra-800 mb-4">Información de contacto</h3>
              <div className="space-y-4">
                {siteConfig.address && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-oliva-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <dt className="text-sm font-medium text-tierra-500">Dirección</dt>
                      <dd className="text-tierra-800">{siteConfig.address}</dd>
                    </div>
                  </div>
                )}
                {siteConfig.phone && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-oliva-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <dt className="text-sm font-medium text-tierra-500">Teléfono</dt>
                      <dd className="text-tierra-800">{siteConfig.phone}</dd>
                    </div>
                  </div>
                )}
                {siteConfig.email && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-oliva-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <dt className="text-sm font-medium text-tierra-500">Email</dt>
                      <dd className="text-tierra-800">{siteConfig.email}</dd>
                    </div>
                  </div>
                )}
                {siteConfig.schedule && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-oliva-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <dt className="text-sm font-medium text-tierra-500">Horario</dt>
                      <dd className="text-tierra-800 whitespace-pre-line">{siteConfig.schedule}</dd>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
