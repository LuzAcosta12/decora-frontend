/**
 * AppContext.jsx
 * Estado global compartido entre todas las vistas del sistema DECORA.
 *
 * Este archivo centraliza:
 *  - Cotizaciones recibidas del cliente público
 *  - Pedidos activos del sistema
 *  - Autenticación del administrador (token JWT)
 *  - Módulos comerciales: asesorías, prospectos (pipeline), interacciones,
 *    clientes frecuentes, reseñas, campañas y recordatorios
 *
 * Cada función mock está lista para reemplazarse por una llamada Axios
 * al endpoint correspondiente cuando el backend esté disponible.
 * El resto de los componentes NO necesitan cambiar.
 */

import { createContext, useContext, useState, useEffect, useMemo } from "react"

// ─── Contexto ────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

// ─── Hook personalizado ───────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>")
  return ctx
}

// ─── Datos iniciales de ejemplo (mock) — módulos operativos existentes ───────
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
    estado: "En produccion",
    observaciones: "El proyecto se encuentra en proceso de corte de tela.",
    cotizacionOrigen: null,
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

// ─── Datos iniciales — módulos comerciales nuevos (vacíos, se llenan en uso) ──
const ASESORIAS_INICIALES = []
const PROSPECTOS_INICIALES = []
const INTERACCIONES_INICIALES = []
const CLIENTES_INICIALES = []       // clasificación/descuento asignados manualmente
const RESENAS_INICIALES = []
const CAMPANAS_INICIALES = []
const RECORDATORIOS_INICIALES = []

// ─── Catálogos fijos (usados por selects en los formularios) ─────────────────
export const ETAPAS_PIPELINE = [
  "Nuevo", "Contactado", "Cotización Enviada", "Negociando",
  "Confirmado", "Pospuesto", "Cancelado",
]

export const CANALES_ORIGEN = [
  "WhatsApp", "Sitio web", "Referido", "Llamada telefónica", "Visita directa",
]

export const TIPOS_CONTACTO = [
  "Llamada telefónica", "Mensaje de WhatsApp", "Correo", "Visita al taller",
]

export const TIPOS_TAREA_RECORDATORIO = [
  "Llamar", "Enviar cotización", "Dar seguimiento", "Confirmar entrega",
]

export const CLASIFICACIONES_CLIENTE = ["Normal", "Frecuente", "VIP"]

// ─── Helpers: generadores de código/id ────────────────────────────────────────
function generarCodigoPedido() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `DEC-2026-${code}`
}

function generarIdCotizacion(lista) {
  const siguiente = lista.length + 1
  return `COT-2026-${String(siguiente).padStart(2, "0")}`
}

// Código de seguimiento de asesoría: formato ASE-AAAA-XXXX (RF-02)
function generarCodigoAsesoria() {
  const anio = new Date().getFullYear()
  const numero = Math.floor(1000 + Math.random() * 9000)
  return `ASE-${anio}-${numero}`
}

