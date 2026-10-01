import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useApp } from "../../context/AppContext"

const tiposMueble = [
  { id: 1, nombre: "Sala",           icono: "🛋️" },
  { id: 2, nombre: "Sillas",         icono: "🪑" },
  { id: 3, nombre: "Cabecera/cama",  icono: "🛏️" },
  { id: 4, nombre: "Otro mueble",    icono: "🔧" },
]

export default function AsesoriaPublica() {
  const { crearAsesoria } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    tipoMueble: "",
    presupuestoAprox: "",
    descripcion: "",
    nombre: "",
    correo: "",
    telefono: "",
  })
  const [enviado, setEnviado] = useState(false)
  const [asesoriaCreada, setAsesoriaCreada] = useState(null)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.tipoMueble) {
      setError("Selecciona el tipo de mueble para continuar.")
      return
    }
    if (!form.nombre.trim()) {
      setError("Cuéntanos tu nombre para poder ayudarte.")
      return
    }
    if (!form.telefono.trim() && !form.correo.trim()) {
      setError("Déjanos al menos un teléfono o correo para poder contactarte con la orientación.")
      return
    }

    setError("")
    const nueva = crearAsesoria(form)
    setAsesoriaCreada(nueva)
    setEnviado(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Asesoría gratuita
          </p>
          <h1 className="text-4xl font-bold">Cuéntanos tu idea, sin compromiso</h1>
          <p className="text-gray-300 mt-4 text-lg">
            No necesitas crear una cuenta. Solo cuéntanos qué tienes en mente y
            cómo contactarte para darte orientación personalizada.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6 flex-1">
        <div className="max-w-2xl mx-auto">

          {!enviado ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 flex flex-col gap-6">

              <div>
                <p className="text-sm font-semibold text-navy mb-3">¿Qué tipo de mueble te interesa? *</p>
                <div className="grid grid-cols-2 gap-3">
                  {tiposMueble.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, tipoMueble: t.nombre }))}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors ${
                        form.tipoMueble === t.nombre
                          ? "border-golden bg-golden/10"
                          : "border-gray-200 hover:border-navy"
                      }`}
                    >
                      <span className="text-3xl">{t.icono}</span>
                      <span className="text-sm font-semibold text-navy">{t.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-navy mb-2 block">Presupuesto aproximado (opcional)</label>
                <input
                  type="number"
                  name="presupuestoAprox"
                  value={form.presupuestoAprox}
                  onChange={handleChange}
                  placeholder="Ej. 3000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-navy mb-2 block">Cuéntanos tu idea o el estado actual del mueble *</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Ej. Tengo un sillón individual con el tapiz muy gastado, me gustaría cambiarlo a un tono gris..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy resize-none"
                />
              </div>

              <hr />

              <p className="text-xs text-gray-400 -mb-2">
                Tus datos de contacto — nos ayudan a comunicarte la orientación directamente.
              </p>
              <div>
                <label className="text-sm font-semibold text-navy mb-2 block">Nombre *</label>
                <input
                  type="text" name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="¿Cómo te llamas?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Teléfono / WhatsApp</label>
                  <input
                    type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                    placeholder="+52 998 000 0000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Correo electrónico</label>
                  <input
                    type="email" name="correo" value={form.correo} onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 -mt-2">Déjanos al menos uno de los dos.</p>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                className="bg-navy text-white font-bold py-4 rounded-lg hover:bg-navy-light transition-colors"
              >
                Solicitar asesoría
              </button>
            </form>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <span className="text-6xl">✅</span>
              <h2 className="text-2xl font-bold text-navy mt-4">¡Solicitud recibida!</h2>
              <p className="text-gray-500 mt-2">
                Guarda este código, te servirá para consultar el estado de tu asesoría.
              </p>
              <div className="bg-navy text-golden text-2xl font-bold tracking-widest rounded-xl py-5 mt-6">
                {asesoriaCreada.codigoSeguimiento}
              </div>
              <div className="flex flex-col md:flex-row gap-3 mt-8">
                <button
                  onClick={() => navigate("/asesoria/seguimiento")}
                  className="flex-1 border-2 border-navy text-navy font-bold py-3 rounded-lg hover:bg-navy hover:text-white transition-colors"
                >
                  Consultar estado
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-golden text-white font-bold py-3 rounded-lg hover:bg-golden-light transition-colors"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}