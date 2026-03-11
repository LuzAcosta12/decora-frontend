/**
 * services/api.js
 * Capa de servicios — configuración de Axios para comunicación con el backend.
 *
 * Este archivo está listo para conectar con el backend Express de Martín.
 * Actualmente las llamadas están comentadas porque el backend aún está en desarrollo.
 *
 * Para activar la integración real:
 *  1. Cambiar BASE_URL a la URL del servidor de Martín
 *  2. Descomentar las funciones de cada módulo
 *  3. Reemplazar las funciones mock en AppContext.jsx por estas llamadas
 */

import axios from "axios"

// URL base del backend — cambiar cuando Martín tenga el servidor listo
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// Interceptor: agrega el token JWT en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("decora_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor: manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado — limpiar sesión
      localStorage.removeItem("decora_token")
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  }
)

export default api

// ── Servicios de Autenticación ────────────────────────────────────────────────
export const authService = {
  // login: (usuario, password) => api.post("/auth/login", { usuario, password }),
  // logout: () => api.post("/auth/logout"),
}

// ── Servicios de Cotizaciones ─────────────────────────────────────────────────
export const cotizacionService = {
  // getAll:       ()           => api.get("/cotizaciones"),
  // create:       (data)       => api.post("/cotizaciones", data),
  // updateEstado: (id, estado) => api.put(`/cotizaciones/${id}/estado`, { estado }),
}

// ── Servicios de Pedidos ──────────────────────────────────────────────────────
export const pedidoService = {
  // getAll:    ()        => api.get("/pedidos"),
  // getByCod:  (codigo)  => api.get(`/pedidos/${codigo}`),
  // create:    (data)    => api.post("/pedidos", data),
  // update:    (id, data)=> api.put(`/pedidos/${id}`, data),
  // delete:    (id)      => api.delete(`/pedidos/${id}`),
}

// ── Servicios de Reportes ─────────────────────────────────────────────────────
export const reporteService = {
  // getEstadisticas: () => api.get("/reportes/estadisticas"),
  // getPorMes:       () => api.get("/reportes/por-mes"),
}