import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Link } from "react-router-dom"
import { useApp } from "../../context/AppContext"

const serviciosDestacados = [
  {
    id: 1,
    nombre: "Tapicería de salas",
    descripcion: "Retapizado completo de salas y sillones con materiales de calidad.",
    precio: "599",
  },
  {
    id: 2,
    nombre: "Alfombras y tapetes",
    descripcion: "Venta, instalación y mantenimiento de alfombras decorativas.",
    precio: "459",
  },
  {
    id: 3,
    nombre: "Instalación de papel tapiz",
    descripcion: "Transformamos tus espacios con papel tapiz profesional.",
    precio: "299",
  },
]

const beneficios = [
  {
    icono: "🎨",
    titulo: "Asesoría personalizada",
    texto: "Te acompañamos en la elección de telas, colores y materiales para cada proyecto.",
  },
  {
    icono: "⭐",
    titulo: "Materiales de calidad",
    texto: "Usamos materiales seleccionados para garantizar durabilidad y buen acabado.",
  },
  {
    icono: "🕐",
    titulo: "Entregas a tiempo",
    texto: "Cumplimos los plazos acordados para que tengas tu mueble cuando lo necesitas.",
  },
]

function ocultarNombre(nombre) {
  return nombre.split(" ").map(p =>
    p.length <= 2 ? p : p.slice(0, 2) + "*".repeat(p.length - 2)
  ).join(" ")
}

function diasRestantes(fechaFin) {
  const hoy = new Date()
  const fin = new Date(fechaFin)
  const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export default function Home() {
  const { campanasActivas, resenas, pedidos } = useApp()

  const resenasDestacadas = resenas
    .filter(r => r.estado === "Aprobada" && r.calificacion >= 4)
    .slice(0, 3)

  const nombreClientePedido = (idPedido) => pedidos.find(p => p.id === idPedido)?.cliente || "Cliente DECORA"

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="bg-navy text-white py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-golden text-sm font-semibold uppercase tracking-widest">
              Tapicería · Textiles · Decoración
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
              Renueva tus muebles y espacios con el servicio profesional de DECORA
            </h1>
            <p className="text-gray-300 mt-4 text-lg leading-relaxed">
              Realizamos tapicería de salas, sillones, sillas y cabeceras, así como
              instalación de papel tapiz y textiles decorativos.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <Link
                to="/servicios"
                className="bg-white text-navy font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Ver servicios
              </Link>
              <Link
                to="/cotizacion"
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-navy transition-colors"
              >
                Solicitar cotización
              </Link>
              <Link
                to="/asesoria"
                className="border-2 border-golden text-golden font-semibold px-6 py-3 rounded-lg hover:bg-golden hover:text-white transition-colors"
              >
                Pedir asesoría gratuita
              </Link>
            </div>
          </div>

          {/* Tarjeta de beneficios del lado derecho */}
          <div className="flex-1 bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20">
            <p className="text-golden font-semibold mb-4">¿Por qué elegir DECORA?</p>
            <ul className="flex flex-col gap-4">
              {beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-2xl">{b.icono}</span>
                  <div>
                    <p className="font-semibold text-white">{b.titulo}</p>
                    <p className="text-gray-300 text-sm">{b.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROMOCIONES DESTACADAS — solo aparece si hay campañas activas (punto 17) */}
      {campanasActivas.length > 0 && (
        <section className="bg-golden py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">🔥 Promociones activas</h2>
              <Link to="/promociones" className="text-white font-semibold hover:underline text-sm">
                Ver todas →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {campanasActivas.slice(0, 3).map((c) => (
                <div key={c.id} className="bg-white rounded-xl p-5 shadow-md">
                  <p className="font-bold text-navy">{c.nombre}</p>
                  <p className="text-sm text-gray-500 mt-1">{c.servicioAplicable}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-golden">{c.porcentajeDescuento}% OFF</span>
                    <span className="text-xs text-red-500 font-semibold">{diasRestantes(c.fechaFin)} días restantes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SERVICIOS DESTACADOS */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-golden text-sm font-semibold uppercase tracking-widest">
                Lo que hacemos
              </p>
              <h2 className="text-3xl font-bold text-navy mt-1">Servicios destacados</h2>
              <p className="text-gray-500 mt-2">
                Algunas de las soluciones más solicitadas en tapicería y decoración.
              </p>
            </div>
            <Link
              to="/servicios"
              className="hidden md:block text-navy font-semibold hover:text-golden transition-colors"
            >
              Ver todos los servicios →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviciosDestacados.map((s) => (
              <div key={s.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-navy-light h-40 flex items-center justify-center">
                  <span className="text-6xl">🛋️</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-navy text-lg">{s.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-2">{s.descripcion}</p>
                  <p className="text-golden font-bold mt-3">Desde ${s.precio}.00 MXN</p>
                  <Link
                    to="/contacto"
                    className="mt-4 block text-center border-2 border-navy text-navy font-semibold py-2 rounded-lg hover:bg-navy hover:text-white transition-colors"
                  >
                    Pedir información
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/servicios" className="text-navy font-semibold hover:text-golden">
              Ver todos los servicios →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS — solo aparece si hay reseñas aprobadas destacadas (punto 17) */}
      {resenasDestacadas.length > 0 && (
        <section className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-golden text-sm font-semibold uppercase tracking-widest">Confían en nosotros</p>
              <h2 className="text-3xl font-bold text-navy mt-1">Lo que dicen nuestros clientes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resenasDestacadas.map((r) => (
                <div key={r.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="mb-3">{"⭐".repeat(r.calificacion)}</div>
                  {r.comentario && <p className="text-gray-600 text-sm mb-4 leading-relaxed">"{r.comentario}"</p>}
                  <p className="text-sm font-bold text-navy">{ocultarNombre(nombreClientePedido(r.idPedido))}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/opiniones" className="text-navy font-semibold hover:text-golden">
                Ver todas las opiniones →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy py-16 px-6 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">
            ¿Listo para renovar tus muebles o espacios con DECORA?
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Compártenos los detalles de tu proyecto y te ayudamos a encontrar
            la mejor opción en tapicería y decoración.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link
              to="/cotizacion"
              className="inline-block bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar cotización
            </Link>
            <Link
              to="/asesoria"
              className="inline-block border-2 border-golden text-golden font-bold px-8 py-4 rounded-lg hover:bg-golden hover:text-white transition-colors"
            >
              Pedir asesoría gratuita
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
