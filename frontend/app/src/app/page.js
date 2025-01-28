'use client';

import { useState, useEffect } from 'react';
import { Tabla } from '@/components/tabla';
import { Modal } from '@/components/modal';
import { FormIngreso } from '@/components/formIngreso';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
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

  const objActividades = {};
  actividades &&
    actividades.forEach((item) => {
      objActividades[item.id] = item.nombre;
    });
  return (
    <div className='container mx-auto p-4'>
      <button
        onClick={() => setModalOpen(true)}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Agregar
      </button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className='text-xl font-bold mt-6 mb-4'>Añadir nueva actividad</h2>
        <FormIngreso
          actividades={actividades}
          data={data}
          setData={setData}
          closeModalCallback={() => {
            console.log('>>> cierra');
            setModalOpen(false);
          }}
        />
      </Modal>
      <h2 className='text-2xl font-bold mb-4'>Qué hizo el Lucas?</h2>
      <Tabla data={data} actividades={objActividades} />
    </div>
  );
}
