import Sidebar from "../../components/Sidebar"
import { useState } from "react"
import { useApp } from "../../context/AppContext"

export default function Mensajes() {
  const { mensajes, eliminarMensajePermanente } = useApp()

  const [busqueda,          setBusqueda]          = useState("")
  const [modalMensaje,      setModalMensaje]      = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)

  const filtrados = mensajes.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.correo.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleEliminar = () => {
    eliminarMensajePermanente(confirmarEliminar)
    if (modalMensaje?.id === confirmarEliminar) setModalMensaje(null)
    setConfirmarEliminar(null)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Mensajes de contacto</h1>
          <p className="text-gray-500 text-sm mt-1">Mensajes recibidos desde el formulario de contacto</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-5">
            <input type="text" placeholder="Buscar por nombre o correo..."
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-navy font-semibold">Nombre</th>
                  <th className="text-left py-3 px-2 text-navy font-semibold">Correo</th>
                  <th className="text-left py-3 px-2 text-navy font-semibold">Teléfono</th>
                  <th className="text-left py-3 px-2 text-navy font-semibold">Mensaje</th>
                  <th className="text-left py-3 px-2 text-navy font-semibold">Fecha</th>
                  <th className="text-left py-3 px-2 text-navy font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">No hay mensajes</td>
                  </tr>
                ) : (
                  filtrados.map((m) => (
                    <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-semibold text-navy">{m.nombre}</td>
                      <td className="py-3 px-2 text-gray-500">{m.correo}</td>
                      <td className="py-3 px-2 text-gray-500">{m.telefono || "No proporcionado"}</td>
                      <td className="py-3 px-2 text-gray-500 max-w-xs truncate">{m.mensaje}</td>
                      <td className="py-3 px-2 text-gray-400">{m.fecha}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button onClick={() => setModalMensaje(m)}
                            className="bg-navy text-white text-xs px-3 py-1 rounded-lg hover:bg-navy-light transition-colors">
                            Ver
                          </button>
                          <button onClick={() => setConfirmarEliminar(m.id)}
                            className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200 transition-colors">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal ver mensaje */}
        {modalMensaje && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy text-lg">Mensaje de {modalMensaje.nombre}</h2>
                <button onClick={() => setModalMensaje(null)} className="text-gray-400 hover:text-navy text-xl font-bold">✕</button>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Correo</p>
                  <p className="font-semibold text-navy">{modalMensaje.correo}</p>
                </div>
                <div>
                  <p className="text-gray-400">Teléfono</p>
                  <p className="font-semibold text-navy">{modalMensaje.telefono || "No proporcionado"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Fecha</p>
                  <p className="font-semibold text-navy">{modalMensaje.fecha}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Mensaje</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{modalMensaje.mensaje}</p>
                </div>
              </div>
              <button onClick={() => setModalMensaje(null)}
                className="mt-6 w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal confirmar eliminar */}
        {confirmarEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
              <span className="text-5xl">⚠️</span>
              <h2 className="font-bold text-navy text-lg mt-4">¿Eliminar este mensaje?</h2>
              <p className="text-gray-500 text-sm mt-2">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setConfirmarEliminar(null)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={handleEliminar}
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}