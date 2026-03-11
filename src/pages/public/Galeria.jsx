import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const trabajos = [
  { id: 1, nombre: "Tapicería de sala completa", categoria: "Tapicería", icono: "🛋️" },
  { id: 2, nombre: "Sillas de comedor retapizadas", categoria: "Tapicería", icono: "🪑" },
  { id: 3, nombre: "Cabecera de cama personalizada", categoria: "Cabeceras", icono: "🛏️" },
  { id: 4, nombre: "Instalación de papel tapiz", categoria: "Decoración", icono: "🖼️" },
  { id: 5, nombre: "Alfombra de sala", categoria: "Alfombras", icono: "🏠" },
  { id: 6, nombre: "Cojines personalizados", categoria: "Textiles", icono: "🎨" },
  { id: 7, nombre: "Sillón individual restaurado", categoria: "Tapicería", icono: "🛋️" },
  { id: 8, nombre: "Tapiz decorativo habitación", categoria: "Decoración", icono: "🖼️" },
  { id: 9, nombre: "Comedor 6 sillas tapizadas", categoria: "Tapicería", icono: "🪑" },
]

export default function Galeria() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Nuestro trabajo
          </p>
          <h1 className="text-4xl font-bold">Galería de Proyectos</h1>
          <p className="text-gray-300 mt-4 text-lg">
            Una muestra de los trabajos realizados por nuestro equipo.
            Cada proyecto refleja nuestra dedicación y calidad.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-gray-50 py-20 px-6 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trabajos.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer"
              >
                <div className="relative bg-navy h-56 flex items-center justify-center overflow-hidden">
                  <span className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
                    {t.icono}
                  </span>
                  <div className="absolute inset-0 bg-navy bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-bold text-lg text-center px-4">
                      {t.nombre}
                    </p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p className="text-navy font-semibold text-sm">{t.nombre}</p>
                  <span className="bg-golden bg-opacity-20 text-golden text-xs font-semibold px-3 py-1 rounded-full">
                    {t.categoria}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 px-6 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">
            ¿Quieres un proyecto como estos?
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Contáctanos y cuéntanos tu idea. Trabajamos cada detalle
            para que el resultado supere tus expectativas.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <a
              href="/cotizacion"
              className="bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar cotizacion
            </a>
            <a
              href="/contacto"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-colors"
            >
              Contactar
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}