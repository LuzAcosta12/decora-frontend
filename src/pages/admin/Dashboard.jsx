import Sidebar from "../../components/Sidebar"
import { Link } from "react-router-dom"
import { useApp } from "../../context/AppContext"

const accesosRapidos = [
  { nombre: "Cotizaciones", icono: "📋", path: "/admin/cotizaciones", desc: "Ver solicitudes recibidas" },
  { nombre: "Pedidos",      icono: "📦", path: "/admin/pedidos",      desc: "Gestionar pedidos activos" },
  { nombre: "Reportes",     icono: "📊", path: "/admin/reportes",     desc: "Ver estadísticas y gráficas" },
  { nombre: "Mensajes",     icono: "✉️", path: "/admin/mensajes",     desc: "Revisar mensajes de contacto" },
]

const badgeCot = (estado) => {
  if (estado === "Nueva")          return "bg-blue-100 text-blue-700"
  if (estado === "En seguimiento") return "bg-yellow-100 text-yellow-700"
  return "bg-gray-100 text-gray-500"
}

export default function Dashboard() {
  const { cotizaciones, pedidos, mensajes, estadisticas } = useApp()

  // Solo las 3 más recientes de cada lista
  const ultimasCotizaciones = cotizaciones.slice(0, 3)
  const ultimosMensajes     = mensajes.slice(0, 3)

  const metricas = [
    { label: "Pedidos totales",   valor: estadisticas.totalPedidos,                        icono: "📦", color: "bg-blue-50 text-blue-700" },
    { label: "Pendientes",        valor: estadisticas.pendientes,                           icono: "🔄", color: "bg-yellow-50 text-yellow-700" },
    { label: "En producción",     valor: estadisticas.pedidosActivos,                       icono: "🔧", color: "bg-orange-50 text-orange-700" },
    { label: "Terminados",        valor: estadisticas.finalizados,                          icono: "✅", color: "bg-green-50 text-green-700" },
    { label: "Cot. nuevas",       valor: estadisticas.cotizacionesNuevas,                   icono: "🆕", color: "bg-purple-50 text-purple-700" },
    { label: "Ventas acumuladas", valor: `$${estadisticas.ventasAcumuladas.toLocaleString()}`, icono: "💰", color: "bg-emerald-50 text-emerald-700" },
  ]

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Bienvenido al panel administrativo de DECORA</p>
        </div>

        {/* Métricas en tiempo real */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {metricas.map((m, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
              <span className="text-2xl">{m.icono}</span>
              <p className="text-2xl font-bold text-navy">{m.valor}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Accesos rápidos */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-navy mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accesosRapidos.map((a, i) => (
              <Link
                key={i}
                to={a.path}
                className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2 hover:shadow-md transition-shadow border border-gray-100"
              >
                <span className="text-3xl">{a.icono}</span>
                <p className="font-bold text-navy text-sm">{a.nombre}</p>
                <p className="text-xs text-gray-400">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Últimas cotizaciones — datos reales */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy">Últimas cotizaciones</h2>
              <Link to="/admin/cotizaciones" className="text-xs text-golden font-semibold hover:underline">
                Ver todas ({cotizaciones.length})
              </Link>
            </div>

            {ultimasCotizaciones.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No hay cotizaciones aún</p>
            ) : (
              <div className="flex flex-col gap-3">
                {ultimasCotizaciones.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-navy">{c.nombre}</p>
                      <p className="text-xs text-gray-400">{c.servicio} · {c.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-navy">
                        ${c.estimadoMin?.toLocaleString()}
                      </p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeCot(c.estado)}`}>
                        {c.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Últimos mensajes — datos reales */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy">Últimos mensajes</h2>
              <Link to="/admin/mensajes" className="text-xs text-golden font-semibold hover:underline">
                Ver todos ({mensajes.length})
              </Link>
            </div>

            {ultimosMensajes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No hay mensajes aún</p>
            ) : (
              <div className="flex flex-col gap-3">
                {ultimosMensajes.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {m.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{m.nombre}</p>
                        <p className="text-xs text-gray-400">{m.correo}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{m.fecha}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}