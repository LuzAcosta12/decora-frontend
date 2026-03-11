import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../../context/AppContext"

/**
 * Login.jsx
 * Autenticación del administrador.
 *
 * Actualmente valida contra credenciales hardcodeadas (demo).
 * TODO (Martín): reemplazar el bloque de validación por:
 *   const { data } = await api.post("/auth/login", { usuario, password })
 *   login(data.token)
 */
export default function Login() {
  const [form, setForm]   = useState({ usuario: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useApp()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // ── Demo: credenciales fijas ──────────────────────────────────────────────
    // TODO (Martín): reemplazar por llamada API real
    await new Promise(r => setTimeout(r, 400)) // simula latencia de red
    if (form.usuario === "admin" && form.password === "1234") {
      login("demo-token-admin") // cuando Martín entregue JWT, se pasa aquí
      navigate("/admin/dashboard")
    } else {
      setError("Usuario o contraseña incorrectos")
    }
    // ─────────────────────────────────────────────────────────────────────────

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">

        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-navy">DECORA</p>
          <p className="text-gray-500 text-sm mt-1">Panel Administrativo</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Usuario</label>
            <input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="admin"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-colors mt-2 disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Acceso restringido al personal autorizado de DECORA
        </p>
      </div>
    </div>
  )
}