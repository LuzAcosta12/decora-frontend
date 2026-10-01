import TarjetaProspecto from "./TarjetaProspecto"

const colorEtapa = {
  "Nuevo":               "border-t-blue-400",
  "Contactado":          "border-t-yellow-400",
  "Cotización Enviada":  "border-t-purple-400",
  "Negociando":          "border-t-orange-400",
  "Confirmado":          "border-t-green-500",
  "Pospuesto":           "border-t-gray-400",
  "Cancelado":           "border-t-red-400",
}

export default function ColumnaKanban({ etapa, prospectos, onDragStart, onDragOver, onDrop, onCardClick }) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, etapa)}
      className={`bg-gray-50 rounded-xl border-t-4 ${colorEtapa[etapa] || "border-t-gray-300"} w-64 flex-shrink-0 flex flex-col`}
    >
      <div className="px-3 py-3 flex items-center justify-between">
        <p className="text-sm font-bold text-navy">{etapa}</p>
        <span className="text-xs bg-white text-gray-500 font-semibold px-2 py-0.5 rounded-full">
          {prospectos.length}
        </span>
      </div>
      <div className="px-2 pb-3 flex-1 min-h-[120px] overflow-y-auto max-h-[65vh]">
        {prospectos.length === 0 ? (
          <p className="text-xs text-gray-300 text-center mt-6">Sin prospectos</p>
        ) : (
          prospectos.map((p) => (
            <TarjetaProspecto key={p.id} prospecto={p} onDragStart={onDragStart} onClick={onCardClick} />
          ))
        )}
      </div>
    </div>
  )
}