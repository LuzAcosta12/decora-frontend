import { Link, useLocation, useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"

const linksOperativos = [
  { name: "Dashboard",   path: "/admin/dashboard",   icon: "📊" },
  { name: "Cotizaciones",path: "/admin/cotizaciones", icon: "📋" },
  { name: "Pedidos",     path: "/admin/pedidos",      icon: "📦" },
  { name: "Reportes",    path: "/admin/reportes",     icon: "📈" },
  { name: "Mensajes",    path: "/admin/mensajes",     icon: "✉️" },
  { name: "Galería",     path: "/admin/galeria",      icon: "🖼️" },
  { name: "Servicios",   path: "/admin/servicios",    icon: "🛠️" },
  { name: "Acerca de",   path: "/admin/acerca-de",    icon: "ℹ️" },
]

const linksComerciales = [
  { name: "Asesorías",     path: "/admin/asesorias",     icon: "💬" },
  { name: "Pipeline",      path: "/admin/prospectos",    icon: "🗂️" },
  { name: "Clientes",      path: "/admin/clientes",      icon: "👥" },
  { name: "Opiniones",     path: "/admin/opiniones",     icon: "⭐" },
  { name: "Campañas",      path: "/admin/campanas",      icon: "🏷️" },
  { name: "Recordatorios", path: "/admin/recordatorios", icon: "⏰", badge: true },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, recordatoriosPendientesCount } = useApp()

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  const renderLink = (link) => (
    <Link
      key={link.path}
      to={link.path}
      className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        location.pathname === link.path
          ? "bg-golden text-white"
          : "text-gray-300 hover:bg-navy-light hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="w-4 text-center">{link.icon}</span>
        {link.name}
      </span>
      {link.badge && recordatoriosPendientesCount > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
          {recordatoriosPendientesCount}
        </span>
      )}
    </Link>
  )

  return (
    <aside className="bg-navy h-screen flex flex-col fixed left-0 top-0 w-60">

      {/* Encabezado — fijo, no se mueve */}
      <div className="px-6 py-5 border-b border-navy-light shrink-0">
        <p className="text-white text-xl font-bold">DECORA</p>
        <p className="text-gray-400 text-xs mt-1">Panel Administrativo</p>
      </div>

      {/* Lista de enlaces — tiene su propio scroll independiente si no caben */}
      <nav className="flex flex-col gap-0.5 px-3 py-3 flex-1 min-h-0 overflow-y-auto">
        {linksOperativos.map(renderLink)}

        <p className="text-gray-500 text-xs uppercase tracking-widest px-4 mt-3 mb-1">Comercial</p>
        {linksComerciales.map(renderLink)}
      </nav>

      {/* Cerrar sesión — siempre visible, fuera del área con scroll */}
      <div className="px-3 py-3 border-t border-navy-light shrink-0">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}