// Id incremental simple para entidades sin código visible al público
function generarIdSimple(lista) {
  return lista.length > 0 ? Math.max(...lista.map(i => i.id)) + 1 : 1
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

// Calcula el estado de una campaña en tiempo real según sus fechas
// (Borrador si aún no inicia, Activa si está en rango, Finalizada si ya pasó)
export function calcularEstadoCampana(campana) {
  const hoy = new Date().toISOString().split("T")[0]
  if (hoy < campana.fechaInicio) return "Borrador"
  if (hoy > campana.fechaFin) return "Finalizada"
  return "Activa"
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── Estado: módulos operativos existentes ──────────────────────────────────
  const [cotizaciones, setCotizaciones] = useState(() => cargarLS("decora_cotizaciones", COTIZACIONES_INICIALES))
  const [pedidos,      setPedidos]      = useState(() => cargarLS("decora_pedidos",      PEDIDOS_INICIALES))
  const [mensajes,     setMensajes]     = useState(() => cargarLS("decora_mensajes",     MENSAJES_INICIALES))
  const [papelera,     setPapelera]     = useState(() => cargarLS("decora_papelera",     []))
  const [authToken,    setAuthToken]    = useState(() => localStorage.getItem("decora_token") || null)

  // ── Estado: módulos comerciales nuevos ──────────────────────────────────────
  const [asesorias,     setAsesorias]     = useState(() => cargarLS("decora_asesorias",     ASESORIAS_INICIALES))
  const [prospectos,    setProspectos]    = useState(() => cargarLS("decora_prospectos",    PROSPECTOS_INICIALES))
  const [interacciones, setInteracciones] = useState(() => cargarLS("decora_interacciones", INTERACCIONES_INICIALES))
  const [clientes,      setClientes]      = useState(() => cargarLS("decora_clientes",      CLIENTES_INICIALES))
  const [resenas,       setResenas]       = useState(() => cargarLS("decora_resenas",       RESENAS_INICIALES))
  const [campanas,      setCampanas]      = useState(() => cargarLS("decora_campanas",      CAMPANAS_INICIALES))
  const [recordatorios, setRecordatorios] = useState(() => cargarLS("decora_recordatorios", RECORDATORIOS_INICIALES))

  // ── Persistencia en localStorage — módulos operativos ──────────────────────
  useEffect(() => { localStorage.setItem("decora_cotizaciones", JSON.stringify(cotizaciones)) }, [cotizaciones])
  useEffect(() => { localStorage.setItem("decora_pedidos",      JSON.stringify(pedidos))      }, [pedidos])
  useEffect(() => { localStorage.setItem("decora_mensajes",     JSON.stringify(mensajes))     }, [mensajes])
  useEffect(() => { localStorage.setItem("decora_papelera",     JSON.stringify(papelera))     }, [papelera])

  // ── Persistencia en localStorage — módulos comerciales ──────────────────────
  useEffect(() => { localStorage.setItem("decora_asesorias",     JSON.stringify(asesorias))     }, [asesorias])
  useEffect(() => { localStorage.setItem("decora_prospectos",    JSON.stringify(prospectos))    }, [prospectos])
  useEffect(() => { localStorage.setItem("decora_interacciones", JSON.stringify(interacciones)) }, [interacciones])
  useEffect(() => { localStorage.setItem("decora_clientes",      JSON.stringify(clientes))      }, [clientes])
  useEffect(() => { localStorage.setItem("decora_resenas",       JSON.stringify(resenas))       }, [resenas])
  useEffect(() => { localStorage.setItem("decora_campanas",      JSON.stringify(campanas))      }, [campanas])
  useEffect(() => { localStorage.setItem("decora_recordatorios", JSON.stringify(recordatorios)) }, [recordatorios])

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

  const actualizarEstadoCotizacion = (id, estado) => {
    setCotizaciones(prev => prev.map(c => c.id === id ? { ...c, estado } : c))
  }

  const eliminarCotizacion = (id) => {
    setCotizaciones(prev => prev.filter(c => c.id !== id))
  }

  // ── Pedidos ─────────────────────────────────────────────────────────────────
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
    if (cotizacionId) actualizarEstadoCotizacion(cotizacionId, "Cerrada")
    return nuevo
  }

  const actualizarPedido = (id, cambios) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, ...cambios } : p))
  }

  const eliminarPedido = (id) => {
    setPedidos(prev => prev.filter(p => p.id !== id))
  }

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

  // ── Recordatorios ────────────────────────────────────────────────────────────
  // Se define antes que Interacciones porque una interacción con "próximo paso"
  // genera automáticamente un recordatorio (regla del diagrama de flujo).
  const crearRecordatorio = (formData) => {
    const nuevo = {
      id:                generarIdSimple(recordatorios),
      tipoTarea:         formData.tipoTarea,
      descripcion:       formData.descripcion || "",
      fechaLimite:       formData.fechaLimite,
      completado:        false,
      fechaCompletado:   null,
      idProspecto:       formData.idProspecto || null,
      idClienteFrecuente: formData.idClienteFrecuente || null,
      fecha:             new Date().toISOString().split("T")[0],
    }
    setRecordatorios(prev => [nuevo, ...prev])
    return nuevo
  }

  // Edita un recordatorio existente (tipo de tarea, descripción, fecha límite o vínculo)
  const actualizarRecordatorio = (id, cambios) => {
    setRecordatorios(prev => prev.map(r => r.id === id ? { ...r, ...cambios } : r))
  }

  const completarRecordatorio = (id) => {
    setRecordatorios(prev =>
      prev.map(r => r.id === id
        ? { ...r, completado: true, fechaCompletado: new Date().toISOString().split("T")[0] }
        : r
      )
    )
  }

  const eliminarRecordatorio = (id) => {
    setRecordatorios(prev => prev.filter(r => r.id !== id))
  }

  // Cuenta para el indicador del Sidebar: vencidos o próximos a vencer, sin completar
  const recordatoriosPendientesCount = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0]
    return recordatorios.filter(r => !r.completado && r.fechaLimite <= hoy).length
  }, [recordatorios])

  // ── Asesorías (módulo público de asesoría comercial) ────────────────────────
  const crearAsesoria = (formData) => {
    const nueva = {
      id:              generarIdSimple(asesorias),
      codigoSeguimiento: generarCodigoAsesoria(),
      presupuestoAprox: formData.presupuestoAprox || null,
      tipoMueble:      formData.tipoMueble,
      descripcion:     formData.descripcion || "",
      estado:          "Nueva", // Nueva | Contactado | Convertida | Descartada
      fecha:           new Date().toISOString().split("T")[0],
      idProspecto:     null,
      idCotizacion:    null,
    }
    setAsesorias(prev => [nueva, ...prev])
    return nueva
  }

  const buscarAsesoriaPorCodigo = (codigo) => {
    const normalizar = (s) => s.toUpperCase().replace(/\s+/g, "").trim()
    return asesorias.find(a => normalizar(a.codigoSeguimiento) === normalizar(codigo)) || null
  }

  const actualizarEstadoAsesoria = (id, estado) => {
    setAsesorias(prev => prev.map(a => a.id === id ? { ...a, estado } : a))
  }

  const marcarAsesoriaConvertida = (id, idCotizacion) => {
    setAsesorias(prev =>
      prev.map(a => a.id === id ? { ...a, estado: "Convertida", idCotizacion } : a)
    )
  }

  const eliminarAsesoria = (id) => {
    setAsesorias(prev => prev.filter(a => a.id !== id))
  }

  // ── Prospectos (Pipeline Comercial Kanban) ───────────────────────────────────
  const crearProspecto = (formData) => {
    const nuevo = {
      id:                 generarIdSimple(prospectos),
      nombre:             formData.nombre,
      telefono:           formData.telefono,
      correo:             formData.correo || "",
      canalOrigen:        formData.canalOrigen,
      servicioInteres:    formData.servicioInteres,
      etapa:              "Nuevo",
      observaciones:      formData.observaciones || "",
      fechaPrimerContacto: new Date().toISOString().split("T")[0],
      fecha:              new Date().toISOString().split("T")[0],
      idClienteFrecuente: null,
      idCotizacion:       null,
    }
    setProspectos(prev => [nuevo, ...prev])
    return nuevo
  }

  // Mueve la tarjeta de columna en el tablero Kanban (drag & drop)
  const moverEtapaProspecto = (id, etapa) => {
    setProspectos(prev => prev.map(p => p.id === id ? { ...p, etapa } : p))
  }

  const actualizarProspecto = (id, cambios) => {
    setProspectos(prev => prev.map(p => p.id === id ? { ...p, ...cambios } : p))
  }

  const eliminarProspecto = (id) => {
    setProspectos(prev => prev.filter(p => p.id !== id))
    setInteracciones(prev => prev.filter(i => i.idProspecto !== id))
  }

  // Marca el prospecto como convertido, vinculándolo a la cotización generada
  const convertirProspectoEnCotizacion = (id, idCotizacion) => {
    setProspectos(prev =>
      prev.map(p => p.id === id ? { ...p, idCotizacion } : p)
    )
  }
  // Convierte una asesoría en un prospecto dentro del pipeline, para poder
  // darle seguimiento con bitácora y etapas cuando aún no está listo para
  // convertirse directamente en cotización. Vincula ambos registros.
  const convertirAsesoriaEnProspecto = (id) => {
    const asesoria = asesorias.find(a => a.id === id)
    if (!asesoria) return null

    const nuevoProspecto = crearProspecto({
      nombre:          asesoria.nombre || "Cliente de asesoría",
      telefono:        asesoria.telefono || "",
      correo:          asesoria.correo || "",
      canalOrigen:     "Sitio web",
      servicioInteres: asesoria.tipoMueble,
      observaciones:   `Proviene de la asesoría ${asesoria.codigoSeguimiento}. ${asesoria.descripcion}${asesoria.presupuestoAprox ? ` (Presupuesto aprox. $${asesoria.presupuestoAprox})` : ""}`,
    })

    setAsesorias(prev =>
      prev.map(a => a.id === id ? { ...a, estado: "Contactado", idProspecto: nuevoProspecto.id } : a)
    )

    return nuevoProspecto
  }

  // ── Interacciones (bitácora de seguimiento por prospecto) ───────────────────
  const agregarInteraccion = (idProspecto, formData) => {
    const nueva = {
      id:               generarIdSimple(interacciones),
      idProspecto,
      tipoContacto:     formData.tipoContacto,
      fechaInteraccion: formData.fechaInteraccion || new Date().toISOString().split("T")[0],
      descripcion:      formData.descripcion,
      proximoPaso:      formData.proximoPaso || null,
      fechaLimitePaso:  formData.fechaLimitePaso || null,
      fecha:            new Date().toISOString().split("T")[0],
    }
    setInteracciones(prev => [nueva, ...prev])

    // Regla del diagrama de flujo: si se define próximo paso con fecha límite,
    // se genera automáticamente un recordatorio vinculado al prospecto.
    if (formData.proximoPaso && formData.fechaLimitePaso) {
      crearRecordatorio({
        tipoTarea:    "Dar seguimiento",
        descripcion:  formData.proximoPaso,
        fechaLimite:  formData.fechaLimitePaso,
        idProspecto,
      })
    }

    return nueva
  }

  const obtenerInteraccionesPorProspecto = (idProspecto) =>
    interacciones
      .filter(i => i.idProspecto === idProspecto)
      .sort((a, b) => new Date(b.fechaInteraccion) - new Date(a.fechaInteraccion))

  const eliminarInteraccion = (id) => {
    setInteracciones(prev => prev.filter(i => i.id !== id))
  }

  // ── Clientes frecuentes ──────────────────────────────────────────────────────
  // Las fichas se calculan a partir de los pedidos con estado "Entregado",
  // y se enriquecen con la clasificación/descuento guardados en `clientes`.
  const clientesFrecuentes = useMemo(() => {
    const entregados = pedidos.filter(p => p.estado === "Entregado")
    const agrupado = {}

    entregados.forEach(p => {
      if (!agrupado[p.cliente]) {
        agrupado[p.cliente] = {
          nombre: p.cliente,
          telefono: p.telefono || "",
          correo: p.correo || "",
          totalPedidos: 0,
          montoAcumulado: 0,
          servicios: [],
        }
      }
      agrupado[p.cliente].totalPedidos += 1
      agrupado[p.cliente].montoAcumulado += (p.costo || 0)
      agrupado[p.cliente].servicios.push(p.servicio)
    })

    return Object.values(agrupado).map(ficha => {
      const registro = clientes.find(c => c.nombre === ficha.nombre)
      return {
        id: registro?.id || null,
        ...ficha,
        clasificacion: registro?.clasificacion || "Normal",
        descuentoEspecial: registro?.descuentoEspecial || 0,
        fechaActualizacion: registro?.fechaActualizacion || null,
      }
    })
  }, [pedidos, clientes])

  // Crea o actualiza el registro de clasificación/descuento de un cliente
  const actualizarClasificacionCliente = (nombreCliente, clasificacion, descuentoEspecial) => {
    setClientes(prev => {
      const existe = prev.find(c => c.nombre === nombreCliente)
      const fecha = new Date().toISOString().split("T")[0]
      if (existe) {
        return prev.map(c =>
          c.nombre === nombreCliente
            ? { ...c, clasificacion, descuentoEspecial, fechaActualizacion: fecha }
            : c
        )
      }
      return [
        ...prev,
        {
          id: generarIdSimple(prev),
          nombre: nombreCliente,
          clasificacion,
          descuentoEspecial,
          fechaActualizacion: fecha,
        },
      ]
    })
  }

  // Usado en el formulario de Pedidos para mostrar la alerta de descuento sugerido
  const buscarDescuentoCliente = (nombreCliente) => {
    const registro = clientes.find(c => c.nombre === nombreCliente)
    return registro && registro.descuentoEspecial > 0 ? registro.descuentoEspecial : null
  }

  // ── Reseñas (calificación postventa + moderación + opiniones públicas) ──────
  const existeResenaParaPedido = (idPedido) =>
    resenas.some(r => r.idPedido === idPedido)

  const crearResena = (idPedido, calificacion, comentario) => {
    if (existeResenaParaPedido(idPedido)) return null
    const nueva = {
      id:             generarIdSimple(resenas),
      idPedido,
      calificacion,
      comentario:     comentario || "",
      estado:         "Pendiente", // Pendiente | Aprobada | Rechazada
      fecha:          new Date().toISOString().split("T")[0],
      fechaModeracion: null,
    }
    setResenas(prev => [nueva, ...prev])
    return nueva
  }

  const actualizarEstadoResena = (id, estado) => {
    setResenas(prev =>
      prev.map(r => r.id === id
        ? { ...r, estado, fechaModeracion: new Date().toISOString().split("T")[0] }
        : r
      )
    )
  }

  const obtenerResenasAprobadas = () => resenas.filter(r => r.estado === "Aprobada")

  // ── Campañas y promociones ───────────────────────────────────────────────────
  const crearCampana = (formData) => {
    const nueva = {
      id:                  generarIdSimple(campanas),
      nombre:              formData.nombre,
      descripcion:         formData.descripcion || "",
      servicioAplicable:   formData.servicioAplicable,
      porcentajeDescuento: parseFloat(formData.porcentajeDescuento) || 0,
      codigoPromo:         formData.codigoPromo,
      fechaInicio:         formData.fechaInicio,
      fechaFin:            formData.fechaFin,
      fecha:               new Date().toISOString().split("T")[0],
    }
    setCampanas(prev => [nueva, ...prev])
    return nueva
  }

  const actualizarCampana = (id, cambios) => {
    setCampanas(prev => prev.map(c => c.id === id ? { ...c, ...cambios } : c))
  }

  const eliminarCampana = (id) => {
    setCampanas(prev => prev.filter(c => c.id !== id))
  }

  // Busca una campaña activa por su código promocional (usado al aplicar
  // un descuento en un pedido). Devuelve null si no existe o ya no está vigente.
  const buscarCampanaPorCodigo = (codigo) => {
    const normalizar = (s) => s.toUpperCase().replace(/\s+/g, "").trim()
    const campana = campanas.find(c => normalizar(c.codigoPromo) === normalizar(codigo))
    if (!campana) return null
    if (calcularEstadoCampana(campana) !== "Activa") return null
    return campana
  }

  const campanasActivas = useMemo(
    () => campanas.filter(c => calcularEstadoCampana(c) === "Activa"),
    [campanas]
  )

  // ── Estadísticas para Dashboard y Reportes ──────────────────────────────────
  const estadisticas = {
    // Operativas (ya existentes)
    totalPedidos:       pedidos.length,
    pedidosActivos:     pedidos.filter(p => p.estado === "En produccion").length,
    pendientes:         pedidos.filter(p => p.estado === "Pendiente").length,
    finalizados:        pedidos.filter(p => ["Finalizado", "Entregado"].includes(p.estado)).length,
    ventasAcumuladas:   pedidos.reduce((acc, p) => acc + (p.costo || 0), 0),
    cotizacionesNuevas: cotizaciones.filter(c => c.estado === "Nueva").length,
    totalMensajes:      mensajes.length,

    // Comerciales (nuevas)
    prospectosPorEtapa: ETAPAS_PIPELINE.reduce((acc, etapa) => {
      acc[etapa] = prospectos.filter(p => p.etapa === etapa).length
      return acc
    }, {}),
    calificacionPromedio: (() => {
      const aprobadas = resenas.filter(r => r.estado === "Aprobada")
      if (aprobadas.length === 0) return 0
      return aprobadas.reduce((acc, r) => acc + r.calificacion, 0) / aprobadas.length
    })(),
    clientesFrecuentesCount: clientesFrecuentes.filter(c => c.clasificacion === "Frecuente").length,
    clientesVIPCount:        clientesFrecuentes.filter(c => c.clasificacion === "VIP").length,
    campanasActivasCount:    campanasActivas.length,
    recordatoriosPendientes: recordatoriosPendientesCount,
  }

  // ── Valor del contexto ──────────────────────────────────────────────────────
  const value = {
    // Auth
    authToken, login, logout, isAuthenticated,

    // Cotizaciones
    cotizaciones, crearCotizacion, actualizarEstadoCotizacion, eliminarCotizacion,

    // Pedidos
    pedidos, crearPedido, actualizarPedido, eliminarPedido, buscarPedidoPorCodigo,

    // Mensajes
    mensajes, papelera, agregarMensaje, eliminarMensaje, eliminarMensajePermanente,

    // Asesorías
    asesorias, crearAsesoria, buscarAsesoriaPorCodigo, actualizarEstadoAsesoria,
    marcarAsesoriaConvertida, eliminarAsesoria, convertirAsesoriaEnProspecto,

    // Prospectos (Pipeline)
    prospectos, crearProspecto, moverEtapaProspecto, actualizarProspecto,
    eliminarProspecto, convertirProspectoEnCotizacion,

    // Interacciones
    interacciones, agregarInteraccion, obtenerInteraccionesPorProspecto, eliminarInteraccion,

    // Clientes frecuentes
    clientesFrecuentes, actualizarClasificacionCliente, buscarDescuentoCliente,

    // Reseñas
    resenas, crearResena, existeResenaParaPedido, actualizarEstadoResena, obtenerResenasAprobadas,

    // Campañas
    campanas, crearCampana, actualizarCampana, eliminarCampana, campanasActivas, buscarCampanaPorCodigo,

    // Recordatorios
    recordatorios, crearRecordatorio, actualizarRecordatorio, completarRecordatorio, eliminarRecordatorio,
    recordatoriosPendientesCount,

    // Reportes
    estadisticas,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}