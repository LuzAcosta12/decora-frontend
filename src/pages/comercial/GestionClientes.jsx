import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import { useApp, CLASIFICACIONES_CLIENTE } from "../../context/AppContext"

const badgeClasificacion = (c) => {
  if (c === "VIP")       return "bg-golden text-white"
  if (c === "Frecuente") return "bg-blue-100 text-blue-700"
  return "bg-gray-100 text-gray-500"
}

export default function GestionClientes() {
  const { clientesFrecuentes, actualizarClasificacionCliente } = useApp()

  const [busqueda,     setBusqueda]     = useState("")
  const [filtro,       setFiltro]       = useState("Todas")
  const [panelDetalle, setPanelDetalle] = useState(null)
  const [clasifTemp,   setClasifTemp]   = useState("Normal")
  const [descTemp,     setDescTemp]     = useState(0)

  const filtrados = clientesFrecuentes.filter((c) => {
    const texto = c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const clasif = filtro === "Todas" || c.clasificacion === filtro
    return texto && clasif
  })

  const metricas = [
    { label: "Clientes con historial", valor: clientesFrecuentes.length, icono: "👥" },
    { label: "Frecuentes",             valor: clientesFrecuentes.filter(c => c.clasificacion === "Frecuente").length, icono: "🔄" },
    { label: "VIP",                    valor: clientesFrecuentes.filter(c => c.clasificacion === "VIP").length, icono: "⭐" },
    { label: "Monto acumulado total",  valor: `$${clientesFrecuentes.reduce((a, c) => a + c.montoAcumulado, 0).toLocaleString()}`, icono: "💰" },
  ]

  const handleAbrirPanel = (cliente) => {
    setPanelDetalle(cliente)
    setClasifTemp(cliente.clasificacion)
    setDescTemp(cliente.descuentoEspecial)
  }

  const handleGuardar = () => {
    actualizarClasificacionCliente(panelDetalle.nombre, clasifTemp, parseFloat(descTemp) || 0)
    setPanelDetalle(prev => prev ? { ...prev, clasificacion: clasifTemp, descuentoEspecial: parseFloat(descTemp) || 0 } : null)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Clientes Frecuentes</h1>
          <p className="text-gray-500 text-sm mt-1">Fichas generadas automáticamente a partir de pedidos entregados</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metricas.map((m, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-2xl">{m.icono}</p>
              <p className="text-xl font-bold text-navy mt-2">{m.valor}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 relative">
          <div className={`bg-white rounded-xl shadow-sm p-6 transition-all ${panelDetalle ? "flex-1" : "w-full"}`}>
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <input
                type="text" placeholder="Buscar cliente..."
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy"
              />
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy">
                <option>Todas</option>
                {CLASIFICACIONES_CLIENTE.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-navy font-semibold">Cliente</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Pedidos entregados</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Monto acumulado</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Clasificación</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Descuento</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">No hay clientes con pedidos entregados todavía</td></tr>
                  ) : (
                    filtrados.map((c) => (
                      <tr key={c.nombre}
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${panelDetalle?.nombre === c.nombre ? "bg-blue-50" : ""}`}
                        onClick={() => handleAbrirPanel(c)}
                      >
                        <td className="py-3 px-2 font-bold text-navy">{c.nombre}</td>
                        <td className="py-3 px-2 text-gray-500">{c.totalPedidos}</td>
                        <td className="py-3 px-2 font-semibold text-navy">${c.montoAcumulado.toLocaleString()}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeClasificacion(c.clasificacion)}`}>{c.clasificacion}</span>
                        </td>
                        <td className="py-3 px-2 text-gray-500">{c.descuentoEspecial > 0 ? `${c.descuentoEspecial}%` : "—"}</td>
                        <td className="py-3 px-2">
                          <button onClick={(e) => { e.stopPropagation(); handleAbrirPanel(c) }} className="bg-navy text-white text-xs px-3 py-1 rounded-lg hover:bg-navy-light">Editar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {panelDetalle && (
            <div className="w-80 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-navy">{panelDetalle.nombre}</p>
                <button onClick={() => setPanelDetalle(null)} className="text-gray-400 hover:text-navy font-bold">✕</button>
              </div>

              <div className="text-sm flex flex-col gap-1">
                {panelDetalle.telefono && <p className="text-gray-500">📞 {panelDetalle.telefono}</p>}
                {panelDetalle.correo && <p className="text-gray-500">✉️ {panelDetalle.correo}</p>}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400">Monto acumulado</p>
                <p className="text-2xl font-bold text-navy">${panelDetalle.montoAcumulado.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{panelDetalle.totalPedidos} pedido(s) entregado(s)</p>
              </div>

              <hr />

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Clasificación</label>
                <select value={clasifTemp} onChange={(e) => setClasifTemp(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy">
                  {CLASIFICACIONES_CLIENTE.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Descuento especial (%)</label>
                <input type="number" min="0" max="100" value={descTemp} onChange={(e) => setDescTemp(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
              </div>

              <button onClick={handleGuardar} className="w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors">
                Guardar cambios
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}