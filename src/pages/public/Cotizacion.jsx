import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useState } from "react"
import { useApp } from "../../context/AppContext"

const tiposServicio = [
  { id: 1, nombre: "Tapiceria de sala",   icono: "🛋️" },
  { id: 2, nombre: "Tapiceria de sillas", icono: "🪑" },
  { id: 3, nombre: "Cabecera de cama",    icono: "🛏️" },
  { id: 4, nombre: "Otro servicio",       icono: "🔧" },
]

const nivelesCalidad = [
  { id: 1, nombre: "Economico",       descripcion: "Materiales básicos funcionales",              icono: "💰" },
  { id: 2, nombre: "Calidad/Precio",  descripcion: "Buen equilibrio entre durabilidad y costo",  icono: "⚖️" },
  { id: 3, nombre: "Alta calidad",    descripcion: "Materiales premium y acabados finos",         icono: "⭐" },
]

const materiales = ["Vinipiel", "Tela de algodon", "Terciopelo", "Cuero", "No lo se aun"]
const tiemposEntrega = ["Estandar (3 a 5 semanas)", "Express (1 a 2 semanas)"]

function calcularEstimado(tipoId, calidadId, cantidad) {
  const base = { 1: 599, 2: 299, 3: 450, 4: 350 }
  const factor = { 1: 1, 2: 1.4, 3: 1.9 }
  const piezas = parseInt(cantidad) || 1
  const min = Math.round((base[tipoId] || 400) * (factor[calidadId] || 1) * piezas)
  const max = Math.round(min * 1.3)
  return { min, max }
}

