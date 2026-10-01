import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useApp } from "../../context/AppContext"

function ocultarNombre(nombre) {
  return nombre.split(" ").map(p =>
    p.length <= 2 ? p : p.slice(0, 2) + "*".repeat(p.length - 2)
  ).join(" ")
}

export default function OpinionesPublicas() {
  const { resenas, pedidos } = useApp()
  const aprobadas = resenas.filter(r => r.estado === "Aprobada")

  const datosPedido = (idPedido) => pedidos.find(p => p.id === idPedido) || {}

  const promedio = aprobadas.length
    ? (aprobadas.reduce((a, r) => a + r.calificacion, 0) / aprobadas.length).toFixed(1)
    : 0

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Opiniones de nuestros clientes
          </p>
          <h1 className="text-4xl font-bold">Lo que dicen de DECORA</h1>
          {aprobadas.length > 0 && (
            <p className="text-gray-300 mt-4 text-lg">
              {"⭐".repeat(Math.round(promedio))} {promedio} / 5 basado en {aprobadas.length} opiniones
            </p>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6 flex-1">
        <div className="max-w-5xl mx-auto">
          {aprobadas.length === 0 ? (
            <p className="text-center text-gray-400 py-16">Todavía no hay opiniones publicadas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aprobadas.map((r) => {
                const pedido = datosPedido(r.idPedido)
                return (
                  <div key={r.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="mb-3">{"⭐".repeat(r.calificacion)}<span className="text-gray-200">{"⭐".repeat(5 - r.calificacion)}</span></div>
                    {r.comentario && <p className="text-gray-600 text-sm mb-4 leading-relaxed">"{r.comentario}"</p>}
                    <p className="text-sm font-bold text-navy">{pedido.cliente ? ocultarNombre(pedido.cliente) : "Cliente DECORA"}</p>
                    <p className="text-xs text-gray-400">{pedido.servicio}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}