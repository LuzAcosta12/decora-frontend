import Sidebar from "../../components/Sidebar"
import { useState } from "react"

export default function AcercaDeAdmin() {
  const [form, setForm] = useState({
    titulo: "Sobre DECORA",
    descripcion: "DECORA inicio operaciones el 10 de mayo de 1988 en la ciudad de Cancun, Quintana Roo, fundada por el C. Jose Brigido Tun Tamayo, quien comenzo realizando trabajos de reparacion basica de muebles tapizados de manera independiente.",
    mision: "Brindar servicios de reparacion y restauracion de tapiceria para muebles del hogar, ofreciendo atencion directa al cliente y soluciones acordes a sus necesidades, con el proposito de prolongar la vida util del mobiliario y asegurar la calidad en cada servicio.",
    vision: "Ser una empresa reconocida a nivel local por la calidad y confiabilidad de sus servicios de tapiceria, consolidando procesos organizados de atencion y control de pedidos que permitan mejorar la administracion del trabajo y la satisfaccion del cliente.",
  })
  const [guardado, setGuardado] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setGuardado(false)
  }

  const handleGuardar = () => {
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Acerca de</h1>
            <p className="text-gray-500 text-sm mt-1">Edita el contenido de la pagina publica de Acerca de</p>
          </div>
          <a
            href="/acerca-de"
            target="_blank"
            rel="noreferrer"
            className="border-2 border-navy text-navy font-semibold px-5 py-2 rounded-lg hover:bg-navy hover:text-white transition-colors text-sm"
          >
            Ver pagina publica
          </a>
        </div>

        {guardado && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
            Cambios guardados correctamente.
          </div>
        )}

        <div className="flex flex-col gap-6 max-w-3xl">

          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-semibold text-navy mb-1">Titulo de la pagina</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-semibold text-navy mb-1">Historia de la empresa</label>
            <p className="text-xs text-gray-400 mb-2">Este texto aparece en la seccion principal de la pagina.</p>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy resize-none"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-semibold text-navy mb-1">Mision</label>
            <p className="text-xs text-gray-400 mb-2">Describe el proposito principal de DECORA.</p>
            <textarea
              name="mision"
              value={form.mision}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy resize-none"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-semibold text-navy mb-1">Vision</label>
            <p className="text-xs text-gray-400 mb-2">Describe hacia donde se dirige DECORA en el futuro.</p>
            <textarea
              name="vision"
              value={form.vision}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGuardar}
              className="bg-navy text-white font-bold px-8 py-3 rounded-lg hover:bg-navy-light transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}