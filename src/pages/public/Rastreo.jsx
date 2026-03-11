import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useState } from "react"
import { useApp } from "../../context/AppContext"

const estadosProgreso = [
  { id: 1, nombre: "Pendiente",     icono: "📋" },
  { id: 2, nombre: "En produccion", icono: "🔧" },
  { id: 3, nombre: "Finalizado",    icono: "✅" },
  { id: 4, nombre: "Entregado",     icono: "📦" },
]

function estadoAIndice(estado) {
  const idx = estadosProgreso.findIndex(e => e.nombre === estado)
  return idx >= 0 ? idx + 1 : 1
}

// Oculta parte del nombre por privacidad: "Juan Perez" → "Ju** Pe***"
function ocultarNombre(nombre) {
  return nombre.split(" ").map(p =>
    p.length <= 2 ? p : p.slice(0, 2) + "*".repeat(p.length - 2)
  ).join(" ")
}

export default function Rastreo() {
  const { buscarPedidoPorCodigo } = useApp()

  const [codigo,   setCodigo]   = useState("")
  const [estadoUI, setEstadoUI] = useState("vacio")  // "vacio"|"encontrado"|"noEncontrado"
  const [pedido,   setPedido]   = useState(null)

  const handleBuscar = () => {
    const trimmed = codigo.trim()
    if (!trimmed) return

    const encontrado = buscarPedidoPorCodigo(trimmed)
    if (encontrado) {
      setPedido(encontrado)
      setEstadoUI("encontrado")
    } else {
      setPedido(null)
      setEstadoUI("noEncontrado")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBuscar()
  }

  const indiceActual = pedido ? estadoAIndice(pedido.estado) : 1

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Portal de clientes
          </p>
          <h1 className="text-4xl font-bold">Consulta el estado de tu pedido</h1>
          <p className="text-gray-300 mt-4 text-lg">
            Ingresa el código único que te compartió el equipo de DECORA
            para ver el progreso en tiempo real.
          </p>
        </div>
      </section>

      {/* Buscador */}
      <section className="bg-gray-50 py-20 px-6 flex-1">
        <div className="max-w-2xl mx-auto">

          <div className="flex gap-3 mb-10">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Ej. DEC-2026-X7K9"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy uppercase"
            />
            <button
              onClick={handleBuscar}
              className="bg-navy text-white font-bold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors"
            >
              Consultar pedido
            </button>
          </div>

          {/* Estado: vacío */}
          {estadoUI === "vacio" && (
            <div className="text-center py-16">
              <span className="text-7xl">📦</span>
              <p className="text-gray-400 mt-4 text-lg">
                Ingresa tu código para ver el estado de tu pedido
              </p>
            </div>
          )}

          {/* Estado: no encontrado */}
          {estadoUI === "noEncontrado" && (
            <div className="text-center py-16">
              <span className="text-7xl">❌</span>
              <h3 className="text-xl font-bold text-navy mt-4">Código no encontrado</h3>
              <p className="text-gray-500 mt-2">
                No encontramos un pedido con ese código. Verifica que esté
                escrito correctamente o contacta a DECORA.
              </p>
              <a
                href="/contacto"
                className="mt-6 inline-block bg-navy text-white font-bold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors"
              >
                Ir a contacto
              </a>
            </div>
          )}

          {/* Estado: encontrado */}
          {estadoUI === "encontrado" && pedido && (
            <div className="bg-white rounded-xl shadow-md p-8">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Pedido registrado</p>
                  <h2 className="text-2xl font-bold text-navy mt-1">{pedido.id}</h2>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  pedido.estado === "Entregado"      ? "bg-blue-100 text-blue-700"   :
                  pedido.estado === "Finalizado"     ? "bg-green-100 text-green-700" :
                  pedido.estado === "En produccion"  ? "bg-yellow-100 text-yellow-700" :
                                                       "bg-gray-100 text-gray-500"
                }`}>
                  {pedido.estado}
                </span>
              </div>

              {/* Aviso especial si está en Pendiente */}
              {pedido.estado === "Pendiente" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
                  <span className="text-xl mt-0.5">📋</span>
                  <div>
                    <p className="text-sm font-semibold text-navy">Tu pedido ha sido recibido</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Estamos revisando los detalles de tu solicitud. En breve comenzará el proceso de producción y podrás ver el avance aquí.
                    </p>
                  </div>
                </div>
              )}

              {/* Info del pedido */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-400">Cliente</p>
                  <p className="font-semibold text-navy">{ocultarNombre(pedido.cliente)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Servicio</p>
                  <p className="font-semibold text-navy">{pedido.servicio}</p>
                </div>
                <div>
                  <p className="text-gray-400">Entrega estimada</p>
                  <p className="font-semibold text-navy">{pedido.fechaEntrega || "Por confirmar"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Piezas</p>
                  <p className="font-semibold text-navy">{pedido.cantidad || "—"}</p>
                </div>
              </div>

              {/* Desglose de costo */}
              {pedido.costo > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Costo acordado</p>
                    <p className="text-xl font-bold text-navy">${Number(pedido.costo).toLocaleString()} MXN</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Anticipo pagado</p>
                    <p className="text-xl font-bold text-green-600">
                      {pedido.anticipo > 0 ? `$${Number(pedido.anticipo).toLocaleString()} MXN` : "Sin anticipo"}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Restante a pagar</p>
                    <p className="text-xl font-bold text-red-500">
                      ${(Number(pedido.costo) - Number(pedido.anticipo || 0)).toLocaleString()} MXN
                    </p>
                  </div>
                </div>
              )}

              {/* Semáforo de progreso */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-navy mb-4">Progreso actual</p>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0" />
                  <div
                    className="absolute top-5 left-0 h-1 bg-navy z-0 transition-all duration-500"
                    style={{ width: `${((indiceActual - 1) / 3) * 100}%` }}
                  />
                  {estadosProgreso.map((e) => (
                    <div key={e.id} className="flex flex-col items-center z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                        e.id < indiceActual  ? "bg-golden border-golden text-white" :
                        e.id === indiceActual? "bg-navy border-navy text-white" :
                                               "bg-white border-gray-300 text-gray-400"
                      }`}>
                        {e.id < indiceActual ? "✓" : e.icono}
                      </div>
                      <p className={`text-xs mt-2 font-semibold text-center ${e.id === indiceActual ? "text-navy" : "text-gray-400"}`}>
                        {e.nombre}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observaciones del admin */}
              {pedido.observaciones && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-navy mb-2">Observaciones del proyecto</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{pedido.observaciones}</p>
                </div>
              )}

              <div className="text-center">
                <a href="/contacto" className="text-navy text-sm font-semibold hover:text-golden transition-colors">
                  ¿Tienes dudas? Contáctanos
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}