import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import { useApp, TIPOS_TAREA_RECORDATORIO } from "../../context/AppContext"

const iconoTarea = {
  "Llamar": "📞",
  "Enviar cotización": "📄",
  "Dar seguimiento": "🔄",
  "Confirmar entrega": "📦",
}

function estadoFecha(fechaLimite, completado) {
  if (completado) return "completado"
  const hoy = new Date().toISOString().split("T")[0]
  if (fechaLimite < hoy) return "vencido"
  if (fechaLimite === hoy) return "hoy"
  return "proximo"
}

const estiloEstado = {
  vencido:    "border-l-4 border-red-500 bg-red-50",
  hoy:        "border-l-4 border-yellow-500 bg-yellow-50",
  proximo:    "border-l-4 border-blue-300 bg-white",
  completado: "border-l-4 border-green-400 bg-green-50 opacity-60",
}

export default function RecordatoriosComerciales() {
  const { recordatorios, crearRecordatorio, actualizarRecordatorio, completarRecordatorio, eliminarRecordatorio, prospectos } = useApp()

  const [filtro, setFiltro] = useState("Pendientes")
  const [modalRecordatorio, setModalRecordatorio] = useState(null) // null=cerrado, {}=nuevo, {...datos}=editar
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)

  const nombreProspecto = (idProspecto) => prospectos.find(p => p.id === idProspecto)?.nombre || null

  const filtrados = recordatorios
    .filter(r => {
      if (filtro === "Pendientes") return !r.completado
      if (filtro === "Completados") return r.completado
      return true
    })
    .sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite))

  const vencidos  = recordatorios.filter(r => !r.completado && estadoFecha(r.fechaLimite, false) === "vencido").length
  const hoy       = recordatorios.filter(r => !r.completado && estadoFecha(r.fechaLimite, false) === "hoy").length

  const handleGuardar = (formData) => {
    if (modalRecordatorio?.id) {
      actualizarRecordatorio(modalRecordatorio.id, formData)
    } else {
      crearRecordatorio(formData)
    }
    setModalRecordatorio(null)
  }

  // Revierte un recordatorio completado por error, de vuelta a pendiente
  const handleReabrir = (id) => {
    actualizarRecordatorio(id, { completado: false, fechaCompletado: null })
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Recordatorios Comerciales</h1>
            <p className="text-gray-500 text-sm mt-1">Tareas de seguimiento, generadas automáticamente desde el pipeline o creadas manualmente</p>
          </div>
          <button onClick={() => setModalRecordatorio({})} className="bg-navy text-white font-bold px-5 py-3 rounded-lg hover:bg-navy-light transition-colors text-sm">
            + Nuevo recordatorio
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl">🔴</p>
            <p className="text-2xl font-bold text-navy mt-2">{vencidos}</p>
            <p className="text-xs text-gray-500">Vencidos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl">🟡</p>
            <p className="text-2xl font-bold text-navy mt-2">{hoy}</p>
            <p className="text-xs text-gray-500">Para hoy</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl">✅</p>
            <p className="text-2xl font-bold text-navy mt-2">{recordatorios.filter(r => r.completado).length}</p>
            <p className="text-xs text-gray-500">Completados</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex gap-2 mb-5">
            {["Pendientes", "Completados", "Todos"].map((f) => (
              <button key={f} onClick={() => setFiltro(f)}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                  filtro === f ? "bg-navy text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}>
                {f}
              </button>
            ))}
          </div>

          {filtrados.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No hay recordatorios en este filtro</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtrados.map((r) => {
                const est = estadoFecha(r.fechaLimite, r.completado)
                const prospecto = nombreProspecto(r.idProspecto)
                return (
                  <div key={r.id} className={`rounded-lg p-4 flex items-center justify-between gap-4 ${estiloEstado[est]}`}>
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl">{iconoTarea[r.tipoTarea] || "📌"}</span>
                      <div>
                        <p className={`font-semibold text-navy text-sm ${r.completado ? "line-through" : ""}`}>{r.tipoTarea}</p>
                        {r.descripcion && <p className="text-xs text-gray-500">{r.descripcion}</p>}
                        {prospecto && <p className="text-xs text-golden font-semibold mt-0.5">Prospecto: {prospecto}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {r.completado ? `Completado el ${r.fechaCompletado}` : `Vence: ${r.fechaLimite}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setModalRecordatorio(r)} className="bg-navy text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-navy-light">
                        Editar
                      </button>
                      {!r.completado ? (
                        <button onClick={() => completarRecordatorio(r.id)} className="bg-green-100 text-green-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-green-200">
                          Completar
                        </button>
                      ) : (
                        <button onClick={() => handleReabrir(r.id)} className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-yellow-200">
                          Reabrir
                        </button>
                      )}
                      <button onClick={() => setConfirmarEliminar(r.id)} className="bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-200">
                        Eliminar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {modalRecordatorio && (
        <ModalRecordatorio
          recordatorio={modalRecordatorio}
          prospectos={prospectos}
          onClose={() => setModalRecordatorio(null)}
          onGuardar={handleGuardar}
        />
      )}

      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <span className="text-5xl">⚠️</span>
            <h2 className="font-bold text-navy text-lg mt-4">¿Eliminar este recordatorio?</h2>
            <p className="text-gray-500 text-sm mt-2">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmarEliminar(null)} className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={() => { eliminarRecordatorio(confirmarEliminar); setConfirmarEliminar(null) }} className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Modal único para crear o editar — si `recordatorio` trae `id`, es edición
function ModalRecordatorio({ recordatorio, prospectos, onClose, onGuardar }) {
  const esEdicion = !!recordatorio.id
  const [form, setForm] = useState({
    tipoTarea:   recordatorio.tipoTarea   || TIPOS_TAREA_RECORDATORIO[0],
    descripcion: recordatorio.descripcion || "",
    fechaLimite: recordatorio.fechaLimite || "",
    idProspecto: recordatorio.idProspecto || "",
  })

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.fechaLimite) return
    onGuardar({
      ...form,
      idProspecto: form.idProspecto ? parseInt(form.idProspecto) : null,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-navy text-lg">{esEdicion ? "Editar recordatorio" : "Nuevo recordatorio"}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-navy font-bold">✕</button>
        </div>

        <select name="tipoTarea" value={form.tipoTarea} onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy">
          {TIPOS_TAREA_RECORDATORIO.map(t => <option key={t}>{t}</option>)}
        </select>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Vincular a un prospecto (opcional)</label>
          <select name="idProspecto" value={form.idProspecto} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy">
            <option value="">Sin vincular</option>
            {prospectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción (opcional)" rows={2}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy resize-none" />

        <input name="fechaLimite" value={form.fechaLimite} onChange={handleChange} type="date" required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />

        <button type="submit" className="bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors">
          {esEdicion ? "Guardar cambios" : "Crear recordatorio"}
        </button>
      </form>
    </div>
  )
}