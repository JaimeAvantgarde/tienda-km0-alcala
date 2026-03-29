import ContactSection from '../components/ContactSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-crema">
      {/* Header */}
      <div className="bg-gradient-to-br from-tierra-800 to-oliva-800 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Contacto
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            ¿Tienes alguna consulta? Escríbenos y te responderemos lo antes posible
          </p>
        </div>
      </div>

      <ContactSection />
    </div>
  );
}
