import { useSEO } from '../hooks/useSEO';

export default function CookiesPage() {
  useSEO({
    title: 'Política de Cookies',
    description: 'Política de cookies de Tienda Km0 Alcalá la Real. Información sobre las cookies que usamos.',
    path: '/cookies',
  });

  return (
    <div className="min-h-screen bg-crema">
      <div className="bg-gradient-to-br from-oliva-700 to-oliva-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Política de Cookies</h1>
          <p className="text-white/70 mt-2 text-sm">Última actualización: abril 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-tierra-100 shadow-sm p-8 sm:p-10 space-y-8 text-tierra-700">

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Sirven para recordar preferencias, mejorar la experiencia de usuario y, en algunos casos, para analítica o publicidad.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">Cookies que usamos</h2>
            <p className="mb-4">Este sitio web utiliza únicamente cookies técnicas estrictamente necesarias para su funcionamiento:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-tierra-50">
                    <th className="text-left p-3 border border-tierra-100 font-semibold text-tierra-800">Nombre</th>
                    <th className="text-left p-3 border border-tierra-100 font-semibold text-tierra-800">Tipo</th>
                    <th className="text-left p-3 border border-tierra-100 font-semibold text-tierra-800">Finalidad</th>
                    <th className="text-left p-3 border border-tierra-100 font-semibold text-tierra-800">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-tierra-100 font-mono text-xs">km0_auth</td>
                    <td className="p-3 border border-tierra-100">Técnica</td>
                    <td className="p-3 border border-tierra-100">Mantener la sesión del panel de administración</td>
                    <td className="p-3 border border-tierra-100">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-tierra-500">No usamos cookies de analítica, publicidad ni rastreo de terceros.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">Cómo desactivar las cookies</h2>
            <p>Puedes configurar tu navegador para rechazar o eliminar cookies. Ten en cuenta que deshabilitar las cookies técnicas puede afectar al funcionamiento del sitio.</p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-sm">
              <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
              <li><strong>Firefox:</strong> Ajustes → Privacidad y seguridad → Cookies</li>
              <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
              <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">Cambios en esta política</h2>
            <p>Podemos actualizar esta política si añadimos nuevas funcionalidades que impliquen el uso de cookies adicionales. Publicaremos la versión actualizada en esta misma página.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