export default function Cotizacion() {
  const { crearCotizacion } = useApp()

  const [iniciado,   setIniciado]   = useState(false)
  const [paso,       setPaso]       = useState(1)
  const [resultado,  setResultado]  = useState(null)
  const [cotCreada,  setCotCreada]  = useState(null)
  const [enviado,    setEnviado]    = useState(false)

  const [form, setForm] = useState({
    tipoServicio: null,
    tipoServicioNombre: "",
    otroServicio: "",
    calidad: null,
    calidadNombre: "",
    material: "",
    observacionesMaterial: "",
    cantidad: "",
    tiempoEntrega: "",
    observaciones: "",
    nombre: "",
    correo: "",
    telefono: "",
  })

  const handleSelect = (campo, valor, nombre = null) => {
    setForm(prev => ({
      ...prev,
      [campo]: valor,
      ...(nombre ? { [`${campo}Nombre`]: nombre } : {}),
    }))
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Validación por paso antes de avanzar
  const puedeAvanzar = () => {
    if (paso === 1) return !!form.tipoServicio
    if (paso === 2) return !!form.calidad
    if (paso === 3) return !!form.material
    if (paso === 4) return !!form.cantidad && !!form.tiempoEntrega
    if (paso === 5) return !!form.nombre && !!form.correo
    return true
  }

  const handleSiguiente = () => {
    if (!puedeAvanzar()) return
    if (paso < 5) {
      setPaso(paso + 1)
    } else {
      // Calcular estimado y guardar en el Context (llega al admin)
      const est = calcularEstimado(form.tipoServicio, form.calidad, form.cantidad)
      setResultado(est)
      const cot = crearCotizacion(form, est)
      setCotCreada(cot)
    }
  }

  const handleAnterior = () => {
    if (paso > 1) setPaso(paso - 1)
  }

  // Descarga de precotización en texto (PDF real requiere jsPDF — ver TODO)
  const handleDescargarPDF = () => {
    if (!cotCreada || !resultado) return

    /**
     * TODO: Instalar jsPDF para generar PDF real:
     *   npm install jspdf
     *   import jsPDF from "jspdf"
     *   const doc = new jsPDF()
     *   doc.text("Precotización DECORA", 20, 20)
     *   ... agregar campos ...
     *   doc.save(`Cotizacion-${cotCreada.id}.pdf`)
     *
     * Por ahora genera un archivo de texto descargable:
     */
    const contenido = [
      "PRECOTIZACIÓN - DECORA",
      "========================",
      `ID: ${cotCreada.id}`,
      `Fecha: ${cotCreada.fecha}`,
      "",
      "DATOS DEL CLIENTE",
      `Nombre: ${form.nombre}`,
      `Correo: ${form.correo}`,
      form.telefono ? `Teléfono: ${form.telefono}` : "",
      "",
      "DETALLES DEL PROYECTO",
      `Servicio: ${form.tipoServicioNombre}`,
      `Nivel de calidad: ${form.calidadNombre}`,
      `Material: ${form.material}`,
      form.observacionesMaterial ? `Color/acabado: ${form.observacionesMaterial}` : "",
      `Número de piezas: ${form.cantidad}`,
      `Tiempo de entrega: ${form.tiempoEntrega}`,
      form.observaciones ? `Observaciones: ${form.observaciones}` : "",
      "",
      "ESTIMADO DE COSTO",
      `$${resultado.min.toLocaleString()} - $${resultado.max.toLocaleString()} MXN`,
      "",
      "NOTA: Este estimado es referencial. El costo final se define",
      "con el especialista según los detalles específicos del proyecto.",
      "",
      "DECORA | Cancún, Quintana Roo | decora.servicio@gmail.com",
    ].filter(Boolean).join("\n")

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href     = url
    link.download = `Precotizacion-${cotCreada.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleContinuarProceso = () => {
    setEnviado(true)
    // El admin ya puede ver la cotización en /admin/cotizaciones
    // (fue guardada en el Context al llamar crearCotizacion)
  }

  const handleReiniciar = () => {
    setIniciado(false)
    setPaso(1)
    setResultado(null)
    setCotCreada(null)
    setEnviado(false)
    setForm({
      tipoServicio: null, tipoServicioNombre: "",
      otroServicio: "", calidad: null, calidadNombre: "",
      material: "", observacionesMaterial: "",
      cantidad: "", tiempoEntrega: "", observaciones: "",
      nombre: "", correo: "", telefono: "",
    })
  }

  // ── Pantalla de inicio ──────────────────────────────────────────────────────
  if (!iniciado) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-gray-50 py-20 px-6">
          <div className="text-center max-w-xl">
            <span className="text-8xl">🛋️</span>
            <h1 className="text-4xl font-bold text-navy mt-6">
              Calcula el costo aproximado de tu proyecto
            </h1>
            <p className="text-gray-500 mt-4 text-lg">
              Responde algunas preguntas y obtén un estimado en segundos.
            </p>
            <button
              onClick={() => setIniciado(true)}
              className="mt-8 bg-navy text-white font-bold px-10 py-4 rounded-lg hover:bg-navy-light transition-colors text-lg"
            >
              Comenzar cotización
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50 py-12 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Barra de progreso */}
          {!resultado && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-navy">Progreso de cotización</p>
                <p className="text-sm text-gray-500">Paso {paso} de 5</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-navy h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(paso / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-8">

            {/* ── RESULTADO FINAL ── */}
            {resultado ? (
              <div className="text-center">
                {!enviado ? (
                  <>
                    <span className="text-6xl">🎉</span>
                    <h2 className="text-2xl font-bold text-navy mt-4">
                      El costo estimado de tu proyecto es
                    </h2>
                    <p className="text-5xl font-bold text-navy mt-4">
                      ${resultado.min.toLocaleString()} – ${resultado.max.toLocaleString()} MXN
                    </p>
                    <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
                      Este estimado es referencial. El costo final se define con el
                      especialista según los detalles específicos de tu proyecto.
                    </p>
                    {cotCreada && (
                      <p className="text-xs text-gray-400 mt-2">
                        Folio de cotización: <span className="font-bold">{cotCreada.id}</span>
                      </p>
                    )}
                    <div className="flex flex-col gap-3 mt-8">
                      <button
                        onClick={handleDescargarPDF}
                        className="bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors"
                      >
                        Descargar precotización
                      </button>
                      <button
                        onClick={handleContinuarProceso}
                        className="border-2 border-navy text-navy font-bold py-3 rounded-lg hover:bg-navy hover:text-white transition-colors"
                      >
                        Continuar proceso
                      </button>
                      <button
                        onClick={handleReiniciar}
                        className="text-gray-400 text-sm hover:text-navy transition-colors"
                      >
                        Volver al inicio
                      </button>
                    </div>
                  </>
                ) : (
                  /* Pantalla de confirmación de envío */
                  <>
                    <span className="text-6xl">✅</span>
                    <h2 className="text-2xl font-bold text-navy mt-4">
                      ¡Solicitud enviada con éxito!
                    </h2>
                    <p className="text-gray-500 mt-3 max-w-md mx-auto">
                      Tu cotización ha sido recibida. Un especialista de DECORA
                      revisará tu solicitud y se pondrá en contacto contigo pronto.
                    </p>
                    {cotCreada && (
                      <div className="bg-gray-50 rounded-xl px-6 py-4 mt-6 inline-block">
                        <p className="text-sm text-gray-500">Folio de tu cotización</p>
                        <p className="text-2xl font-bold text-navy tracking-wider mt-1">
                          {cotCreada.id}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-4">
                      Cuando tu pedido sea generado recibirás un código para rastrearlo en{" "}
                      <a href="/rastreo" className="text-navy hover:underline">
                        decora.com/rastreo
                      </a>
                    </p>
                    <button
                      onClick={handleReiniciar}
                      className="mt-6 text-gray-400 text-sm hover:text-navy transition-colors"
                    >
                      Hacer otra cotización
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* ── PASOS DEL FORMULARIO ── */
              <div>
                {/* Paso 1: Tipo de servicio */}
                {paso === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-navy mb-2">¿Qué tipo de servicio necesitas?</h2>
                    <p className="text-gray-500 text-sm mb-6">Selecciona la categoría que mejor describe tu proyecto.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {tiposServicio.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleSelect("tipoServicio", t.id, t.nombre)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            form.tipoServicio === t.id
                              ? "border-navy bg-blue-50"
                              : "border-gray-200 hover:border-navy"
                          }`}
                        >
                          <span className="text-4xl">{t.icono}</span>
                          <p className="text-sm font-semibold text-navy mt-2">{t.nombre}</p>
                        </button>
                      ))}
                    </div>
                    {form.tipoServicio === 4 && (
                      <input
                        type="text"
                        name="otroServicio"
                        value={form.otroServicio}
                        onChange={handleChange}
                        placeholder="Describe el servicio que necesitas"
                        className="mt-4 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                      />
                    )}
                  </div>
                )}

                {/* Paso 2: Nivel de calidad */}
                {paso === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-navy mb-2">¿Qué nivel de calidad buscas?</h2>
                    <p className="text-gray-500 text-sm mb-6">Selecciona la opción que mejor se adapte a tu presupuesto.</p>
                    <div className="flex flex-col gap-4">
                      {nivelesCalidad.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleSelect("calidad", n.id, n.nombre)}
                          className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                            form.calidad === n.id
                              ? "border-navy bg-blue-50"
                              : "border-gray-200 hover:border-navy"
                          }`}
                        >
                          <span className="text-3xl">{n.icono}</span>
                          <div>
                            <p className="font-bold text-navy">{n.nombre}</p>
                            <p className="text-gray-500 text-sm">{n.descripcion}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paso 3: Materiales */}
                {paso === 3 && (
                  <div>
                    <h2 className="text-xl font-bold text-navy mb-2">Materiales y acabados</h2>
                    <p className="text-gray-500 text-sm mb-6">Selecciona el tipo de material de tu preferencia.</p>
                    <select
                      name="material"
                      value={form.material}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy mb-4"
                    >
                      <option value="">Selecciona un material</option>
                      {materiales.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <label className="block text-sm font-semibold text-navy mb-1">
                      Color o acabado específico (opcional)
                    </label>
                    <input
                      type="text"
                      name="observacionesMaterial"
                      value={form.observacionesMaterial}
                      onChange={handleChange}
                      placeholder="Ej. Azul marino, textura lisa..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                )}

                {/* Paso 4: Alcance */}
                {paso === 4 && (
                  <div>
                    <h2 className="text-xl font-bold text-navy mb-2">Alcance del proyecto</h2>
                    <p className="text-gray-500 text-sm mb-6">Cuéntanos cuántas piezas y el tiempo que tienes.</p>
                    <label className="block text-sm font-semibold text-navy mb-1">Número de piezas o muebles *</label>
                    <input
                      type="number"
                      name="cantidad"
                      value={form.cantidad}
                      onChange={handleChange}
                      placeholder="Ej. 3"
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy mb-4"
                    />
                    <label className="block text-sm font-semibold text-navy mb-1">Tiempo de entrega esperado *</label>
                    <select
                      name="tiempoEntrega"
                      value={form.tiempoEntrega}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy mb-4"
                    >
                      <option value="">Selecciona una opción</option>
                      {tiemposEntrega.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <label className="block text-sm font-semibold text-navy mb-1">Observaciones adicionales (opcional)</label>
                    <textarea
                      name="observaciones"
                      value={form.observaciones}
                      onChange={handleChange}
                      placeholder="Cualquier detalle adicional de tu proyecto..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy resize-none"
                    />
                  </div>
                )}

                {/* Paso 5: Datos de contacto */}
                {paso === 5 && (
                  <div>
                    <h2 className="text-xl font-bold text-navy mb-2">Tus datos de contacto</h2>
                    <p className="text-gray-500 text-sm mb-6">
                      Necesitamos tus datos para enviarte el resumen de tu cotización.
                    </p>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-1">Nombre completo *</label>
                        <input
                          type="text"
                          name="nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          placeholder="Ej. Juan Pérez"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-1">Correo electrónico *</label>
                        <input
                          type="email"
                          name="correo"
                          value={form.correo}
                          onChange={handleChange}
                          placeholder="ejemplo@correo.com"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-1">Teléfono (opcional)</label>
                        <input
                          type="text"
                          name="telefono"
                          value={form.telefono}
                          onChange={handleChange}
                          placeholder="+52 999 000 0000"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navegación entre pasos */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleAnterior}
                    disabled={paso === 1}
                    className={`px-6 py-3 rounded-lg font-semibold border-2 transition-colors ${
                      paso === 1
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-navy text-navy hover:bg-navy hover:text-white"
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleSiguiente}
                    disabled={!puedeAvanzar()}
                    className="bg-navy text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50"
                  >
                    {paso === 5 ? "Calcular estimación" : "Siguiente"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}