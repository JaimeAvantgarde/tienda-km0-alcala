import { useSEO } from '../hooks/useSEO';

export default function PrivacyPage() {
  useSEO({
    title: 'Política de Privacidad',
    description: 'Política de privacidad de Tienda Km0 Alcalá la Real. Información sobre el tratamiento de datos personales.',
    path: '/privacidad',
  });

  return (
    <div className="min-h-screen bg-crema">
      <div className="bg-gradient-to-br from-oliva-700 to-oliva-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Política de Privacidad</h1>
          <p className="text-white/70 mt-2 text-sm">Última actualización: abril 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-tierra">
        <div className="bg-white rounded-2xl border border-tierra-100 shadow-sm p-8 sm:p-10 space-y-8 text-tierra-700">

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">1. Responsable del tratamiento</h2>
            <p>El responsable del tratamiento de los datos personales recabados a través de este sitio web es <strong>Tienda Km0 Alcalá la Real</strong>, con domicilio en Alcalá la Real (Jaén).</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">2. Datos que recabamos</h2>
            <p>Únicamente recabamos los datos que tú mismo nos facilitas a través del formulario de contacto:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Nombre</li>
              <li>Dirección de correo electrónico</li>
              <li>Mensaje</li>
            </ul>
            <p className="mt-3">No recabamos datos de navegación ni usamos herramientas de análisis de terceros en este momento.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">3. Finalidad del tratamiento</h2>
            <p>Los datos facilitados a través del formulario de contacto se utilizan exclusivamente para responder a tu consulta. No los utilizamos para envíos comerciales sin tu consentimiento previo.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">4. Base legal</h2>
            <p>El tratamiento se basa en el consentimiento que otorgas al enviarnos el formulario de contacto (art. 6.1.a RGPD).</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">5. Conservación de los datos</h2>
            <p>Conservamos los datos el tiempo necesario para atender tu consulta y, posteriormente, durante el plazo legalmente exigible.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">6. Tus derechos</h2>
            <p>Tienes derecho a acceder, rectificar, suprimir, limitar y oponerte al tratamiento de tus datos, así como a la portabilidad. Para ejercerlos, contacta con nosotros en la dirección de correo disponible en la sección de contacto.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">7. Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas para proteger tus datos frente a accesos no autorizados, pérdida o destrucción.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-tierra-800 mb-3">8. Cambios en esta política</h2>
            <p>Podemos actualizar esta política ocasionalmente. Te informaremos de cambios relevantes publicando la nueva versión en esta misma página.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
