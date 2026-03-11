import { Link } from "react-router-dom"

const links = [
  { name: "Inicio", path: "/" },
  { name: "Servicios", path: "/servicios" },
  { name: "Galería", path: "/galeria" },
  { name: "Acerca de", path: "/acerca-de" },
  { name: "Cotización", path: "/cotizacion" },
  { name: "Rastrear pedido", path: "/rastreo" },
  { name: "Contacto", path: "/contacto" },
]

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Columna 1 */}
        <div>
          <p className="text-2xl font-bold text-white mb-3">DECORA</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empresa especializada en tapicería y reparación de muebles para el
            hogar en Cancún, Quintana Roo.
          </p>
        </div>

        {/* Columna 2 */}
        <div>
          <p className="text-golden font-semibold uppercase tracking-wide text-sm mb-4">
            Enlaces
          </p>
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <p className="text-golden font-semibold uppercase tracking-wide text-sm mb-4">
            Contacto
          </p>
          <ul className="flex flex-col gap-2 text-gray-400 text-sm">
            <li>📍 SMZ. 31 MZA. 7 No. 27, Cancún, Q. Roo</li>
            <li>📞 +52 998 860 0619</li>
            <li>✉️ decora.servicio@gmail.com</li>
            <li>🕐 Lunes a Sábado 9:00 AM – 6:00 PM</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-500 text-xs">
        © 2026 DECORA. Todos los derechos reservados.
      </div>
    </footer>
  )
}