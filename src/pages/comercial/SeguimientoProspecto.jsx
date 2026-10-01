import { useState } from "react"
import { useApp, TIPOS_CONTACTO, ETAPAS_PIPELINE } from "../../context/AppContext"

const iconoTipoContacto = {
  "Llamada telefónica": "📞",
  "Mensaje de WhatsApp": "💬",
  "Correo": "✉️",
  "Visita al taller": "🏠",
}

export default function SeguimientoProspecto({ prospecto, onClose, onEliminar, onAbrirConversion }) {
  const {
    obtenerInteraccionesPorProspecto,
    agregarInteraccion,
    eliminarInteraccion,
    moverEtapaProspecto,
    actualizarProspecto,
  } = useApp()

  const [tipoContacto, setTipoContacto]     = useState(TIPOS_CONTACTO[0])
  const [descripcion, setDescripcion]       = useState("")
  const [proximoPaso, setProximoPaso]       = useState("")
  const [fechaLimitePaso, setFechaLimitePaso] = useState("")

  const interacciones = obtenerInteraccionesPorProspecto(prospecto.id)

  const handleAgregar = (e) => {
    e.preventDefault()
    if (!descripcion.trim()) return
    agregarInteraccion(prospecto.id, {
      tipoContacto,
      descripcion,
      proximoPaso: proximoPaso.trim() || null,
      fechaLimitePaso: proximoPaso.trim() ? fechaLimitePaso : null,
    })
    setDescripcion("")
    setProximoPaso("")
    setFechaLimitePaso("")
  }

  return (
    <div className="w-96 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-navy text-lg">{prospecto.nombre}</p>
          <p className="text-xs text-gray-400">Prospecto #{prospecto.id}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-navy font-bold">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {prospecto.telefono && (
          <div><p className="text-gray-400 text-xs">Teléfono</p><p className="font-medium">{prospecto.telefono}</p></div>
        )}
        {prospecto.correo && (
          <div><p className="text-gray-400 text-xs">Correo</p><p className="font-medium">{prospecto.correo}</p></div>
        )}
        <div><p className="text-gray-400 text-xs">Canal de origen</p><p className="font-medium">{prospecto.canalOrigen}</p></div>
        <div><p className="text-gray-400 text-xs">Servicio de interés</p><p className="font-medium">{prospecto.servicioInteres}</p></div>
      </div>

      {prospecto.observaciones && (
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <p className="text-gray-400 text-xs mb-1">Observaciones</p>
          <p className="text-gray-600">{prospecto.observaciones}</p>
        </div>
      )}

      <div>
        <p className="text-xs text-gray-400 mb-2">Etapa en el pipeline</p>
        <select
          value={prospecto.etapa}
          onChange={(e) => moverEtapaProspecto(prospecto.id, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
        >
          {ETAPAS_PIPELINE.map(et => <option key={et}>{et}</option>)}
        </select>
      </div>

      {prospecto.etapa === "Confirmado" && !prospecto.idCotizacion && (
        <button
          onClick={() => onAbrirConversion(prospecto)}
          className="w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors"
        >
          Convertir en cotización
        </button>
      )}
      {prospecto.idCotizacion && (
        <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-lg py-2">
          Ya vinculado a la cotización {prospecto.idCotizacion}
        </div>
      )}

      <hr />

      {/* Bitácora cronológica */}
      <div>
        <p className="text-sm font-semibold text-navy mb-3">Bitácora de seguimiento</p>
        {interacciones.length === 0 ? (
          <p className="text-xs text-gray-300 text-center py-4">Sin interacciones registradas todavía</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1">
            {interacciones.map((i) => (
              <div key={i.id} className="border-l-2 border-golden pl-3 py-1 relative group">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-navy">
                    {iconoTipoContacto[i.tipoContacto] || "📌"} {i.tipoContacto}
                  </p>
                  <button
                    onClick={() => eliminarInteraccion(i.id)}
                    className="text-gray-300 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    eliminar
                  </button>
                </div>
                <p className="text-xs text-gray-400">{i.fechaInteraccion}</p>
                <p className="text-sm text-gray-600 mt-1">{i.descripcion}</p>
                {i.proximoPaso && (
                  <p className="text-xs text-golden font-semibold mt-1">
                    → Próximo paso: {i.proximoPaso} (antes del {i.fechaLimitePaso})
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario nueva interacción */}
      <form onSubmit={handleAgregar} className="flex flex-col gap-3 bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-semibold text-navy">Registrar nueva interacción</p>
        <select
          value={tipoContacto}
          onChange={(e) => setTipoContacto(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
        >
          {TIPOS_CONTACTO.map(t => <option key={t}>{t}</option>)}
        </select>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe qué se habló o hizo..."
          rows={2}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy resize-none"
        />
        <input
          type="text"
          value={proximoPaso}
          onChange={(e) => setProximoPaso(e.target.value)}
          placeholder="Próximo paso (opcional, genera recordatorio)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
        {proximoPaso.trim() && (
          <input
            type="date"
            value={fechaLimitePaso}
            onChange={(e) => setFechaLimitePaso(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
          />
        )}
        <button type="submit" className="bg-golden text-white font-semibold py-2 rounded-lg hover:bg-golden-light transition-colors text-sm">
          Agregar al historial
        </button>
      </form>

      <button
        onClick={() => onEliminar(prospecto.id)}
        className="text-red-500 text-xs font-semibold hover:text-red-700 mt-1"
      >
        Eliminar prospecto
      </button>
    </div>
  )
}