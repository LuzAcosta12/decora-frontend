import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Link } from "react-router-dom"

const servicios = [
  {
    id: 1,
    nombre: "Tapicería de salas y sillones",
    descripcion: "Retapizado completo de salas y sillones con materiales de alta durabilidad. Te asesoramos en la selección de telas, colores y acabados para renovar completamente tus muebles.",
    precio: "599",
    icono: "🛋️",
  },
  {
    id: 2,
    nombre: "Tapicería de sillas y comedores",
    descripcion: "Restauración y retapizado de sillas de comedor, butacas y bancas. Trabajamos con telas resistentes al uso diario y fáciles de limpiar.",
    precio: "299",
    icono: "🪑",
  },
  {
    id: 3,
    nombre: "Cabeceras de cama",
    descripcion: "Rehabilitación y fabricación de cabeceras tapizadas a medida. Diseños personalizados que complementan la decoración de tu recámara.",
    precio: "450",
    icono: "🛏️",
  },
  {
    id: 4,
    nombre: "Instalación de papel tapiz",
    descripcion: "Transformamos cualquier muro con papel tapiz decorativo profesional. Cuidamos la preparación de la superficie y el acabado en esquinas y uniones.",
    precio: "299",
    icono: "🖼️",
  },
  {
    id: 5,
    nombre: "Alfombras y tapetes",
    descripcion: "Venta, instalación y mantenimiento de alfombras y tapetes decorativos para diferentes estilos y necesidades, desde áreas de alto tránsito hasta espacios acogedores.",
    precio: "459",
    icono: "🏠",
  },
  {
    id: 6,
    nombre: "Cojines y textiles personalizados",
    descripcion: "Elaboración de cojines, fundas, cortinas y piezas especiales a medida. Te acompañamos en la elección de telas y acabados para lograr el resultado que buscas.",
    precio: "199",
    icono: "🎨",
  },
]

export default function Servicios() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Lo que ofrecemos
          </p>
          <h1 className="text-4xl font-bold">Nuestros Servicios</h1>
          <p className="text-gray-300 mt-4 text-lg">
            Soluciones personalizadas en tapicería y decoración para tu hogar.
            Cada proyecto es único y lo tratamos con la atención que merece.
          </p>
        </div>
      </section>

      {/* GRID DE SERVICIOS */}
      <section className="bg-gray-50 py-20 px-6 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                {/* Imagen placeholder */}
                <div className="bg-navy h-44 flex items-center justify-center">
                  <span className="text-7xl">{s.icono}</span>
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-navy font-bold text-xl">{s.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed flex-1">
                    {s.descripcion}
                  </p>
                  <p className="text-golden font-bold text-lg mt-4">
                    Desde ${s.precio}.00 MXN
                  </p>
                  <Link
                    to="/contacto"
                    className="mt-4 block text-center bg-navy text-white font-semibold py-3 rounded-lg hover:bg-navy-light transition-colors"
                  >
                    Pedir información
                  </Link>
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
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Contáctanos y cuéntanos tu proyecto. Trabajamos soluciones a medida
            para cualquier necesidad de tapicería y decoración.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link
              to="/cotizacion"
              className="bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar cotización
            </Link>
            <Link
              to="/contacto"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-colors"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}