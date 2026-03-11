import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const links = [
  { name: "Inicio", path: "/" },
  { name: "Servicios", path: "/servicios" },
  { name: "Galería", path: "/galeria" },
  { name: "Acerca de", path: "/acerca-de" },
  { name: "Cotización", path: "/cotizacion" },
  { name: "Rastrear pedido", path: "/rastreo" },
  { name: "Contacto", path: "/contacto" },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-navy w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
          DECORA
        </Link>

        {/* Links escritorio */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? "text-golden border-b-2 border-golden pb-1"
                  : "text-white hover:text-golden"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Botón menú móvil */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-navy-dark px-6 pb-4 flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${
                location.pathname === link.path
                  ? "text-golden"
                  : "text-white hover:text-golden"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}