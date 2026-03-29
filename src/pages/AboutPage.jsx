export default function AboutPage() {
  return (
    <div className="min-h-screen bg-crema">
      {/* Hero con imagen de La Mota */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src="/mota-noche.jpg"
          alt="Fortaleza de la Mota iluminada de noche, Alcalá la Real"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
            Sobre Nosotros
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl">
            La historia de Alcalá la Real vive en cada producto que ofrecemos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Sección 1: Quiénes somos */}
        <section className="py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-6">
                Kilómetro Cero: lo bueno está cerca
              </h2>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Tienda Km0 nace con una idea sencilla pero poderosa: que los mejores productos de nuestra tierra
                lleguen directamente a tu mesa, sin intermediarios, sin largos viajes, sin perder ni un
                gramo de frescura ni de autenticidad.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Aquí reunimos lo mejor de Alcalá la Real y su comarca: aceites de oliva virgen extra que son
                puro oro líquido, quesos artesanales de cabra payoya, embutidos curados en la sierra,
                dulces con recetas centenarias y conservas que guardan el sabor de cada estación.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed">
                Cada producto que encontrarás tiene nombre y apellidos. Conocemos a cada productor, cada finca,
                cada obrador. Porque creemos que apoyar lo local es apostar por nuestra tierra y nuestra gente.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/panoramica.jpg"
                alt="Vista panorámica de Alcalá la Real con la Fortaleza de la Mota al fondo"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Sección 2: Alcalá la Real (zigzag inverso) */}
        <section className="py-16 sm:py-24 border-t border-tierra-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="lg:order-2">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-6">
                Alcalá la Real: cruce de culturas
              </h2>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Enclavada en la Sierra Sur de Jaén, a más de 900 metros de altitud, Alcalá la Real es
                un pueblo con más de 2.000 años de historia. Su posición estratégica entre las antiguas
                fronteras de Castilla y el Reino Nazarí de Granada la convirtió en una plaza fundamental
                durante la Reconquista.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                La imponente Fortaleza de la Mota, declarada Monumento Nacional, corona la ciudad y es
                testigo silencioso de romanos, visigodos, árabes y cristianos que dejaron su huella en
                estas tierras. La Iglesia Mayor Abacial, dentro del recinto amurallado, es uno de los
                templos más impresionantes de Andalucía.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed">
                Ese cruce de culturas no solo se refleja en la piedra, sino también en la mesa: nuestros
                pestiños tienen raíces árabes, nuestro aceite recoge la tradición romana, y nuestros
                quesos curados hablan de siglos de pastoreo en la sierra.
              </p>
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

        {/* Sección 3: El aceite y los olivares */}
        <section className="py-16 sm:py-24 border-t border-tierra-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-6">
                Tierra de olivares centenarios
              </h2>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Jaén es la provincia que más aceite de oliva produce en el mundo. Y Alcalá la Real,
                en el corazón de la Sierra Sur, cuenta con algunos de los olivares más antiguos y
                mejor cuidados de toda la comarca.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                La variedad Picual, reina indiscutible de estas tierras, produce un aceite de oliva
                virgen extra de sabor intenso, con notas de hierba fresca, tomate y almendra. Su alto
                contenido en polifenoles y ácido oleico lo convierte en uno de los aceites más
                saludables y estables del mundo.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed">
                Pero más allá del aceite, nuestros olivares son paisaje, identidad y forma de vida.
                Son los mismos campos que pintó Antonio Machado en sus versos y los mismos que siguen
                alimentando a familias enteras generación tras generación.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/olivares.jpg"
                alt="Campos de olivos en la Sierra Sur de Jaén"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Sección 4: Nuestros productores */}
        <section className="py-16 sm:py-24 border-t border-tierra-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="lg:order-2">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-tierra-800 mb-6">
                Nuestros productores, nuestra familia
              </h2>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Detrás de cada producto hay una persona, una familia, una historia. Trabajamos
                directamente con productores locales que comparten nuestra filosofía: calidad
                sin atajos, respeto por la tradición y amor por la tierra.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed mb-4">
                Desde la cooperativa que prensa el aceite con el mismo cuidado que hace tres
                generaciones, hasta la abuela que sigue haciendo roscos con la receta de su madre;
                desde el pastor que cuida sus cabras en la sierra, hasta el bodeguero que elabora
                su vino con uvas de cepas centenarias.
              </p>
              <p className="text-tierra-600 text-lg leading-relaxed">
                En Tienda Km0 no vendemos productos anónimos. Aquí cada etiqueta tiene cara,
                cada sabor tiene nombre, y cada compra es un gesto de apoyo a la economía local
                y al futuro de nuestro pueblo.
              </p>
            </div>
            <div className="lg:order-1 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/aceite.jpg"
                alt="Aceite de oliva virgen extra artesanal"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Datos destacados */}
        <section className="py-16 sm:py-24 border-t border-tierra-100">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-tierra-100 shadow-sm">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-tierra-800 text-center mb-10">
              Alcalá la Real en datos
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: '+2.000', label: 'años de historia', sub: 'Desde la época íbera y romana' },
                { value: '22.000', label: 'habitantes', sub: 'Comarca Sierra Sur de Jaén' },
                { value: '920m', label: 'de altitud', sub: 'Olivares entre cielo y tierra' },
                { value: 'Km 0', label: 'filosofía', sub: 'Del productor a tu mesa' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-oliva-600">{stat.value}</div>
                  <div className="text-tierra-700 font-medium mt-1">{stat.label}</div>
                  <div className="text-tierra-400 text-sm mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Imagen grande de La Mota con iglesia */}
        <section className="pb-16 sm:pb-24">
          <div className="rounded-2xl overflow-hidden shadow-lg relative">
            <img
              src="/mota-iglesia.jpg"
              alt="Fortaleza de la Mota con la Iglesia Mayor Abacial, Alcalá la Real"
              className="w-full object-cover aspect-[21/9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white max-w-2xl">
                &ldquo;Lo bueno está cerca. Solo hay que saber dónde buscarlo.&rdquo;
              </p>
            </div>
          </div>
          <p className="text-xs text-tierra-400 mt-3 text-right">
            Fotografías: Wikimedia Commons (CC BY-SA / Dominio Público). Autores: Javi.cavi, Michelangelo-36, KRLS, Fuencis, Er conde.
          </p>
        </section>

      </div>
    </div>
  );
}
