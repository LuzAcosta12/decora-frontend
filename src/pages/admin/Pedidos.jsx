import Sidebar from "../../components/Sidebar"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useApp } from "../../context/AppContext"

const badgeEstado = (estado) => {
  if (estado === "Pendiente")      return "bg-red-100 text-red-600"
  if (estado === "En produccion")  return "bg-yellow-100 text-yellow-700"
  if (estado === "Finalizado")     return "bg-green-100 text-green-700"
  if (estado === "Entregado")      return "bg-blue-100 text-blue-700"
  return "bg-gray-100 text-gray-500"
}

const estadosProgreso = [
  { id: 1, nombre: "Pendiente",     icono: "📋" },
  { id: 2, nombre: "En produccion", icono: "🔧" },
  { id: 3, nombre: "Finalizado",    icono: "✅" },
  { id: 4, nombre: "Entregado",     icono: "📦" },
]

const FORM_VACIO = {
  nombre: "", correo: "", telefono: "",
  servicio: "", descripcion: "", cantidad: "",
  fechaEntrega: "", costo: "", anticipo: "",
  estado: "Pendiente", observaciones: "",
}

export default function Pedidos() {
  const { pedidos, crearPedido, actualizarPedido, eliminarPedido } = useApp()
  const location = useLocation()

  const [vista,             setVista]             = useState("lista")
  const [busqueda,          setBusqueda]          = useState("")
  const [filtroEstado,      setFiltroEstado]      = useState("Todos")
  const [codigoGenerado,    setCodigoGenerado]    = useState(null)
  const [pedidoEditar,      setPedidoEditar]      = useState(null)
  const [cotizOrigen,       setCotizOrigen]       = useState(null)
  const [form,              setForm]              = useState(FORM_VACIO)
  const [archivoCot,        setArchivoCot]        = useState(null)
  const [archivoError,      setArchivoError]      = useState("")
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [modalArchivo,      setModalArchivo]      = useState(null) // { nombre, base64, tipo }

  // Convierte base64 a blob y lo abre correctamente en el navegador
  const abrirArchivo = (archivo) => {
    if (!archivo?.base64) return
    // Extraer el contenido puro del base64
    const [header, data] = archivo.base64.split(",")
    const tipo = header.match(/:(.*?);/)?.[1] || "application/pdf"
    const bytes = atob(data)
    const arr   = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
    const blob  = new Blob([arr], { type: tipo })
    const url   = URL.createObjectURL(blob)
    // Si es PDF lo abrimos en el modal visor, si es imagen igual
    setModalArchivo({ nombre: archivo.nombre, blobUrl: url, tipo })
  }

  // Pre-llenar desde cotización
  useEffect(() => {
    if (location.state?.cotizacionOrigen) {
      const cot = location.state.cotizacionOrigen
      setCotizOrigen(cot)
      setForm({
        nombre:        cot.nombre,
        correo:        cot.correo,
        telefono:      cot.telefono || "",
        servicio:      cot.servicio,
        descripcion:   `${cot.calidad} — ${cot.material}. ${cot.observaciones || ""}`.trim(),
        cantidad:      cot.piezas,
        fechaEntrega:  "",
        costo:         cot.estimadoMin?.toString() || "",
        anticipo:      "",
        estado:        "Pendiente",
        observaciones: "",
      })
      setArchivoCot(null)
      setVista("formulario")
      window.history.replaceState({}, "")
    }
  }, [location.state])

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleArchivo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setArchivoError("El archivo no debe superar 2 MB para poder guardarse correctamente.")
      return
    }
    setArchivoError("")
    // Convertir a base64 para que persista en localStorage al recargar
    const reader = new FileReader()
    reader.onload = (ev) => {
      setArchivoCot({
        nombre: file.name,
        base64: ev.target.result,   // data:application/pdf;base64,...
        tipo: file.type,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleNuevo = () => {
    setPedidoEditar(null)
    setCotizOrigen(null)
    setForm(FORM_VACIO)
    setArchivoCot(null)
    setArchivoError("")
    setVista("formulario")
  }

  const handleEditar = (p) => {
    setPedidoEditar(p)
    setCotizOrigen(null)
    setForm({
      nombre:        p.cliente,
      correo:        p.correo || "",
      telefono:      p.telefono || "",
      servicio:      p.servicio,
      descripcion:   p.descripcion || "",
      cantidad:      p.cantidad || "",
      fechaEntrega:  p.fechaEntrega || "",
      costo:         p.costo || "",
      anticipo:      p.anticipo || "",
      estado:        p.estado,
      observaciones: p.observaciones || "",
    })
    setArchivoCot(p.archivoCot || null)
    setArchivoError("")
    setVista("formulario")
  }

  const handleGuardar = () => {
    const datos = {
      cliente:       form.nombre,
      correo:        form.correo,
      telefono:      form.telefono,
      servicio:      form.servicio,
      descripcion:   form.descripcion,
      cantidad:      form.cantidad,
      fechaEntrega:  form.fechaEntrega,
      costo:         parseFloat(form.costo)    || 0,
      anticipo:      parseFloat(form.anticipo) || 0,
      estado:        form.estado,
      observaciones: form.observaciones,
      archivoCot,
    }
    if (pedidoEditar) {
      actualizarPedido(pedidoEditar.id, datos)
      setVista("lista")
    } else {
      const nuevo = crearPedido({ ...form, archivoCot }, cotizOrigen?.id || null)
      setCodigoGenerado(nuevo.id)
    }
  }

  const estadoIdx = (estado) => estadosProgreso.findIndex(e => e.nombre === estado) + 1

  const filtrados = pedidos.filter((p) => {
    const texto  = (p.cliente + p.id).toLowerCase().includes(busqueda.toLowerCase())
    const estado = filtroEstado === "Todos" || p.estado === filtroEstado
    return texto && estado
  })

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 bg-gray-50 min-h-screen">

        {/* ── LISTA ── */}
        {vista === "lista" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-navy">Gestión de Pedidos</h1>
                <p className="text-gray-500 text-sm mt-1">Administra todos los pedidos activos de DECORA</p>
              </div>
              <button onClick={handleNuevo}
                className="bg-navy text-white font-bold px-5 py-3 rounded-lg hover:bg-navy-light transition-colors">
                Nuevo pedido
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-3 mb-5">
                <input type="text" placeholder="Buscar por código o cliente..."
                  value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy">
                  <option>Todos</option>
                  <option>Pendiente</option>
                  <option>En produccion</option>
                  <option>Finalizado</option>
                  <option>Entregado</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-navy font-semibold">Código</th>
                      <th className="text-left py-3 px-2 text-navy font-semibold">Cliente</th>
                      <th className="text-left py-3 px-2 text-navy font-semibold">Servicio</th>
                      <th className="text-left py-3 px-2 text-navy font-semibold">Costo</th>
                      <th className="text-left py-3 px-2 text-navy font-semibold">Anticipo</th>
                      <th className="text-left py-3 px-2 text-navy font-semibold">Restante</th>
                      <th className="text-left py-3 px-2 text-navy font-semibold">Estado</th>
                      <th className="text-left py-3 px-2 text-navy font-semibold">Cotización</th>
                      <th className="text-left py-3 px-2 text-navy font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-gray-400 text-sm">
                          No hay pedidos que coincidan
                        </td>
                      </tr>
                    ) : (
                      filtrados.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-bold text-navy">{p.id}</td>
                          <td className="py-3 px-2 text-gray-700">{p.cliente}</td>
                          <td className="py-3 px-2 text-gray-500">{p.servicio}</td>
                          <td className="py-3 px-2 font-semibold text-navy">${Number(p.costo || 0).toLocaleString()}</td>
                          <td className="py-3 px-2 text-gray-600">
                            {p.anticipo > 0 ? `$${Number(p.anticipo).toLocaleString()}` : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="py-3 px-2 font-semibold text-red-500">
                            ${(Number(p.costo || 0) - Number(p.anticipo || 0)).toLocaleString()}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeEstado(p.estado)}`}>
                              {p.estado}
                            </span>
                          </td>
                          {/* Columna cotización — acceso directo sin entrar a editar */}
                          <td className="py-3 px-2">
                            {p.archivoCot?.base64 ? (
                              <button
                                onClick={() => abrirArchivo(p.archivoCot)}
                                className="flex items-center gap-1 text-navy text-xs font-semibold hover:text-golden transition-colors"
                                title={p.archivoCot.nombre}
                              >
                                <span>📄</span>
                                <span className="max-w-[80px] truncate">{p.archivoCot.nombre}</span>
                              </button>
                            ) : (
                              <span className="text-gray-300 text-xs">Sin archivo</span>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <button onClick={() => handleEditar(p)}
                                className="bg-navy text-white text-xs px-3 py-1 rounded-lg hover:bg-navy-light">
                                Editar
                              </button>
                              <button onClick={() => setConfirmarEliminar(p.id)}
                                className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200">
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── FORMULARIO ── */}
        {vista === "formulario" && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setVista("lista")} className="text-navy font-semibold hover:text-golden transition-colors">
                ← Volver
              </button>
              <span className="text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-navy">
                {pedidoEditar ? "Editar pedido" : "Nuevo pedido"}
              </h1>
            </div>

            {cotizOrigen && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <p className="text-sm font-semibold text-navy">Generando pedido desde cotización {cotizOrigen.id}</p>
                  <p className="text-xs text-gray-500">Datos del cliente pre-llenados. Completa fecha, costo y adjunta la cotización final aprobada.</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6 max-w-3xl">

              {/* Datos del cliente */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-navy mb-4">Datos del cliente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Nombre completo *</label>
                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                      placeholder="Nombre del cliente"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Correo electrónico</label>
                    <input type="email" name="correo" value={form.correo} onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Teléfono</label>
                    <input type="text" name="telefono" value={form.telefono} onChange={handleChange}
                      placeholder="+52 999 000 0000"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
                  </div>
                </div>
              </div>

              {/* Detalle del proyecto */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-navy mb-4">Detalle del proyecto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Tipo de servicio *</label>
                    <select name="servicio" value={form.servicio} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy">
                      <option value="">Selecciona un servicio</option>
                      <option>Tapiceria de sala</option>
                      <option>Tapiceria de sillas</option>
                      <option>Cabecera de cama</option>
                      <option>Instalacion de papel tapiz</option>
                      <option>Alfombras y tapetes</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Número de piezas</label>
                    <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange}
                      placeholder="Ej. 3" min="1"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Fecha estimada de entrega</label>
                    <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-navy mb-1">Descripción del trabajo</label>
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                      placeholder="Describe los detalles del proyecto..." rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy resize-none" />
                  </div>
                </div>
              </div>

              {/* Cotización final — subir archivo */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-navy mb-1">Cotización final aprobada</h2>
                <p className="text-xs text-gray-400 mb-4">
                  Adjunta el documento de cotización aprobado por el cliente. Este archivo estará visible directamente en la tabla de pedidos. Máx. 5 MB.
                </p>

                {archivoCot ? (
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-sm font-semibold text-navy">{archivoCot.nombre}</p>
                        <button onClick={() => abrirArchivo(archivoCot)}
                          className="text-xs text-golden hover:underline">
                          Ver archivo
                        </button>
                      </div>
                    </div>
                    <button onClick={() => setArchivoCot(null)}
                      className="text-gray-400 hover:text-red-500 font-bold text-xl transition-colors" title="Quitar archivo">
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-8 cursor-pointer hover:border-navy transition-colors">
                    <span className="text-4xl mb-2">📂</span>
                    <p className="text-sm font-semibold text-navy">Haz clic para seleccionar archivo</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — máx. 2 MB</p>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleArchivo} className="hidden" />
                  </label>
                )}
                {archivoError && <p className="text-red-500 text-xs mt-2">{archivoError}</p>}
              </div>

              {/* Costo */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-navy mb-4">Costo final acordado</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Importe total (MXN)</label>
                    <input type="number" name="costo" value={form.costo} onChange={handleChange} placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Anticipo recibido (MXN)</label>
                    <input type="number" name="anticipo" value={form.anticipo} onChange={handleChange} placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy" />
                  </div>
                  <div className="flex items-end">
                    <div className="bg-gray-50 rounded-lg px-4 py-2 w-full text-sm">
                      <p className="text-gray-400">Restante a cobrar</p>
                      <p className="font-bold text-red-500 text-lg">
                        ${form.costo ? (parseFloat(form.costo) - (parseFloat(form.anticipo) || 0)).toLocaleString() : "0.00"} MXN
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-navy mb-4">Estado del pedido</h2>
                <div className="flex items-center justify-between mb-4 relative">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0" />
                  <div className="absolute top-5 left-0 h-1 bg-navy z-0 transition-all duration-500"
                    style={{ width: `${((estadoIdx(form.estado) - 1) / 3) * 100}%` }} />
                  {estadosProgreso.map((e) => {
                    const actual = estadoIdx(form.estado)
                    return (
                      <div key={e.id} className="flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                          e.id < actual   ? "bg-golden border-golden text-white" :
                          e.id === actual ? "bg-navy border-navy text-white" :
                                            "bg-white border-gray-300 text-gray-400"
                        }`}>
                          {e.id < actual ? "✓" : e.icono}
                        </div>
                        <p className={`text-xs mt-1 font-semibold text-center ${e.id === actual ? "text-navy" : "text-gray-400"}`}>
                          {e.nombre}
                        </p>
                      </div>
                    )
                  })}
                </div>
                <select name="estado" value={form.estado} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy">
                  <option>Pendiente</option>
                  <option>En produccion</option>
                  <option>Finalizado</option>
                  <option>Entregado</option>
                </select>
              </div>

              {/* Observaciones */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-navy mb-2">Observaciones para el cliente</h2>
                <p className="text-xs text-gray-400 mb-3">Este texto será visible en la página de rastreo del cliente.</p>
                <textarea name="observaciones" value={form.observaciones} onChange={handleChange}
                  placeholder="Ej. El proyecto se encuentra en proceso de corte de tela..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-navy resize-none" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setVista("lista")}
                  className="border-2 border-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleGuardar}
                  className="bg-navy text-white font-bold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors">
                  {pedidoEditar ? "Guardar cambios" : "Guardar y generar pedido"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── MODAL código generado ── */}
        {codigoGenerado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8 text-center">
              <span className="text-6xl">🎉</span>
              <h2 className="text-xl font-bold text-navy mt-4">Pedido creado exitosamente</h2>
              <p className="text-gray-500 text-sm mt-2">Comparte este código con el cliente</p>
              <div className="bg-gray-50 rounded-xl px-6 py-4 mt-4">
                <p className="text-3xl font-bold text-navy tracking-wider">{codigoGenerado}</p>
              </div>
              <button onClick={() => navigator.clipboard.writeText(codigoGenerado)}
                className="mt-4 w-full border-2 border-navy text-navy font-bold py-3 rounded-lg hover:bg-navy hover:text-white transition-colors">
                Copiar código
              </button>
              <button onClick={() => { setCodigoGenerado(null); setVista("lista") }}
                className="mt-3 w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* ── MODAL confirmar eliminar ── */}
        {confirmarEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
              <span className="text-5xl">⚠️</span>
              <h2 className="font-bold text-navy text-lg mt-4">¿Eliminar este pedido?</h2>
              <p className="text-gray-500 text-sm mt-2">
                Esta acción no se puede deshacer. El pedido se eliminará permanentemente.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setConfirmarEliminar(null)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={() => { eliminarPedido(confirmarEliminar); setConfirmarEliminar(null) }}
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL visor de archivo ── */}
        {modalArchivo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col z-50">
            <div className="flex items-center justify-between px-6 py-3 bg-navy">
              <p className="text-white text-sm font-semibold truncate">📄 {modalArchivo.nombre}</p>
              <div className="flex gap-3">
                <a href={modalArchivo.blobUrl} download={modalArchivo.nombre}
                  className="text-golden text-xs font-semibold hover:underline">
                  Descargar
                </a>
                <button onClick={() => { URL.revokeObjectURL(modalArchivo.blobUrl); setModalArchivo(null) }}
                  className="text-white hover:text-golden font-bold text-xl">
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-900 flex items-center justify-center p-4">
              {modalArchivo.tipo === "application/pdf" ? (
                <iframe
                  src={modalArchivo.blobUrl}
                  className="w-full h-full rounded"
                  title={modalArchivo.nombre}
                />
              ) : (
                <img
                  src={modalArchivo.blobUrl}
                  alt={modalArchivo.nombre}
                  className="max-h-full max-w-full object-contain rounded"
                />
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}