export default function AboutPage() {
  return (
    <div className="min-h-screen bg-crema">
      {/* Hero */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src="/mota-noche.jpg"
          alt="Alcalá la Real de noche"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
            Nuestra Tienda
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl">
            Productos locales, economía cercana y el sabor auténtico de Alcalá la Real
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Sección 1: Quiénes somos */}
        <section className="py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-6">
                Nuestra tienda Km0
              </h2>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Nuestra tienda nace con la ilusión de dar visibilidad a los productos locales
                y al trabajo de los pequeños productores de Alcalá la Real y su entorno.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Creemos en el comercio cercano, en la calidad frente a la cantidad y en el
                valor de lo auténtico.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed">
                Aquí encontrarás alimentos tradicionales, productos artesanos y souvenirs
                que representan nuestra cultura y nuestra tierra.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/panoramica.jpg"
                alt="Vista panorámica de Alcalá la Real"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Sección 2: Nuestro compromiso */}
        <section className="py-16 sm:py-24 border-t border-tierra-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="lg:order-2">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-6">
                Nuestro compromiso
              </h2>
              <ul className="space-y-4">
                {[
                  'Apostamos por el producto Km0',
                  'Apoyamos la economía local',
                  'Fomentamos el consumo responsable',
                  'Seleccionamos productos de calidad',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-oliva-100 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-oliva-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-tierra-600 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-tierra-500 text-base italic mt-6 border-l-4 border-oliva-300 pl-4">
                Cada artículo tiene una historia detrás, y queremos que forme parte de la tuya.
              </p>
            </div>
            <div className="lg:order-1 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/olivares.jpg"
                alt="Olivares de la Sierra Sur de Jaén"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Sección 3: Qué encontrarás */}
        <section className="py-16 sm:py-24 border-t border-tierra-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-6">
                Qué encontrarás en nuestra tienda
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '🫒', text: 'Aceite de oliva virgen extra' },
                  { icon: '🍪', text: 'Dulces tradicionales' },
                  { icon: '🥇', text: 'Productos gourmet locales' },
                  { icon: '🫙', text: 'Conservas y especialidades' },
                  { icon: '🎁', text: 'Cestas y packs regalo' },
                  { icon: '🏰', text: 'Souvenirs de Alcalá la Real' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-tierra-100 shadow-sm">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-tierra-700 font-medium text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/aceite.jpg"
                alt="Productos artesanales de la tienda"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Sección 4: Dónde estamos */}
        <section className="py-16 sm:py-24 border-t border-tierra-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="lg:order-2">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-6">
                Dónde estamos
              </h2>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Nuestra tienda física se encuentra en Alcalá la Real, donde te atenderemos
                de forma cercana y personalizada.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed">
                Si no puedes visitarnos, también puedes contactar con nosotros por teléfono
                o WhatsApp.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-oliva-500 hover:bg-oliva-600 text-white rounded-xl font-medium transition-colors"
                >
                  Contactar
                </a>
                <a
                  href="/productos"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-tierra-700 border border-tierra-200 rounded-xl font-medium transition-colors"
                >
                  Ver productos
                </a>
              </div>
            </div>
            <div className="lg:order-1 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/mota-fortaleza.jpg"
                alt="Fortaleza de la Mota, Alcalá la Real"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Imagen final con cita */}
        <section className="pb-16 sm:pb-24">
          <div className="rounded-2xl overflow-hidden shadow-lg relative">
            <img
              src="/mota-iglesia.jpg"
              alt="Fortaleza de la Mota con la Iglesia Mayor Abacial"
              className="w-full object-cover aspect-[21/9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white max-w-2xl">
                &ldquo;Lo bueno está cerca. Solo hay que saber dónde buscarlo.&rdquo;
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
