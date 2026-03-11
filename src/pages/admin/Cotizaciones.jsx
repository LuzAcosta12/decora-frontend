import Sidebar from "../../components/Sidebar"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../../context/AppContext"

const badgeEstado = (estado) => {
  if (estado === "Nueva")          return "bg-blue-100 text-blue-700"
  if (estado === "En seguimiento") return "bg-yellow-100 text-yellow-700"
  return "bg-gray-100 text-gray-500"
}

export default function Cotizaciones() {
  const { cotizaciones, actualizarEstadoCotizacion, eliminarCotizacion } = useApp()
  const [busqueda,          setBusqueda]          = useState("")
  const [filtroEstado,      setFiltroEstado]      = useState("Todas")
  const [panelDetalle,      setPanelDetalle]      = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const navigate = useNavigate()

  const filtradas = cotizaciones.filter((c) => {
    const texto = (c.nombre + c.id).toLowerCase().includes(busqueda.toLowerCase())
    const estado = filtroEstado === "Todas" || c.estado === filtroEstado
    return texto && estado
  })

  const metricas = [
    { label: "Total recibidas",   valor: cotizaciones.length,                                      icono: "📋" },
    { label: "Nuevas",            valor: cotizaciones.filter(c => c.estado === "Nueva").length,    icono: "🆕" },
    { label: "En seguimiento",    valor: cotizaciones.filter(c => c.estado === "En seguimiento").length, icono: "🔄" },
    { label: "Cerradas",          valor: cotizaciones.filter(c => c.estado === "Cerrada").length,  icono: "✅" },
  ]

  const handleMarcarSeguimiento = (id) => {
    actualizarEstadoCotizacion(id, "En seguimiento")
    setPanelDetalle(prev => prev ? { ...prev, estado: "En seguimiento" } : null)
  }

  // Al dar clic en "Generar pedido", navega a Pedidos pasando la cotización
  const handleGenerarPedido = (cot) => {
    navigate("/admin/pedidos", { state: { cotizacionOrigen: cot } })
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Cotizaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona y convierte solicitudes en pedidos activos</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metricas.map((m, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-2xl">{m.icono}</p>
              <p className="text-2xl font-bold text-navy mt-2">{m.valor}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 relative">

          {/* Tabla */}
          <div className={`bg-white rounded-xl shadow-sm p-6 transition-all ${panelDetalle ? "flex-1" : "w-full"}`}>
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <input
                type="text"
                placeholder="Buscar por nombre o ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy"
              />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy"
              >
                <option>Todas</option>
                <option>Nueva</option>
                <option>En seguimiento</option>
                <option>Cerrada</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-navy font-semibold">ID</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Cliente</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Servicio</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Estimado</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Estado</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Fecha</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 text-sm">
                        No hay cotizaciones que coincidan con la búsqueda
                      </td>
                    </tr>
                  ) : (
                    filtradas.map((c) => (
                      <tr
                        key={c.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${panelDetalle?.id === c.id ? "bg-blue-50" : ""}`}
                        onClick={() => setPanelDetalle(c)}
                      >
                        <td className="py-3 px-2 font-bold text-navy">{c.id}</td>
                        <td className="py-3 px-2 text-gray-700">{c.nombre}</td>
                        <td className="py-3 px-2 text-gray-500">{c.servicio}</td>
                        <td className="py-3 px-2 font-semibold text-navy">
                          ${c.estimadoMin?.toLocaleString()} – ${c.estimadoMax?.toLocaleString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeEstado(c.estado)}`}>
                            {c.estado}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-400">{c.fecha}</td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setPanelDetalle(c) }}
                              className="bg-navy text-white text-xs px-3 py-1 rounded-lg hover:bg-navy-light"
                            >
                              Ver
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmarEliminar(c.id) }}
                              className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel de detalle */}
          {panelDetalle && (
            <div className="w-80 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-navy">{panelDetalle.id}</p>
                <button onClick={() => setPanelDetalle(null)} className="text-gray-400 hover:text-navy font-bold">✕</button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-navy">{panelDetalle.nombre}</h3>
                <p className="text-sm text-gray-500">✉️ {panelDetalle.correo}</p>
                {panelDetalle.telefono && <p className="text-sm text-gray-500">📞 {panelDetalle.telefono}</p>}
              </div>

              <hr />

              <div className="flex flex-col gap-2 text-sm">
                <p className="font-semibold text-navy mb-1">Respuestas del cliente</p>
                {[
                  ["Servicio",        panelDetalle.servicio],
                  ["Calidad",         panelDetalle.calidad],
                  ["Material",        panelDetalle.material],
                  ["Piezas",          panelDetalle.piezas],
                  ["Tiempo entrega",  panelDetalle.tiempoEntrega],
                  panelDetalle.observaciones ? ["Observaciones", panelDetalle.observaciones] : null,
                ].filter(Boolean).map(([label, val]) => (
                  <div key={label}>
                    <p className="text-gray-400">{label}</p>
                    <p className="font-medium">{val}</p>
                  </div>
                ))}
              </div>

              <hr />

              <div className="text-center">
                <p className="text-gray-400 text-sm">Costo estimado</p>
                <p className="text-2xl font-bold text-navy">
                  ${panelDetalle.estimadoMin?.toLocaleString()} – ${panelDetalle.estimadoMax?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">MXN</p>
              </div>

              {/* Solo mostrar acciones si no está cerrada */}
              {panelDetalle.estado !== "Cerrada" && (
                <>
                  <button
                    onClick={() => handleGenerarPedido(panelDetalle)}
                    className="w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors"
                  >
                    Generar pedido
                  </button>
                  {panelDetalle.estado !== "En seguimiento" && (
                    <button
                      onClick={() => handleMarcarSeguimiento(panelDetalle.id)}
                      className="w-full border-2 border-navy text-navy font-bold py-3 rounded-lg hover:bg-navy hover:text-white transition-colors"
                    >
                      Marcar en seguimiento
                    </button>
                  )}
                </>
              )}

              {panelDetalle.estado === "Cerrada" && (
                <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-lg py-3">
                  Esta cotización ya fue convertida en pedido
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal confirmar eliminar */}
      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <span className="text-5xl">⚠️</span>
            <h2 className="font-bold text-navy text-lg mt-4">¿Eliminar esta cotización?</h2>
            <p className="text-gray-500 text-sm mt-2">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (panelDetalle?.id === confirmarEliminar) setPanelDetalle(null)
                  eliminarCotizacion(confirmarEliminar)
                  setConfirmarEliminar(null)
                }}
                className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}