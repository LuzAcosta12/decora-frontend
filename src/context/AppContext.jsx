/**
 * AppContext.jsx
 * Estado global compartido entre todas las vistas del sistema DECORA.
 *
 * Este archivo centraliza:
 *  - Cotizaciones recibidas del cliente público
 *  - Pedidos activos del sistema
 *  - Autenticación del administrador (token JWT)
 *
 * Cuando el backend de Martín esté listo, cada función mock
 * se reemplaza por una llamada Axios al endpoint correspondiente.
 * El resto de los componentes NO necesitan cambiar.
 */

import { createContext, useContext, useState, useEffect } from "react"

// ─── Contexto ────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

// ─── Hook personalizado ───────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>")
  return ctx
}

// ─── Datos iniciales de ejemplo (mock) ───────────────────────────────────────
// Cuando conectes el backend, estos se cargarán desde la API con useEffect + Axios.
// Un solo registro de ejemplo para mostrar cómo se ve la vista.
// Las cotizaciones reales llegan desde el formulario público (/cotizacion).
const COTIZACIONES_INICIALES = [
  {
    id: "COT-2026-01",
    nombre: "Maria Garcia",
    correo: "maria@gmail.com",
    telefono: "+52 998 111 2233",
    servicio: "Tapiceria de sala",
    calidad: "Alta calidad",
    material: "Terciopelo",
    piezas: "3",
    tiempoEntrega: "Estandar (3 a 5 semanas)",
    observaciones: "Color azul marino",
    estimadoMin: 2054,
    estimadoMax: 2670,
    estado: "Nueva",
    fecha: "2026-03-10",
    origen: "web",
  },
]

const MENSAJES_INICIALES = [
  { id: 1, nombre: "Juan Perez",    correo: "juan@gmail.com",      telefono: "+52 998 111 2233", mensaje: "Hola, me gustaria saber el costo para retapizar mi sala de 3 piezas con vinipiel negro.", fecha: "2026-03-10" },
  { id: 2, nombre: "Sofia Ruiz",    correo: "sofia@hotmail.com",   telefono: "",                 mensaje: "Buenos dias, quiero información sobre el servicio de cabeceras tapizadas. Tengo una cama matrimonial.", fecha: "2026-03-09" },
  { id: 3, nombre: "Carlos Mendez", correo: "carlos@gmail.com",    telefono: "+52 998 444 5566", mensaje: "Me interesa saber si trabajan con cuero genuino para sillas de comedor. Tengo 6 sillas.", fecha: "2026-03-08" },
  { id: 4, nombre: "Laura Torres",  correo: "laura@gmail.com",     telefono: "+52 998 777 8899", mensaje: "Quisiera una cotizacion para tapizar un sillon individual. El tapiz actual esta muy deteriorado.", fecha: "2026-03-07" },
]

const PEDIDOS_INICIALES = [
  {
    id: "DEC-2026-X7K9",
    cliente: "Juan Perez",
    correo: "juan@gmail.com",
    telefono: "+52 998 000 1111",
    servicio: "Tapiceria de sala completa",
    descripcion: "Sala de 3 piezas, vinipiel negro",
    cantidad: "3",
    fechaEntrega: "2026-04-15",
    costo: 2400,
    estado: "En produccion",   // "Pendiente"|"En produccion"|"Finalizado"|"Entregado"
    observaciones: "El proyecto se encuentra en proceso de corte de tela.",
    cotizacionOrigen: null,    // id de la cotización si viene de una
    fecha: "2026-03-01",
  },
  {
    id: "DEC-2026-A3M2",
    cliente: "Maria Garcia",
    correo: "maria@gmail.com",
    telefono: "+52 998 111 2233",
    servicio: "Tapiceria de sala",
    descripcion: "3 piezas terciopelo azul marino",
    cantidad: "3",
    fechaEntrega: "2026-04-20",
    costo: 2400,
    estado: "Pendiente",
    observaciones: "",
    cotizacionOrigen: "COT-2026-01",
    fecha: "2026-03-10",
  },
]

