import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import { useApp } from "../../context/AppContext"

const badgeEstado = (estado) => {
  if (estado === "Nueva")       return "bg-blue-100 text-blue-700"
  if (estado === "Contactado")  return "bg-yellow-100 text-yellow-700"
  if (estado === "Convertida")  return "bg-green-100 text-green-700"
  return "bg-gray-100 text-gray-500" // Descartada
}

const nivelesCalidad = ["Economico", "Calidad/Precio", "Alta calidad"]
const tiemposEntrega = ["Estandar (3 a 5 semanas)", "Express (1 a 2 semanas)"]

export default function GestionAsesorias() {
  const {
    asesorias, actualizarEstadoAsesoria, eliminarAsesoria,
    marcarAsesoriaConvertida, crearCotizacion, convertirAsesoriaEnProspecto,
  } = useApp()
  const navigate = useNavigate()

  const [busqueda,          setBusqueda]          = useState("")
  const [filtroEstado,      setFiltroEstado]      = useState("Todas")
  const [panelDetalle,      setPanelDetalle]      = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [modalConvertir,    setModalConvertir]    = useState(null)

  const filtradas = asesorias.filter((a) => {
    const texto = (a.tipoMueble + a.codigoSeguimiento).toLowerCase().includes(busqueda.toLowerCase())
    const estado = filtroEstado === "Todas" || a.estado === filtroEstado
    return texto && estado
  })

  const metricas = [
    { label: "Total recibidas", valor: asesorias.length, icono: "💬" },
    { label: "Nuevas",          valor: asesorias.filter(a => a.estado === "Nueva").length, icono: "🆕" },
    { label: "Contactadas",     valor: asesorias.filter(a => a.estado === "Contactado").length, icono: "🔄" },
    { label: "Convertidas",     valor: asesorias.filter(a => a.estado === "Convertida").length, icono: "✅" },
  ]

  const handleCambiarEstado = (id, estado) => {
    actualizarEstadoAsesoria(id, estado)
    setPanelDetalle(prev => prev ? { ...prev, estado } : null)
  }

  const handleEnviarAPipeline = (asesoria) => {
    const nuevoProspecto = convertirAsesoriaEnProspecto(asesoria.id)
    setPanelDetalle(prev => prev ? { ...prev, estado: "Contactado", idProspecto: nuevoProspecto.id } : null)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Gestión de Asesorías</h1>
          <p className="text-gray-500 text-sm mt-1">Solicitudes de orientación recibidas desde el sitio público</p>
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

        <div className="flex gap-4 relative">
          <div className={`bg-white rounded-xl shadow-sm p-6 transition-all ${panelDetalle ? "flex-1" : "w-full"}`}>
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <input
                type="text"
                placeholder="Buscar por código o tipo de mueble..."
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
                <option>Contactado</option>
                <option>Convertida</option>
                <option>Descartada</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-navy font-semibold">Código</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Mueble</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Presupuesto</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Estado</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Fecha</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">No hay asesorías que coincidan</td></tr>
                  ) : (
                    filtradas.map((a) => (
                      <tr
                        key={a.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${panelDetalle?.id === a.id ? "bg-blue-50" : ""}`}
                        onClick={() => setPanelDetalle(a)}
                      >
                        <td className="py-3 px-2 font-bold text-navy">{a.codigoSeguimiento}</td>
                        <td className="py-3 px-2 text-gray-700">{a.tipoMueble}</td>
                        <td className="py-3 px-2 text-gray-500">{a.presupuestoAprox ? `$${Number(a.presupuestoAprox).toLocaleString()}` : "—"}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeEstado(a.estado)}`}>{a.estado}</span>
                        </td>
                        <td className="py-3 px-2 text-gray-400">{a.fecha}</td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); setPanelDetalle(a) }} className="bg-navy text-white text-xs px-3 py-1 rounded-lg hover:bg-navy-light">Ver</button>
                            <button onClick={(e) => { e.stopPropagation(); setConfirmarEliminar(a.id) }} className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200">Eliminar</button>
                          </div>
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
                <p className="font-bold text-navy">{panelDetalle.codigoSeguimiento}</p>
                <button onClick={() => setPanelDetalle(null)} className="text-gray-400 hover:text-navy font-bold">✕</button>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                {panelDetalle.nombre && (
                  <div><p className="text-gray-400">Nombre</p><p className="font-medium">{panelDetalle.nombre}</p></div>
                )}
                {panelDetalle.telefono && (
                  <div><p className="text-gray-400">Teléfono</p><p className="font-medium">{panelDetalle.telefono}</p></div>
                )}
                {panelDetalle.correo && (
                  <div><p className="text-gray-400">Correo</p><p className="font-medium">{panelDetalle.correo}</p></div>
                )}
                <div><p className="text-gray-400">Tipo de mueble</p><p className="font-medium">{panelDetalle.tipoMueble}</p></div>
                {panelDetalle.presupuestoAprox && (
                  <div><p className="text-gray-400">Presupuesto</p><p className="font-medium">${Number(panelDetalle.presupuestoAprox).toLocaleString()} MXN</p></div>
                )}
                <div><p className="text-gray-400">Descripción</p><p className="font-medium">{panelDetalle.descripcion}</p></div>
              </div>

              <hr />

              <div>
                <p className="text-xs text-gray-400 mb-2">Actualizar estado</p>
                <select
                  value={panelDetalle.estado}
                  onChange={(e) => handleCambiarEstado(panelDetalle.id, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                >
                  <option>Nueva</option>
                  <option>Contactado</option>
                  <option>Convertida</option>
                  <option>Descartada</option>
                </select>
              </div>

              {panelDetalle.estado !== "Convertida" && !panelDetalle.idProspecto && (
                <button
                  onClick={() => handleEnviarAPipeline(panelDetalle)}
                  className="w-full border-2 border-navy text-navy font-bold py-3 rounded-lg hover:bg-navy hover:text-white transition-colors"
                >
                  🗂️ Enviar a pipeline
                </button>
              )}
              {panelDetalle.idProspecto && (
                <button
                  onClick={() => navigate("/admin/prospectos")}
                  className="w-full bg-gray-50 text-navy text-xs font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
                >
                  Ya está en el pipeline — ver tablero →
                </button>
              )}

              {panelDetalle.estado !== "Convertida" && (
                <button
                  onClick={() => setModalConvertir(panelDetalle)}
                  className="w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors"
                >
                  Convertir en cotización
                </button>
              )}
              {panelDetalle.estado === "Convertida" && (
                <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-lg py-3">
                  Ya fue convertida a cotización {panelDetalle.idCotizacion}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {modalConvertir && (
        <ModalConvertirCotizacion
          asesoria={modalConvertir}
          onClose={() => setModalConvertir(null)}
          onConfirmar={(formData, estimado) => {
            const cot = crearCotizacion(formData, estimado)
            marcarAsesoriaConvertida(modalConvertir.id, cot.id)
            setPanelDetalle(prev => prev ? { ...prev, estado: "Convertida", idCotizacion: cot.id } : null)
            setModalConvertir(null)
          }}
        />
      )}

      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <span className="text-5xl">⚠️</span>
            <h2 className="font-bold text-navy text-lg mt-4">¿Eliminar esta asesoría?</h2>
            <p className="text-gray-500 text-sm mt-2">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmarEliminar(null)} className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button
                onClick={() => {
                  if (panelDetalle?.id === confirmarEliminar) setPanelDetalle(null)
                  eliminarAsesoria(confirmarEliminar)
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

function ModalConvertirCotizacion({ asesoria, onClose, onConfirmar }) {
  const [form, setForm] = useState({
    nombre: asesoria.nombre || "",
    correo: asesoria.correo || "",
    telefono: asesoria.telefono || "",
    tipoServicioNombre: asesoria.tipoMueble || "",
    calidadNombre: "Calidad/Precio",
    material: "",
    cantidad: "1",
    tiempoEntrega: tiemposEntrega[0],
    observaciones: asesoria.descripcion || "",
  })
  const [estimadoMin, setEstimadoMin] = useState(asesoria.presupuestoAprox || "")
  const [estimadoMax, setEstimadoMax] = useState(asesoria.presupuestoAprox || "")

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nombre || !form.correo) return
    onConfirmar(form, { min: parseFloat(estimadoMin) || 0, max: parseFloat(estimadoMax) || 0 })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-navy text-lg">Convertir a cotización</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-navy font-bold">✕</button>
        </div>
        <p className="text-xs text-gray-400">
          Completa los datos faltantes del cliente antes de generar la cotización formal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre *" required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
        </div>
        <input name="correo" value={form.correo} onChange={handleChange} type="email" placeholder="Correo *" required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="tipoServicioNombre" value={form.tipoServicioNombre} onChange={handleChange} placeholder="Servicio"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
          <select name="calidadNombre" value={form.calidadNombre} onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy">
            {nivelesCalidad.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="material" value={form.material} onChange={handleChange} placeholder="Material"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
          <input name="cantidad" value={form.cantidad} onChange={handleChange} type="number" min="1" placeholder="Piezas"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
        </div>

        <select name="tiempoEntrega" value={form.tiempoEntrega} onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy">
          {tiemposEntrega.map(t => <option key={t}>{t}</option>)}
        </select>

        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={3}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy resize-none" />

        <div className="grid grid-cols-2 gap-3">
          <input value={estimadoMin} onChange={(e) => setEstimadoMin(e.target.value)} type="number" placeholder="Estimado mín."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
          <input value={estimadoMax} onChange={(e) => setEstimadoMax(e.target.value)} type="number" placeholder="Estimado máx."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
        </div>

        <button type="submit" className="bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors">
          Generar cotización
        </button>
      </form>
    </div>
  )
}