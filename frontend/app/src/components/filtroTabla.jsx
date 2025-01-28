import React, { useState, useEffect } from 'react';

export const FiltroTabla = ({ onFilter }) => {
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [idTipo, setIdTipo] = useState('');
  const [tipoTareas, setTipoTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task types from API
  useEffect(() => {
    const fetchTiposTareas = async () => {
      try {
        const response = await fetch('/api/tipos-tareas');
        if (!response.ok) throw new Error('Error al leer tipos de tareas');
        const data = await response.json();
        setTipoTareas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTiposTareas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct query parameters
    const params = new URLSearchParams();
    if (fecha) params.append('fecha', fecha);
    if (idTipo) params.append('id_tipo', idTipo);

    try {
      const response = await fetch(`/api/tareas?${params.toString()}`);
      if (!response.ok) throw new Error('Error al leer datos de tareas');
      const data = await response.json();
      onFilter(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className='text-red-500 p-4'>Error: {error}</div>;

  return (
    <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Date Input */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Fecha
            </label>
            <input
              type='date'
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Task Type Selector */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Tipo
            </label>
            {loading ? (
              <div className='animate-pulse p-2 bg-gray-200 rounded-md'>
                Cargando...
              </div>
            ) : (
              <select
                value={idTipo}
                onChange={(e) => setIdTipo(e.target.value)}
                className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value=''>Todos</option>
                {tipoTareas.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Filter Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Filtrar
        </button>

        {error && (
          <div className='text-red-500 text-sm mt-2'>
            Error aplicando filtros: {error}
          </div>
        )}
      </form>
    </div>
  );
};
