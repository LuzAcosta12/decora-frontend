import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import ColumnaKanban from "../../components/kanban/ColumnaKanban"
import SeguimientoProspecto from "./SeguimientoProspecto"
import { useApp, ETAPAS_PIPELINE, CANALES_ORIGEN } from "../../context/AppContext"

export default function PipelineComercial() {
  const {
    prospectos, crearProspecto, moverEtapaProspecto, eliminarProspecto,
    convertirProspectoEnCotizacion, crearCotizacion,
  } = useApp()

  const [modalNuevo,       setModalNuevo]       = useState(false)
  const [prospectoActivo,  setProspectoActivo]  = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [modalConvertir,   setModalConvertir]   = useState(null)

  const prospectosPorEtapa = (etapa) => prospectos.filter(p => p.etapa === etapa)

  // ── Drag and drop nativo ──────────────────────────────────────────────────
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id)
  }
  const handleDragOver = (e) => e.preventDefault()
  const handleDrop = (e, etapaDestino) => {
    e.preventDefault()
    const id = parseInt(e.dataTransfer.getData("text/plain"))
    moverEtapaProspecto(id, etapaDestino)
    if (prospectoActivo?.id === id) {
      setProspectoActivo(prev => ({ ...prev, etapa: etapaDestino }))
    }
  }

  const handleCardClick = (prospecto) => {
    // Se vuelve a leer del state global para reflejar cambios de etapa recientes
    const actualizado = prospectos.find(p => p.id === prospecto.id) || prospecto
    setProspectoActivo(actualizado)
  }

  const handleEliminar = (id) => {
    setConfirmarEliminar(id)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Pipeline Comercial</h1>
            <p className="text-gray-500 text-sm mt-1">Arrastra las tarjetas entre columnas para actualizar la etapa</p>
          </div>
          <button
            onClick={() => setModalNuevo(true)}
            className="bg-navy text-white font-bold px-5 py-3 rounded-lg hover:bg-navy-light transition-colors text-sm"
          >
            + Nuevo prospecto
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
            {ETAPAS_PIPELINE.map((etapa) => (
              <ColumnaKanban
                key={etapa}
                etapa={etapa}
                prospectos={prospectosPorEtapa(etapa)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {prospectoActivo && (
            <SeguimientoProspecto
              prospecto={prospectoActivo}
              onClose={() => setProspectoActivo(null)}
              onEliminar={handleEliminar}
              onAbrirConversion={(p) => setModalConvertir(p)}
            />
          )}
        </div>
      </main>

      {modalNuevo && (
        <ModalNuevoProspecto
          onClose={() => setModalNuevo(false)}
          onCrear={(formData) => { crearProspecto(formData); setModalNuevo(false) }}
        />
      )}

      {modalConvertir && (
        <ModalConvertirProspecto
          prospecto={modalConvertir}
          onClose={() => setModalConvertir(null)}
          onConfirmar={(formData, estimado) => {
            const cot = crearCotizacion(formData, estimado)
            convertirProspectoEnCotizacion(modalConvertir.id, cot.id)
            setProspectoActivo(prev => prev ? { ...prev, idCotizacion: cot.id } : null)
            setModalConvertir(null)
          }}
        />
      )}

      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <span className="text-5xl">⚠️</span>
            <h2 className="font-bold text-navy text-lg mt-4">¿Eliminar este prospecto?</h2>
            <p className="text-gray-500 text-sm mt-2">Se eliminará también su bitácora de seguimiento. Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmarEliminar(null)} className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button
                onClick={() => {
                  if (prospectoActivo?.id === confirmarEliminar) setProspectoActivo(null)
                  eliminarProspecto(confirmarEliminar)
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

// ── Modal: alta manual de prospecto ─────────────────────────────────────────
function ModalNuevoProspecto({ onClose, onCrear }) {
  const [form, setForm] = useState({
    nombre: "", telefono: "", correo: "",
    canalOrigen: CANALES_ORIGEN[0], servicioInteres: "", observaciones: "",
  })

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nombre || !form.telefono) return
    onCrear(form)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-navy text-lg">Nuevo prospecto</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-navy font-bold">✕</button>
        </div>

        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre *" required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono *" required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
        <input name="correo" value={form.correo} onChange={handleChange} type="email" placeholder="Correo (opcional)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
        <select name="canalOrigen" value={form.canalOrigen} onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy">
          {CANALES_ORIGEN.map(c => <option key={c}>{c}</option>)}
        </select>
        <input name="servicioInteres" value={form.servicioInteres} onChange={handleChange} placeholder="Servicio de interés"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy" />
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={2} placeholder="Observaciones (opcional)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy resize-none" />

        <button type="submit" className="bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors">
          Agregar al pipeline
        </button>
      </form>
    </div>
  )
}

// ── Modal: convertir prospecto Confirmado en cotización ────────────────────
const nivelesCalidad = ["Economico", "Calidad/Precio", "Alta calidad"]
const tiemposEntrega = ["Estandar (3 a 5 semanas)", "Express (1 a 2 semanas)"]

function ModalConvertirProspecto({ prospecto, onClose, onConfirmar }) {
  const [form, setForm] = useState({
    nombre: prospecto.nombre || "",
    correo: prospecto.correo || "",
    telefono: prospecto.telefono || "",
    tipoServicioNombre: prospecto.servicioInteres || "",
    calidadNombre: "Calidad/Precio",
    material: "",
    cantidad: "1",
    tiempoEntrega: tiemposEntrega[0],
    observaciones: `Prospecto confirmado desde pipeline comercial (canal: ${prospecto.canalOrigen}).`,
  })
  const [estimadoMin, setEstimadoMin] = useState("")
  const [estimadoMax, setEstimadoMax] = useState("")

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
          <h2 className="font-bold text-navy text-lg">Convertir prospecto en cotización</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-navy font-bold">✕</button>
        </div>

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