'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Tabla } from '@/components/tabla';

export default function Home() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    fecha: '',
    id_actividad: '',
    cantidad: undefined,
    observaciones: '',
  });
  const [actividades, setActividades] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    fetch('/api/tareas')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error leyendo tareas:', error));
    fetch('/api/actividades')
      .then((response) => response.json())
      .then((data) => {
        setActividades(data);
      })
      .catch((error) => console.error('Error leyendo actividades:', error));
  }, []);

  // Handle form submission
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
        setData((prevData) => [form, ...prevData]); // Add new data to the table
        console.log('>>>', { data });
        setForm({
          fecha: '',
          id_actividad: '',
          cantidad: undefined,
          observaciones: '',
        }); // Reset form
      } else {
        console.error('Failed to post data');
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const objActividades = {};
  actividades &&
    actividades.forEach((item) => {
      objActividades[item.id] = item.nombre;
    });
  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold mt-6 mb-4'>Añadir nuevo</h2>
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

      <h2 className='text-2xl font-bold mb-4'>Qué hizo el Lucas?</h2>
      <Tabla data={data} actividades={objActividades} />
    </div>
  );
}
