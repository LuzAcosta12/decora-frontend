import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import { useApp } from "../../context/AppContext"

const badgeEstado = (estado) => {
  if (estado === "Pendiente") return "bg-yellow-100 text-yellow-700"
  if (estado === "Aprobada")  return "bg-green-100 text-green-700"
  return "bg-red-100 text-red-600" // Rechazada
}

export default function ModeracionResenas() {
  const { resenas, pedidos, actualizarEstadoResena } = useApp()
  const [filtro, setFiltro] = useState("Pendiente")

  const filtradas = resenas.filter(r => filtro === "Todas" || r.estado === filtro)

  const nombreCliente = (idPedido) => {
    const pedido = pedidos.find(p => p.id === idPedido)
    return pedido?.cliente || "Cliente"
  }

  const servicioPedido = (idPedido) => {
    const pedido = pedidos.find(p => p.id === idPedido)
    return pedido?.servicio || ""
  }

  const metricas = [
    { label: "Total recibidas", valor: resenas.length, icono: "⭐" },
    { label: "Pendientes",      valor: resenas.filter(r => r.estado === "Pendiente").length, icono: "⏳" },
    { label: "Aprobadas",       valor: resenas.filter(r => r.estado === "Aprobada").length, icono: "✅" },
    { label: "Rechazadas",      valor: resenas.filter(r => r.estado === "Rechazada").length, icono: "🚫" },
  ]

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Moderación de Reseñas</h1>
          <p className="text-gray-500 text-sm mt-1">Aprueba o rechaza las calificaciones antes de publicarlas</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metricas.map((m, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-2xl">{m.icono}</p>
              <p className="text-2xl font-bold text-navy mt-2">{m.valor}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex gap-2 mb-5">
            {["Pendiente", "Aprobada", "Rechazada", "Todas"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                  filtro === f ? "bg-navy text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filtradas.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No hay reseñas en este filtro</p>
          ) : (
            <div className="flex flex-col gap-4">
              {filtradas.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-navy">{nombreCliente(r.idPedido)}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeEstado(r.estado)}`}>{r.estado}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{servicioPedido(r.idPedido)} · {r.fecha}</p>
                    <div className="mb-2">{"⭐".repeat(r.calificacion)}<span className="text-gray-200">{"⭐".repeat(5 - r.calificacion)}</span></div>
                    {r.comentario && <p className="text-sm text-gray-600">{r.comentario}</p>}
                  </div>
                  {r.estado === "Pendiente" && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => actualizarEstadoResena(r.id, "Aprobada")} className="bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-200">Aprobar</button>
                      <button onClick={() => actualizarEstadoResena(r.id, "Rechazada")} className="bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-200">Rechazar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}