import { Link, useLocation, useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"

const links = [
  { name: "Dashboard",   path: "/admin/dashboard",   icon: "📊" },
  { name: "Cotizaciones",path: "/admin/cotizaciones", icon: "📋" },
  { name: "Pedidos",     path: "/admin/pedidos",      icon: "📦" },
  { name: "Reportes",    path: "/admin/reportes",     icon: "📈" },
  { name: "Mensajes",    path: "/admin/mensajes",     icon: "✉️" },
  { name: "Galería",     path: "/admin/galeria",      icon: "🖼️" },
  { name: "Servicios",   path: "/admin/servicios",    icon: "🛠️" },
  { name: "Acerca de",   path: "/admin/acerca-de",    icon: "ℹ️" },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useApp()

  const handleLogout = () => {
    logout()               // limpia el token en el Context y localStorage
    navigate("/admin/login")
  }

  return (
    <aside className="bg-navy min-h-screen w-60 flex flex-col fixed left-0 top-0">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-navy-light">
        <p className="text-white text-xl font-bold">DECORA</p>
        <p className="text-gray-400 text-xs mt-1">Panel Administrativo</p>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === link.path
                ? "bg-golden text-white"
                : "text-gray-300 hover:bg-navy-light hover:text-white"
            }`}
          >
            <span>{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="px-3 py-4 border-t border-navy-light">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-3 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}