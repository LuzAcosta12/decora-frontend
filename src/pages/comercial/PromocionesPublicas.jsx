import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useApp } from "../../context/AppContext"

function diasRestantes(fechaFin) {
  const hoy = new Date()
  const fin = new Date(fechaFin)
  const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export default function PromocionesPublicas() {
  const { campanasActivas } = useApp()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Promociones vigentes
          </p>
          <h1 className="text-4xl font-bold">Aprovecha nuestras ofertas activas</h1>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6 flex-1">
        <div className="max-w-5xl mx-auto">
          {campanasActivas.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No hay promociones activas por el momento. Vuelve pronto.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campanasActivas.map((c) => (
                <div key={c.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-golden text-white px-6 py-4 flex items-center justify-between">
                    <p className="font-bold text-lg">{c.nombre}</p>
                    <p className="text-2xl font-bold">{c.porcentajeDescuento}% OFF</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{c.descripcion}</p>
                    <p className="text-xs text-gray-400 mb-1">Aplica en</p>
                    <p className="font-semibold text-navy mb-4">{c.servicioAplicable}</p>
                    <div className="flex items-center justify-between">
                      <div className="bg-navy text-golden text-sm font-bold tracking-widest rounded-lg px-4 py-2">
                        {c.codigoPromo}
                      </div>
                      <p className="text-xs text-red-500 font-semibold">
                        {diasRestantes(c.fechaFin)} día(s) restantes
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}