import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useApp } from "../context/AppContext"

// Páginas públicas
import Home        from "../pages/public/Home"
import Servicios   from "../pages/public/Servicios"
import Galeria     from "../pages/public/Galeria"
import AcercaDe    from "../pages/public/AcercaDe"
import Contacto    from "../pages/public/Contacto"
import Cotizacion  from "../pages/public/Cotizacion"
import Rastreo     from "../pages/public/Rastreo"

// Páginas admin
import Login          from "../pages/admin/Login"
import Dashboard      from "../pages/admin/Dashboard"
import Cotizaciones   from "../pages/admin/Cotizaciones"
import Pedidos        from "../pages/admin/Pedidos"
import Mensajes       from "../pages/admin/Mensajes"
import GaleriaAdmin   from "../pages/admin/GaleriaAdmin"
import ServiciosAdmin from "../pages/admin/ServiciosAdmin"
import AcercaDeAdmin  from "../pages/admin/AcercaDeAdmin"
import Reportes       from "../pages/admin/Reportes"

/**
 * PrivateRoute — Protege rutas del panel admin.
 * Si el usuario no está autenticado, redirige al login.
 * Cuando Martín integre JWT, esta validación ya está lista para recibirlo.
 */
function PrivateRoute({ children }) {
  const { isAuthenticated } = useApp()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Rutas públicas ── */}
        <Route path="/"           element={<Home />} />
        <Route path="/servicios"  element={<Servicios />} />
        <Route path="/galeria"    element={<Galeria />} />
        <Route path="/acerca-de"  element={<AcercaDe />} />
        <Route path="/contacto"   element={<Contacto />} />
        <Route path="/cotizacion" element={<Cotizacion />} />
        <Route path="/rastreo"    element={<Rastreo />} />

        {/* ── Login (acceso sin auth) ── */}
        <Route path="/admin/login" element={<Login />} />

        {/* ── Rutas admin protegidas ── */}
        <Route path="/admin/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/cotizaciones" element={<PrivateRoute><Cotizaciones /></PrivateRoute>} />
        <Route path="/admin/pedidos"    element={<PrivateRoute><Pedidos /></PrivateRoute>} />
        <Route path="/admin/mensajes"   element={<PrivateRoute><Mensajes /></PrivateRoute>} />
        <Route path="/admin/galeria"    element={<PrivateRoute><GaleriaAdmin /></PrivateRoute>} />
        <Route path="/admin/servicios"  element={<PrivateRoute><ServiciosAdmin /></PrivateRoute>} />
        <Route path="/admin/acerca-de"  element={<PrivateRoute><AcercaDeAdmin /></PrivateRoute>} />
        <Route path="/admin/reportes"   element={<PrivateRoute><Reportes /></PrivateRoute>} />

        {/* ── Ruta no encontrada ── */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}