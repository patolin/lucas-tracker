import { useState } from 'react';

export const FormIngreso = ({
  actividades,
  closeModalCallback,
  data,
  setData,
}) => {
  const [form, setForm] = useState({
    fecha: '',
    id_actividad: '',
    cantidad: undefined,
    observaciones: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({ form });
      const response = await fetch('/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const newData = await response.json();
        setData((prevData) => [form, ...prevData]);
        setForm({
          fecha: '',
          id_actividad: '',
          cantidad: undefined,
          observaciones: '',
        });
        // cerrar modal
        closeModalCallback();
      } else {
        console.error('Failed to post data');
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block mb-1 font-medium'>Fecha</label>
        <input
          type='datetime-local'
          name='fecha'
          value={form.fecha}
          onChange={handleChange}
          className='w-full border rounded px-3 py-2'
          required
        />
      </div>
      <div>
        <label className='block mb-1 font-medium'>Actividad</label>
        <select
          name='id_actividad'
          onChange={handleChange}
          className='w-full border rounded px-3 py-2'
          required
        >
          <option key={-1} value={''}>
            Escoja una opción
          </option>
          {actividades &&
            actividades.map((actividad) => (
              <option key={actividad.id} value={actividad.id}>
                {actividad.nombre}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className='block mb-1 font-medium'>Cantidad</label>
        <input
          type='number'
          name='cantidad'
          value={form.cantidad}
          onChange={handleChange}
          className='w-full border rounded px-3 py-2'
        />
      </div>
      <div>
        <label className='block mb-1 font-medium'>Observaciones</label>
        <textarea
          name='observaciones'
          value={form.observaciones}
          onChange={handleChange}
          className='w-full border rounded px-3 py-2'
        />
      </div>
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
      >
        Agregar
      </button>
    </form>
  );
};
