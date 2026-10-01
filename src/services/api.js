/**
 * services/api.js
 * Capa de servicios — configuración de Axios para comunicación con el backend.
 *
 * Este archivo está listo para conectar con el backend cuando esté disponible.
 * Actualmente las llamadas están comentadas porque el backend aún está en desarrollo.
 *
 * Para activar la integración real:
 *  1. Cambiar BASE_URL a la URL del servidor
 *  2. Descomentar las funciones de cada módulo
 *  3. Reemplazar las funciones mock en AppContext.jsx por estas llamadas
 */

import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("decora_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

// ── Servicios comerciales nuevos (RF de la memoria — Capa de integración Axios) ─
// Cada uno sigue el mismo patrón: getAll, getById, create, update, delete.
// Se activan cuando el backend exponga las rutas /asesorias, /prospectos, etc.

export const asesoriaService = {
  // getAll:      ()        => api.get("/asesorias"),
  // getById:     (id)      => api.get(`/asesorias/${id}`),
  // getByCodigo: (codigo)  => api.get(`/asesorias/codigo/${codigo}`),
  // create:      (data)    => api.post("/asesorias", data),
  // update:      (id, data)=> api.put(`/asesorias/${id}`, data),
  // delete:      (id)      => api.delete(`/asesorias/${id}`),
}

export const prospectoService = {
  // getAll:      ()        => api.get("/prospectos"),
  // getById:     (id)      => api.get(`/prospectos/${id}`),
  // create:      (data)    => api.post("/prospectos", data),
  // update:      (id, data)=> api.put(`/prospectos/${id}`, data),
  // delete:      (id)      => api.delete(`/prospectos/${id}`),
  // Interacciones (sub-recurso del prospecto)
  // getInteracciones: (idProspecto)       => api.get(`/prospectos/${idProspecto}/interacciones`),
  // addInteraccion:   (idProspecto, data) => api.post(`/prospectos/${idProspecto}/interacciones`, data),
}

export const clienteService = {
  // getAll:      ()        => api.get("/clientes"),
  // getById:     (id)      => api.get(`/clientes/${id}`),
  // create:      (data)    => api.post("/clientes", data),
  // update:      (id, data)=> api.put(`/clientes/${id}`, data),
  // delete:      (id)      => api.delete(`/clientes/${id}`),
}

export const resenaService = {
  // getAll:       ()           => api.get("/resenas"),
  // getById:      (id)         => api.get(`/resenas/${id}`),
  // create:       (data)       => api.post("/resenas", data),
  // updateEstado: (id, estado) => api.put(`/resenas/${id}/estado`, { estado }),
  // delete:       (id)         => api.delete(`/resenas/${id}`),
}

export const campanaService = {
  // getAll:      ()        => api.get("/campanas"),
  // getById:     (id)      => api.get(`/campanas/${id}`),
  // create:      (data)    => api.post("/campanas", data),
  // update:      (id, data)=> api.put(`/campanas/${id}`, data),
  // delete:      (id)      => api.delete(`/campanas/${id}`),
}

export const recordatorioService = {
  // getAll:       ()        => api.get("/recordatorios"),
  // getById:      (id)      => api.get(`/recordatorios/${id}`),
  // create:       (data)    => api.post("/recordatorios", data),
  // complete:     (id)      => api.put(`/recordatorios/${id}/completar`),
  // delete:       (id)      => api.delete(`/recordatorios/${id}`),
}