import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Link } from "react-router-dom"

export default function AcercaDe() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Quienes somos
          </p>
          <h1 className="text-4xl font-bold">Sobre DECORA</h1>
          <p className="text-gray-300 mt-4 text-lg">
            Mas de tres decadas ofreciendo servicios de tapiceria y decoracion
            en Cancun, Quintana Roo.
          </p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Nuestra historia
          </p>
          <h2 className="text-3xl font-bold text-navy mb-6">
            Desde 1988 renovando espacios
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            DECORA inicio operaciones el 10 de mayo de 1988 en la ciudad de Cancun,
            Quintana Roo, fundada por el C. Jose Brigido Tun Tamayo, quien comenzo
            realizando trabajos de reparacion basica de muebles tapizados de manera
            independiente.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Con el crecimiento poblacional de la ciudad, aumento la demanda de
            mantenimiento de mobiliario domestico. DECORA comenzo a recibir un mayor
            numero de pedidos relacionados con retapizado completo de salas,
            restauracion de sillas de comedor y sustitucion de espumas.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Actualmente DECORA continua operando como una empresa de servicios
            especializada en reparacion de tapiceria de muebles para el hogar,
            conservando su experiencia acumulada a lo largo de mas de tres decadas.
          </p>
        </div>
      </section>

      {/* MISION Y VISION */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Mision */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Mision</h3>
              <p className="text-gray-600 leading-relaxed">
                Brindar servicios de reparacion y restauracion de tapiceria para
                muebles del hogar, ofreciendo atencion directa al cliente y
                soluciones acordes a sus necesidades, con el proposito de prolongar
                la vida util del mobiliario y asegurar la calidad en cada servicio.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-12 h-12 bg-golden rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔭</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser una empresa reconocida a nivel local por la calidad y
                confiabilidad de sus servicios de tapiceria, consolidando procesos
                organizados de atencion y control de pedidos que permitan mejorar
                la administracion del trabajo y la satisfaccion del cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-golden text-sm font-semibold uppercase tracking-widest mb-2">
            Como trabajamos
          </p>
          <h2 className="text-3xl font-bold text-navy mb-12">Nuestros valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-4">🤝</span>
              <h3 className="font-bold text-navy text-lg mb-2">Responsabilidad</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Cumplimos los compromisos adquiridos con cada cliente en tiempo y forma.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-4">💎</span>
              <h3 className="font-bold text-navy text-lg mb-2">Calidad</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Priorizamos la funcionalidad y seguridad del mueble antes de su entrega.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-4">🔒</span>
              <h3 className="font-bold text-navy text-lg mb-2">Honestidad</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Mantenemos transparencia en la valoracion del estado del mobiliario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 px-6 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">
            Listo para trabajar con nosotros?
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Contactanos y cuentanos tu proyecto.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link
              to="/cotizacion"
              className="bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar cotizacion
            </Link>
            <Link
              to="/contacto"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-colors"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}