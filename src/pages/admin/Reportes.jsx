import Sidebar from "../../components/Sidebar"
import { useState, useMemo } from "react"
import { useApp } from "../../context/AppContext"
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const badgeEstado = (estado) => {
  if (estado === "Pendiente")      return "bg-red-100 text-red-600"
  if (estado === "En produccion")  return "bg-yellow-100 text-yellow-700"
  if (estado === "Finalizado")     return "bg-green-100 text-green-700"
  if (estado === "Entregado")      return "bg-blue-100 text-blue-700"
  return "bg-gray-100 text-gray-500"
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export default function Reportes() {
  const { pedidos, cotizaciones, estadisticas } = useApp()

  const [desde, setDesde] = useState("2026-01-01")
  const [hasta, setHasta] = useState("2026-12-31")
  const [filtroAplicado, setFiltroAplicado] = useState({ desde: "2026-01-01", hasta: "2026-12-31" })

  // Pedidos filtrados por rango de fecha
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter(p => {
      if (!p.fecha) return true
      return p.fecha >= filtroAplicado.desde && p.fecha <= filtroAplicado.hasta
    })
  }, [pedidos, filtroAplicado])

  // Pedidos por mes para la gráfica de barras
  const pedidosPorMes = useMemo(() => {
    const conteo = new Array(12).fill(0)
    pedidosFiltrados.forEach(p => {
      if (p.fecha) {
        const mes = parseInt(p.fecha.split("-")[1]) - 1
        conteo[mes]++
      }
    })
    return conteo
  }, [pedidosFiltrados])

  // Servicios más solicitados para la gráfica de dona
  const serviciosConteo = useMemo(() => {
    const mapa = {}
    pedidosFiltrados.forEach(p => {
      const s = p.servicio || "Otro"
      mapa[s] = (mapa[s] || 0) + 1
    })
    return mapa
  }, [pedidosFiltrados])

  const serviciosLabels = Object.keys(serviciosConteo)
  const serviciosData   = Object.values(serviciosConteo)
  const coloresDona = ["#1e3a5f","#c9a84c","#3b82f6","#6b7280","#10b981","#f59e0b"]

  // Servicio más solicitado
  const servicioTop = serviciosLabels.length > 0
    ? serviciosLabels.reduce((a, b) => serviciosConteo[a] >= serviciosConteo[b] ? a : b)
    : "Sin datos"

  // Ingresos del periodo filtrado
  const ingresosPeriodo = pedidosFiltrados.reduce((acc, p) => acc + (p.costo || 0), 0)

  const metricas = [
    { label: "Pedidos en el periodo",    valor: pedidosFiltrados.length,              icono: "📦" },
    { label: "Entregados",               valor: pedidosFiltrados.filter(p => p.estado === "Entregado").length, icono: "✅" },
    { label: "Ingresos del periodo",     valor: `$${ingresosPeriodo.toLocaleString()}`, icono: "💰" },
    { label: "Servicio más solicitado",  valor: servicioTop,                           icono: "🛋️" },
  ]

  const datosBarras = {
    labels: MESES,
    datasets: [{
      label: "Pedidos",
      data: pedidosPorMes,
      backgroundColor: "#1e3a5f",
      borderRadius: 6,
    }],
  }

  const datosDona = serviciosLabels.length > 0
    ? {
        labels: serviciosLabels,
        datasets: [{
          data: serviciosData,
          backgroundColor: coloresDona.slice(0, serviciosLabels.length),
          borderWidth: 0,
        }],
      }
    : {
        labels: ["Sin pedidos"],
        datasets: [{ data: [1], backgroundColor: ["#e5e7eb"], borderWidth: 0 }],
      }

  const opcionesBarras = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f3f4f6" } },
      x: { grid: { display: false } },
    },
  }

  const opcionesDona = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Reportes</h1>
          <p className="text-gray-500 text-sm mt-1">Análisis de pedidos e ingresos del periodo</p>
        </div>

        {/* Filtro fechas */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
            />
          </div>
          <button
            onClick={() => setFiltroAplicado({ desde, hasta })}
            className="border-2 border-navy text-navy font-semibold px-5 py-2 rounded-lg hover:bg-navy hover:text-white transition-colors text-sm"
          >
            Aplicar filtro
          </button>
          <button
            onClick={() => {
              setDesde("2026-01-01")
              setHasta("2026-12-31")
              setFiltroAplicado({ desde: "2026-01-01", hasta: "2026-12-31" })
            }}
            className="text-gray-400 text-sm hover:text-navy transition-colors"
          >
            Limpiar
          </button>
        </div>

        {/* Métricas reales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metricas.map((m, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-2xl">{m.icono}</p>
              <p className="text-xl font-bold text-navy mt-2">{m.valor}</p>
              <p className="text-xs text-gray-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Gráficas con datos reales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-navy mb-4">Pedidos por mes</h2>
            <Bar data={datosBarras} options={opcionesBarras} />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-navy mb-4">Servicios más solicitados</h2>
            {serviciosLabels.length === 0
              ? <p className="text-gray-400 text-sm text-center py-10">No hay pedidos en el periodo</p>
              : <Doughnut data={datosDona} options={opcionesDona} />
            }
          </div>
        </div>

        {/* Tabla de pedidos del periodo */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Detalle del periodo</h2>
            <p className="text-xs text-gray-400">{pedidosFiltrados.length} pedidos encontrados</p>
          </div>

          {pedidosFiltrados.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">
              No hay pedidos en el rango de fechas seleccionado
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-navy font-semibold">Código</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Cliente</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Servicio</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Costo</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Estado</th>
                    <th className="text-left py-3 px-2 text-navy font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-bold text-navy">{p.id}</td>
                      <td className="py-3 px-2 text-gray-700">{p.cliente}</td>
                      <td className="py-3 px-2 text-gray-500">{p.servicio}</td>
                      <td className="py-3 px-2 font-semibold text-navy">${p.costo?.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeEstado(p.estado)}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-400">{p.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}