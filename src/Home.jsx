import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [reservas, setReservas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Datos de prueba
  const pruebaReservas = [
    { id: 1, nombre: 'Servicio A', fechaInicio: '2024-09-16', fechaFin: '2024-09-17' },
    { id: 2, nombre: 'Servicio B', fechaInicio: '2024-09-18', fechaFin: '2024-09-19' },
    { id: 3, nombre: 'Servicio C', fechaInicio: '2024-09-20', fechaFin: '2024-09-21' }
  ];

  // Función para listar reservas (con datos de prueba)
  const fetchReservas = () => {
    setReservas(pruebaReservas);
  };

  // Función para crear una nueva reserva
  const createReserva = () => {
    const newReserva = { id: Date.now(), nombre, fechaInicio, fechaFin };
    setReservas([...reservas, newReserva]);
    closeModal();
  };

  // Función para actualizar una reserva
  const updateReserva = () => {
    const updatedReservas = reservas.map(reserva =>
      reserva.id === selectedReserva.id
        ? { ...reserva, nombre, fechaInicio, fechaFin }
        : reserva
    );
    setReservas(updatedReservas);
    closeModal();
  };

  // Función para eliminar una reserva
  const deleteReserva = (id) => {
    const filteredReservas = reservas.filter(reserva => reserva.id !== id);
    setReservas(filteredReservas);
  };

  // Función para abrir el modal
  const openModal = () => {
    setNombre('');
    setFechaInicio('');
    setFechaFin('');
    setSelectedReserva(null);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Gestión de Reservas</h1>

      <button
        className="btn btn-primary mb-4"
        onClick={openModal}
      >
        Crear Reserva
      </button>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.nombre}</td>
              <td>{new Date(reserva.fechaInicio).toLocaleDateString()}</td>
              <td>{new Date(reserva.fechaFin).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-warning mr-2"
                  onClick={() => {
                    setNombre(reserva.nombre);
                    setFechaInicio(reserva.fechaInicio);
                    setFechaFin(reserva.fechaFin);
                    setSelectedReserva(reserva);
                    openModal();
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteReserva(reserva.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para Crear/Actualizar Reserva */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">{selectedReserva ? 'Actualizar Reserva' : 'Crear Reserva'}</h5>
              <button type="button" className="close" onClick={closeModal} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="modalNombre">Nombre</label>
                <input
                  type="text"
                  id="modalNombre"
                  className="form-control"
                  placeholder="Ingrese el nombre del servicio"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalFechaInicio">Fecha de Inicio</label>
                <input
                  type="date"
                  id="modalFechaInicio"
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalFechaFin">Fecha de Fin</label>
                <input
                  type="date"
                  id="modalFechaFin"
                  className="form-control"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
              <button
                type="button"
                className={`btn ${selectedReserva ? 'btn-warning' : 'btn-primary'}`}
                onClick={selectedReserva ? updateReserva : createReserva}
              >
                {selectedReserva ? 'Actualizar Reserva' : 'Crear Reserva'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

