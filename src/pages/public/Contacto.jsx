import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useState } from "react"
import { useApp } from "../../context/AppContext"

export default function Contacto() {
  const { agregarMensaje } = useApp()

  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "", mensaje: "" })
  const [enviado, setEnviado] = useState(false)
  const [error,   setError]   = useState("")

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nombre || !form.correo || !form.mensaje) {
      setError("Por favor completa los campos requeridos.")
      return
    }
    setError("")
    agregarMensaje(form)   // guarda en Context → aparece en admin/mensajes
    setEnviado(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Estamos aqui para ayudarte
          </p>
          <h1 className="text-4xl font-bold">Contáctanos</h1>
          <p className="text-gray-300 mt-4 text-lg">
            Compártenos los detalles de tu proyecto y te ayudamos a encontrar
            la mejor solución en tapicería y decoración.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Info de contacto */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Información de contacto</h2>
            <ul className="flex flex-col gap-6">
              {[
                { icono: "📍", titulo: "Dirección",            texto: "SMZ. 31 MZA. 7 No. 27 C.P. 77508, Cancún, Quintana Roo." },
                { icono: "📞", titulo: "Teléfono",             texto: "+52 998 860 0619" },
                { icono: "✉️", titulo: "Correo electrónico",   texto: "decora.servicio@gmail.com" },
                { icono: "🕐", titulo: "Horario de atención",  texto: "Lunes a Sábado 9:00 AM - 6:00 PM" },
              ].map((item) => (
                <li key={item.titulo} className="flex items-start gap-4">
                  <span className="text-2xl">{item.icono}</span>
                  <div>
                    <p className="font-semibold text-navy">{item.titulo}</p>
                    <p className="text-gray-500 text-sm mt-1">{item.texto}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 bg-navy rounded-xl p-6 text-white">
              <p className="font-semibold text-golden mb-2">Antes de enviar tu mensaje</p>
              <ul className="text-sm text-gray-300 flex flex-col gap-2">
                <li>• Describe tu proyecto con el mayor detalle posible</li>
                <li>• Si tienes fotos, menciona que las puedes compartir</li>
                <li>• Te responderemos en menos de 24 horas hábiles</li>
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-xl shadow-md p-8">
            {enviado ? (
              <div className="text-center py-12">
                <span className="text-6xl">✅</span>
                <h3 className="text-xl font-bold text-navy mt-4">Mensaje enviado correctamente</h3>
                <p className="text-gray-500 mt-2">
                  Te contactaremos pronto. Gracias por comunicarte con DECORA.
                </p>
                <button
                  onClick={() => {
                    setEnviado(false)
                    setForm({ nombre: "", correo: "", telefono: "", mensaje: "" })
                  }}
                  className="mt-6 bg-navy text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="text-xl font-bold text-navy">Enviar mensaje</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Nombre completo *</label>
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Correo electrónico *</label>
                  <input type="email" name="correo" value={form.correo} onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Teléfono (opcional)</label>
                  <input type="text" name="telefono" value={form.telefono} onChange={handleChange}
                    placeholder="+52 999 000 0000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Mensaje *</label>
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange}
                    placeholder="Describe tu proyecto o consulta..."
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy resize-none" />
                </div>

                <button type="submit"
                  className="bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors">
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}