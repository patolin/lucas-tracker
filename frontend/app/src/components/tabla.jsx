export const Tabla = ({ data, actividades }) => {
  if (!data) {
    return <p>No existen datos para visualizar</p>;
  }

  return (
    <table className='table-auto w-full border-collapse border border-gray-300'>
      <thead>
        <tr className='bg-gray-100'>
          <th className='border border-gray-300 px-4 py-2'>Fecha</th>
          <th className='border border-gray-300 px-4 py-2'>Hora</th>
          <th className='border border-gray-300 px-4 py-2'>Actividad</th>
          <th className='border border-gray-300 px-4 py-2'>Cantidad</th>
          <th className='border border-gray-300 px-4 py-2'>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className='border border-gray-300 px-4 py-2'>
              {String(item.fecha).split('T')[0]}
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              {String(item.fecha).split('T')[1]}
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              {actividades[item.id_actividad]}
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              {item.cantidad}
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              {item.observaciones}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
