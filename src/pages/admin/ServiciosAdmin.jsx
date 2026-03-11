import Sidebar from "../../components/Sidebar"
import { useState } from "react"

const serviciosEjemplo = [
  { id: 1, nombre: "Tapiceria de salas y sillones", descripcion: "Retapizado completo de salas y sillones con materiales de alta durabilidad.", precio: 599 },
  { id: 2, nombre: "Tapiceria de sillas y comedores", descripcion: "Restauracion y retapizado de sillas de comedor, butacas y bancas.", precio: 299 },
  { id: 3, nombre: "Cabeceras de cama", descripcion: "Rehabilitacion y fabricacion de cabeceras tapizadas a medida.", precio: 450 },
  { id: 4, nombre: "Instalacion de papel tapiz", descripcion: "Transformamos cualquier muro con papel tapiz decorativo profesional.", precio: 299 },
  { id: 5, nombre: "Alfombras y tapetes", descripcion: "Venta, instalacion y mantenimiento de alfombras y tapetes decorativos.", precio: 459 },
  { id: 6, nombre: "Cojines y textiles personalizados", descripcion: "Elaboracion de cojines, fundas, cortinas y piezas especiales a medida.", precio: 199 },
]

export default function ServiciosAdmin() {
  const [servicios, setServicios] = useState(serviciosEjemplo)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "" })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleNuevo = () => {
    setEditando(null)
    setForm({ nombre: "", descripcion: "", precio: "" })
    setModal(true)
  }

  const handleEditar = (s) => {
    setEditando(s)
    setForm({ nombre: s.nombre, descripcion: s.descripcion, precio: s.precio })
    setModal(true)
  }

  const handleGuardar = () => {
    if (!form.nombre || !form.descripcion || !form.precio) return
    if (editando) {
      setServicios(servicios.map((s) =>
        s.id === editando.id ? { ...s, ...form, precio: parseFloat(form.precio) } : s
      ))
    } else {
      setServicios([...servicios, { id: Date.now(), ...form, precio: parseFloat(form.precio) }])
    }
    setModal(false)
  }

  const handleEliminar = (id) => {
    setServicios(servicios.filter((s) => s.id !== id))
    setConfirmarEliminar(null)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Servicios</h1>
            <p className="text-gray-500 text-sm mt-1">Administra los servicios mostrados en el sitio publico</p>
          </div>
          <button
            onClick={handleNuevo}
            className="bg-navy text-white font-bold px-5 py-3 rounded-lg hover:bg-navy-light transition-colors"
          >
            Nuevo servicio
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-navy font-semibold">Nombre</th>
                <th className="text-left py-3 px-4 text-navy font-semibold">Descripcion</th>
                <th className="text-left py-3 px-4 text-navy font-semibold">Precio base</th>
                <th className="text-left py-3 px-4 text-navy font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-navy">{s.nombre}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs">{s.descripcion}</td>
                  <td className="py-3 px-4 font-semibold text-golden">Desde ${s.precio}.00 MXN</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditar(s)}
                        className="bg-navy text-white text-xs px-3 py-1 rounded-lg hover:bg-navy-light"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmarEliminar(s.id)}
                        className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy text-lg">
                  {editando ? "Editar servicio" : "Nuevo servicio"}
                </h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-navy font-bold">X</button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Nombre del servicio *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Tapiceria de salas"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Descripcion *</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Describe brevemente el servicio..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Precio base (MXN) *</label>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    placeholder="Ej. 599"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(false)} className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-2 rounded-lg">Cancelar</button>
                <button onClick={handleGuardar} className="flex-1 bg-navy text-white font-bold py-2 rounded-lg hover:bg-navy-light">
                  {editando ? "Guardar cambios" : "Agregar servicio"}
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmarEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
              <span className="text-5xl">⚠️</span>
              <h2 className="font-bold text-navy text-lg mt-4">Eliminar servicio?</h2>
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