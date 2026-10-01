import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import { useApp, calcularEstadoCampana } from "../../context/AppContext"

const badgeEstado = (estado) => {
  if (estado === "Borrador")   return "bg-gray-100 text-gray-500"
  if (estado === "Activa")     return "bg-green-100 text-green-700"
  return "bg-red-100 text-red-500" // Finalizada
}

const FORM_VACIO = { nombre: "", descripcion: "", servicioAplicable: "", porcentajeDescuento: "", codigoPromo: "", fechaInicio: "", fechaFin: "" }

export default function GestionCampanas() {
  const { campanas, crearCampana, actualizarCampana, eliminarCampana } = useApp()

  const [vista, setVista] = useState("lista") // "lista" | "formulario"
  const [form, setForm]   = useState(FORM_VACIO)
  const [editando, setEditando] = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleNuevaCampana = () => {
    setForm(FORM_VACIO)
    setEditando(null)
    setVista("formulario")
  }

  const handleEditar = (c) => {
    setForm({
      nombre: c.nombre, descripcion: c.descripcion, servicioAplicable: c.servicioAplicable,
      porcentajeDescuento: c.porcentajeDescuento, codigoPromo: c.codigoPromo,
      fechaInicio: c.fechaInicio, fechaFin: c.fechaFin,
    })
    setEditando(c.id)
    setVista("formulario")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editando) actualizarCampana(editando, form)
    else crearCampana(form)
    setVista("lista")
  }

  const metricas = [
    { label: "Total campañas", valor: campanas.length, icono: "🏷️" },
    { label: "Activas",        valor: campanas.filter(c => calcularEstadoCampana(c) === "Activa").length, icono: "✅" },
    { label: "Borrador",       valor: campanas.filter(c => calcularEstadoCampana(c) === "Borrador").length, icono: "📝" },
    { label: "Finalizadas",    valor: campanas.filter(c => calcularEstadoCampana(c) === "Finalizada").length, icono: "🏁" },
  ]

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Campañas y Promociones</h1>
            <p className="text-gray-500 text-sm mt-1">El estado se calcula automáticamente según las fechas de vigencia</p>
          </div>
          {vista === "lista" && (
            <button onClick={handleNuevaCampana} className="bg-navy text-white font-bold px-5 py-3 rounded-lg hover:bg-navy-light transition-colors text-sm">
              + Nueva campaña
            </button>
          )}
        </div>

        {vista === "lista" && (
          <>
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
              {campanas.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">Aún no has creado ninguna campaña</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-navy font-semibold">Nombre</th>
                        <th className="text-left py-3 px-2 text-navy font-semibold">Servicio</th>
                        <th className="text-left py-3 px-2 text-navy font-semibold">Descuento</th>
                        <th className="text-left py-3 px-2 text-navy font-semibold">Código</th>
                        <th className="text-left py-3 px-2 text-navy font-semibold">Vigencia</th>
                        <th className="text-left py-3 px-2 text-navy font-semibold">Estado</th>
                        <th className="text-left py-3 px-2 text-navy font-semibold">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campanas.map((c) => {
                        const estado = calcularEstadoCampana(c)
                        return (
                          <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2 font-bold text-navy">{c.nombre}</td>
                            <td className="py-3 px-2 text-gray-500">{c.servicioAplicable}</td>
                            <td className="py-3 px-2 font-semibold text-navy">{c.porcentajeDescuento}%</td>
                            <td className="py-3 px-2 text-gray-500">{c.codigoPromo}</td>
                            <td className="py-3 px-2 text-gray-400 text-xs">{c.fechaInicio} → {c.fechaFin}</td>
                            <td className="py-3 px-2">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeEstado(estado)}`}>{estado}</span>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex gap-2">
                                <button onClick={() => handleEditar(c)} className="bg-navy text-white text-xs px-3 py-1 rounded-lg hover:bg-navy-light">Editar</button>
                                <button onClick={() => setConfirmarEliminar(c.id)} className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200">Eliminar</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {vista === "formulario" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl flex flex-col gap-4">
            <h2 className="font-bold text-navy text-lg">{editando ? "Editar campaña" : "Nueva campaña"}</h2>

            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre de la campaña *" required
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />

            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" rows={2}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy resize-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="servicioAplicable" value={form.servicioAplicable} onChange={handleChange} placeholder="Servicio aplicable *" required
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
              <input name="porcentajeDescuento" value={form.porcentajeDescuento} onChange={handleChange} type="number" min="1" max="100" placeholder="% Descuento *" required
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
            </div>

            <input name="codigoPromo" value={form.codigoPromo} onChange={handleChange} placeholder="Código promocional (ej. VERANO25) *" required
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy uppercase" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Fecha de inicio *</label>
                <input name="fechaInicio" value={form.fechaInicio} onChange={handleChange} type="date" required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Fecha de fin *</label>
                <input name="fechaFin" value={form.fechaFin} onChange={handleChange} type="date" required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setVista("lista")} className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="flex-1 bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors">
                {editando ? "Guardar cambios" : "Crear campaña"}
              </button>
            </div>
          </form>
        )}
      </main>

      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <span className="text-5xl">⚠️</span>
            <h2 className="font-bold text-navy text-lg mt-4">¿Eliminar esta campaña?</h2>
            <p className="text-gray-500 text-sm mt-2">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmarEliminar(null)} className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={() => { eliminarCampana(confirmarEliminar); setConfirmarEliminar(null) }} className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}