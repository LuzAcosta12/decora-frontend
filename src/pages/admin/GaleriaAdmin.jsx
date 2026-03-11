import Sidebar from "../../components/Sidebar"
import { useState } from "react"

const trabajosEjemplo = [
  { id: 1, nombre: "Tapiceria de sala completa", categoria: "Tapiceria" },
  { id: 2, nombre: "Sillas de comedor retapizadas", categoria: "Tapiceria" },
  { id: 3, nombre: "Cabecera de cama personalizada", categoria: "Cabeceras" },
  { id: 4, nombre: "Instalacion de papel tapiz", categoria: "Decoracion" },
  { id: 5, nombre: "Alfombra de sala", categoria: "Alfombras" },
  { id: 6, nombre: "Cojines personalizados", categoria: "Textiles" },
]

export default function GaleriaAdmin() {
  const [trabajos, setTrabajos] = useState(trabajosEjemplo)
  const [modalAgregar, setModalAgregar] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [form, setForm] = useState({ nombre: "", categoria: "" })

  const handleAgregar = () => {
    if (!form.nombre || !form.categoria) return
    const nuevo = { id: Date.now(), nombre: form.nombre, categoria: form.categoria }
    setTrabajos([...trabajos, nuevo])
    setForm({ nombre: "", categoria: "" })
    setModalAgregar(false)
  }

  const handleEliminar = (id) => {
    setTrabajos(trabajos.filter((t) => t.id !== id))
    setConfirmarEliminar(null)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Galeria</h1>
            <p className="text-gray-500 text-sm mt-1">Administra los trabajos mostrados en el sitio publico</p>
          </div>
          <button
            onClick={() => setModalAgregar(true)}
            className="bg-navy text-white font-bold px-5 py-3 rounded-lg hover:bg-navy-light transition-colors"
          >
            Agregar trabajo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trabajos.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-navy h-40 flex items-center justify-center">
                <span className="text-6xl">🛋️</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy text-sm">{t.nombre}</p>
                  <span className="text-xs text-golden font-semibold">{t.categoria}</span>
                </div>
                <button
                  onClick={() => setConfirmarEliminar(t.id)}
                  className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {modalAgregar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy text-lg">Agregar trabajo</h2>
                <button onClick={() => setModalAgregar(false)} className="text-gray-400 hover:text-navy font-bold">X</button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Nombre del trabajo *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej. Tapiceria de sala en terciopelo"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Categoria *</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy"
                  >
                    <option value="">Selecciona una categoria</option>
                    <option>Tapiceria</option>
                    <option>Cabeceras</option>
                    <option>Decoracion</option>
                    <option>Alfombras</option>
                    <option>Textiles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Imagen (proximamente)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400 text-sm">
                    Subir imagen del trabajo
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalAgregar(false)} className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-2 rounded-lg">Cancelar</button>
                <button onClick={handleAgregar} className="flex-1 bg-navy text-white font-bold py-2 rounded-lg hover:bg-navy-light">Agregar</button>
              </div>
            </div>
          </div>
        )}

        {confirmarEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
              <span className="text-5xl">⚠️</span>
              <h2 className="font-bold text-navy text-lg mt-4">Eliminar trabajo?</h2>
              <p className="text-gray-500 text-sm mt-2">Esta accion no se puede deshacer.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setConfirmarEliminar(null)} className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-2 rounded-lg">Cancelar</button>
                <button onClick={() => handleEliminar(confirmarEliminar)} className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700">Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}