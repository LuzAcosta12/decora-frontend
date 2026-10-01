export default function TarjetaProspecto({ prospecto, onDragStart, onClick }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, prospecto.id)}
      onClick={() => onClick(prospecto)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 cursor-pointer hover:shadow-md hover:border-golden transition-all"
    >
      <p className="font-semibold text-navy text-sm">{prospecto.nombre}</p>
      <p className="text-xs text-gray-500 mt-1">{prospecto.servicioInteres}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
          {prospecto.canalOrigen}
        </span>
        <span className="text-[10px] text-gray-400">{prospecto.fecha}</span>
      </div>
    </div>
  )
}