// ─── Helper: generar código de pedido único ────────────────────────────────
function generarCodigoPedido() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `DEC-2026-${code}`
}

// ─── Helper: generar ID de cotización ────────────────────────────────────────
function generarIdCotizacion(lista) {
  const siguiente = lista.length + 1
  return `COT-2026-${String(siguiente).padStart(2, "0")}`
}

// ─── Helper: cargar desde localStorage con fallback ──────────────────────────
function cargarLS(clave, fallback) {
  try {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : fallback
  } catch {
    return fallback
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [cotizaciones, setCotizaciones] = useState(() => cargarLS("decora_cotizaciones", COTIZACIONES_INICIALES))
  const [pedidos,      setPedidos]      = useState(() => cargarLS("decora_pedidos",      PEDIDOS_INICIALES))
  const [mensajes,     setMensajes]     = useState(() => cargarLS("decora_mensajes",     MENSAJES_INICIALES))
  const [papelera,     setPapelera]     = useState(() => cargarLS("decora_papelera",     []))
  const [authToken,    setAuthToken]    = useState(
    () => localStorage.getItem("decora_token") || null
  )

  // Persistir en localStorage cada vez que cambian los datos
  useEffect(() => { localStorage.setItem("decora_cotizaciones", JSON.stringify(cotizaciones)) }, [cotizaciones])
  useEffect(() => { localStorage.setItem("decora_pedidos",      JSON.stringify(pedidos))      }, [pedidos])
  useEffect(() => { localStorage.setItem("decora_mensajes",     JSON.stringify(mensajes))     }, [mensajes])
  useEffect(() => { localStorage.setItem("decora_papelera",     JSON.stringify(papelera))     }, [papelera])

  // Persistir token en localStorage
  useEffect(() => {
    if (authToken) localStorage.setItem("decora_token", authToken)
    else           localStorage.removeItem("decora_token")
  }, [authToken])
  // ── Auth ────────────────────────────────────────────────────────────────────
  const login = (token) => setAuthToken(token)
  const logout = () => setAuthToken(null)
  const isAuthenticated = !!authToken

  // ── Cotizaciones ────────────────────────────────────────────────────────────
  /**
   * Llamada desde /cotizacion (público) cuando el cliente termina el formulario.
   * Devuelve el objeto cotización creado (con su id y estimados).
   *
   * TODO (Martín): reemplazar por:
   *   const { data } = await api.post("/cotizaciones", payload)
   *   return data
   */
  const crearCotizacion = (formData, estimado) => {
    const nueva = {
      id:            generarIdCotizacion(cotizaciones),
      nombre:        formData.nombre,
      correo:        formData.correo,
      telefono:      formData.telefono || "",
      servicio:      formData.tipoServicioNombre,
      calidad:       formData.calidadNombre,
      material:      formData.material,
      piezas:        formData.cantidad,
      tiempoEntrega: formData.tiempoEntrega,
      observaciones: formData.observaciones || "",
      estimadoMin:   estimado.min,
      estimadoMax:   estimado.max,
      estado:        "Nueva",
      fecha:         new Date().toISOString().split("T")[0],
      origen:        "web",
    }
    setCotizaciones(prev => [nueva, ...prev])
    return nueva
  }

  /**
   * Cambia estado de una cotización.
   * TODO (Martín): reemplazar por:
   *   await api.put(`/cotizaciones/${id}/estado`, { estado })
   */
  const actualizarEstadoCotizacion = (id, estado) => {
    setCotizaciones(prev =>
      prev.map(c => c.id === id ? { ...c, estado } : c)
    )
  }

  const eliminarCotizacion = (id) => {
    setCotizaciones(prev => prev.filter(c => c.id !== id))
  }

  // ── Pedidos ─────────────────────────────────────────────────────────────────
  /**
   * Crea un nuevo pedido. Puede venir desde el admin manualmente
   * o desde "Generar pedido" en la vista de cotizaciones.
   * Devuelve el pedido creado (con su código).
   *
   * TODO (Martín): reemplazar por:
   *   const { data } = await api.post("/pedidos", payload)
   *   return data
   */
  const crearPedido = (formData, cotizacionId = null) => {
    const codigo = generarCodigoPedido()
    const nuevo = {
      id:               codigo,
      cliente:          formData.nombre,
      correo:           formData.correo || "",
      telefono:         formData.telefono || "",
      servicio:         formData.servicio,
      descripcion:      formData.descripcion || "",
      cantidad:         formData.cantidad || "1",
      fechaEntrega:     formData.fechaEntrega,
      costo:            parseFloat(formData.costo) || 0,
      anticipo:         parseFloat(formData.anticipo) || 0,
      estado:           formData.estado || "Pendiente",
      observaciones:    formData.observaciones || "",
      archivoCotizacion: formData.archivoCotizacion || null,
      cotizacionOrigen: cotizacionId,
      fecha:            new Date().toISOString().split("T")[0],
    }
    setPedidos(prev => [nuevo, ...prev])

    // Si viene de cotización, marcarla como "Cerrada"
    if (cotizacionId) actualizarEstadoCotizacion(cotizacionId, "Cerrada")

    return nuevo
  }

  /**
   * Actualiza un pedido existente.
   * TODO (Martín): reemplazar por:
   *   await api.put(`/pedidos/${id}`, cambios)
   */
  const actualizarPedido = (id, cambios) => {
    setPedidos(prev =>
      prev.map(p => p.id === id ? { ...p, ...cambios } : p)
    )
  }

  /**
   * Elimina un pedido.
   * TODO (Martín): reemplazar por:
   *   await api.delete(`/pedidos/${id}`)
   */
  const eliminarPedido = (id) => {
    setPedidos(prev => prev.filter(p => p.id !== id))
  }

  /**
   * Busca un pedido por código (para la vista de Rastreo del cliente).
   * TODO (Martín): reemplazar por:
   *   const { data } = await api.get(`/pedidos/${codigo}`)
   *   return data
   */
  const buscarPedidoPorCodigo = (codigo) => {
    const normalizar = (s) => s.toUpperCase().replace(/\s+/g, "").trim()
    return pedidos.find(p => normalizar(p.id) === normalizar(codigo)) || null
  }

  // ── Mensajes ────────────────────────────────────────────────────────────────
  const agregarMensaje = (formData) => {
    const nuevo = {
      id:       Date.now(),
      nombre:   formData.nombre,
      correo:   formData.correo,
      telefono: formData.telefono || "",
      mensaje:  formData.mensaje,
      fecha:    new Date().toISOString().split("T")[0],
    }
    setMensajes(prev => [nuevo, ...prev])
  }

  const eliminarMensaje = (id) => {
    const msg = mensajes.find(m => m.id === id)
    setMensajes(prev => prev.filter(m => m.id !== id))
    if (msg) setPapelera(prev => [msg, ...prev])
  }

  const eliminarMensajePermanente = (id) => {
    setPapelera(prev => prev.filter(m => m.id !== id))
  }

  // ── Datos para reportes ─────────────────────────────────────────────────────
  const estadisticas = {
    totalPedidos:       pedidos.length,
    pedidosActivos:     pedidos.filter(p => p.estado === "En produccion").length,
    pendientes:         pedidos.filter(p => p.estado === "Pendiente").length,
    finalizados:        pedidos.filter(p => ["Finalizado", "Entregado"].includes(p.estado)).length,
    ventasAcumuladas:   pedidos.reduce((acc, p) => acc + (p.costo || 0), 0),
    cotizacionesNuevas: cotizaciones.filter(c => c.estado === "Nueva").length,
    totalMensajes:      mensajes.length,
  }

  // ── Valor del contexto ──────────────────────────────────────────────────────
  const value = {
    // Auth
    authToken, login, logout, isAuthenticated,

    // Cotizaciones
    cotizaciones,
    crearCotizacion,
    actualizarEstadoCotizacion,
    eliminarCotizacion,

    // Pedidos
    pedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    buscarPedidoPorCodigo,

    // Mensajes
    mensajes,
    papelera,
    agregarMensaje,
    eliminarMensaje,
    eliminarMensajePermanente,

    // Reportes
    estadisticas,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}