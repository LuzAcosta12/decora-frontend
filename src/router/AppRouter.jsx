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

// Páginas comerciales — público
import AsesoriaPublica     from "../pages/comercial/AsesoriaPublica"
import SeguimientoAsesoria from "../pages/comercial/SeguimientoAsesoria"
import OpinionesPublicas   from "../pages/comercial/OpinionesPublicas"
import PromocionesPublicas from "../pages/comercial/PromocionesPublicas"

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

// Páginas comerciales — admin
import GestionAsesorias        from "../pages/comercial/GestionAsesorias"
import PipelineComercial       from "../pages/comercial/PipelineComercial"
import GestionClientes         from "../pages/comercial/GestionClientes"
import ModeracionResenas       from "../pages/comercial/ModeracionResenas"
import GestionCampanas         from "../pages/comercial/GestionCampanas"
import RecordatoriosComerciales from "../pages/comercial/RecordatoriosComerciales"

/**
 * PrivateRoute — Protege rutas del panel admin.
 * Si el usuario no está autenticado, redirige al login.
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

        {/* ── Rutas comerciales públicas ── */}
        <Route path="/asesoria"             element={<AsesoriaPublica />} />
        <Route path="/asesoria/seguimiento" element={<SeguimientoAsesoria />} />
        <Route path="/opiniones"            element={<OpinionesPublicas />} />
        <Route path="/promociones"          element={<PromocionesPublicas />} />

        {/* ── Login (acceso sin auth) ── */}
        <Route path="/admin/login" element={<Login />} />

        {/* ── Rutas admin protegidas ── */}
        <Route path="/admin/dashboard"    element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/cotizaciones" element={<PrivateRoute><Cotizaciones /></PrivateRoute>} />
        <Route path="/admin/pedidos"      element={<PrivateRoute><Pedidos /></PrivateRoute>} />
        <Route path="/admin/mensajes"     element={<PrivateRoute><Mensajes /></PrivateRoute>} />
        <Route path="/admin/galeria"      element={<PrivateRoute><GaleriaAdmin /></PrivateRoute>} />
        <Route path="/admin/servicios"    element={<PrivateRoute><ServiciosAdmin /></PrivateRoute>} />
        <Route path="/admin/acerca-de"    element={<PrivateRoute><AcercaDeAdmin /></PrivateRoute>} />
        <Route path="/admin/reportes"     element={<PrivateRoute><Reportes /></PrivateRoute>} />

        {/* ── Rutas comerciales admin ── */}
        <Route path="/admin/asesorias"     element={<PrivateRoute><GestionAsesorias /></PrivateRoute>} />
        <Route path="/admin/prospectos"    element={<PrivateRoute><PipelineComercial /></PrivateRoute>} />
        <Route path="/admin/clientes"      element={<PrivateRoute><GestionClientes /></PrivateRoute>} />
        <Route path="/admin/opiniones"     element={<PrivateRoute><ModeracionResenas /></PrivateRoute>} />
        <Route path="/admin/campanas"      element={<PrivateRoute><GestionCampanas /></PrivateRoute>} />
        <Route path="/admin/recordatorios" element={<PrivateRoute><RecordatoriosComerciales /></PrivateRoute>} />

        {/* ── Ruta no encontrada ── */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}