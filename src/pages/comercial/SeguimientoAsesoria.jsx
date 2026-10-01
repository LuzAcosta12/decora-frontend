import { useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useApp } from "../../context/AppContext"

const badgeEstado = (estado) => {
  if (estado === "Nueva")       return "bg-blue-100 text-blue-700"
  if (estado === "Contactado")  return "bg-yellow-100 text-yellow-700"
  if (estado === "Convertida")  return "bg-green-100 text-green-700"
  return "bg-gray-100 text-gray-500" // Descartada
}

export default function SeguimientoAsesoria() {
  const { buscarAsesoriaPorCodigo } = useApp()

  const [codigo, setCodigo] = useState("")
  const [estadoUI, setEstadoUI] = useState("vacio") // "vacio"|"encontrado"|"noEncontrado"
  const [asesoria, setAsesoria] = useState(null)

  const handleBuscar = () => {
    const trimmed = codigo.trim()
    if (!trimmed) return
    const encontrada = buscarAsesoriaPorCodigo(trimmed)
    if (encontrada) {
      setAsesoria(encontrada)
      setEstadoUI("encontrado")
    } else {
      setAsesoria(null)
      setEstadoUI("noEncontrado")
    }
  }

  const handleKeyDown = (e) => { if (e.key === "Enter") handleBuscar() }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Seguimiento de asesoría
          </p>
          <h1 className="text-4xl font-bold">Consulta el estado de tu solicitud</h1>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6 flex-1">
        <div className="max-w-2xl mx-auto">

          <div className="flex gap-3 mb-10">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Ej. ASE-2026-4821"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy uppercase"
            />
            <button
              onClick={handleBuscar}
              className="bg-navy text-white font-bold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors"
            >
              Consultar
            </button>
          </div>

          {estadoUI === "vacio" && (
            <div className="text-center py-16">
              <span className="text-7xl">💬</span>
              <p className="text-gray-400 mt-4 text-lg">Ingresa tu código para ver el estado de tu asesoría</p>
            </div>
          )}

          {estadoUI === "noEncontrado" && (
            <div className="text-center py-16">
              <span className="text-7xl">❌</span>
              <h3 className="text-xl font-bold text-navy mt-4">Código no encontrado</h3>
              <p className="text-gray-500 mt-2">Verifica que esté escrito correctamente.</p>
              <a href="/contacto" className="mt-6 inline-block bg-navy text-white font-bold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors">
                Ir a contacto
              </a>
            </div>
          )}

          {estadoUI === "encontrado" && asesoria && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Código de asesoría</p>
                  <h2 className="text-2xl font-bold text-navy mt-1">{asesoria.codigoSeguimiento}</h2>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${badgeEstado(asesoria.estado)}`}>
                  {asesoria.estado}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <p className="text-gray-400">Tipo de mueble</p>
                  <p className="font-semibold text-navy">{asesoria.tipoMueble}</p>
                </div>
                {asesoria.presupuestoAprox && (
                  <div>
                    <p className="text-gray-400">Presupuesto aproximado</p>
                    <p className="font-semibold text-navy">${Number(asesoria.presupuestoAprox).toLocaleString()} MXN</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-navy mb-2">Tu descripción</p>
                <p className="text-gray-600 text-sm leading-relaxed">{asesoria.descripcion}</p>
              </div>

              {asesoria.estado === "Convertida" && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-center">
                  <p className="text-sm font-semibold text-green-700">
                    ¡Tu asesoría ya fue convertida en cotización! Nuestro equipo se pondrá en contacto contigo.
                  </p>
                </div>
              )}

              {asesoria.estado === "Descartada" && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-center">
                  <p className="text-sm text-gray-500">Esta solicitud fue cerrada. Contáctanos si quieres retomarla.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}