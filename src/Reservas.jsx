import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservas = () => {
    //const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato yyyy-mm-dd
    const today = new Date().toLocaleDateString('en-CA'); // Formato yyyy-mm-dd en tu zona horaria

    const [formData, setFormData] = useState({
       persona:
       {
        nombres: '',
        apellidos: '',
        telefono: '',
        nroDocumento: ''
       },
        servicioId: '', // Inicializa como vacío
        fecha: today,
        horario: ''
    });

    const [servicios, setServicios] = useState([]); // Para almacenar los servicios
    const [isEditing, setIsEditing] = useState(false);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [reservas, setReservas] = useState([]); // Estado para almacena reservas

    useEffect(() => {
        console.log('formData actualizado:', formData); // Para observar cada vez que formData cambie
    }, [formData]);  // Esto se ejecuta cada vez que formData cambia

    // Todos los horarios en el formato 06:00 AM - 10:00 PM
    const horarios = [
        "06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM",
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
        "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
        "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM",
        "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM",
        "09:00 PM - 10:00 PM"
    ];

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/reserva');
                setReservas(response.data);
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
            }
        };
        fetchReservas();
    }, []); // <- Aquí faltaba cerrar el useEffect

    useEffect(() => {
        // Cargar servicios
        const fetchServicios = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/getservicios');
                console.log('Servicios obtenidos:', response.data);
                setServicios(response.data);
            } catch (error) {
                console.error('Error al cargar los servicios:', error);
            }
        };
        fetchServicios();

        // Cargar horarios disponibles inicialmente
        setHorariosDisponibles(horarios);
    }, []);




    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'servicioId') {
            const selectedService = servicios.find(servicio => 
                servicio.idServicio === parseInt(value) // Convertimos a número para asegurar coincidencia
            );
    
            setFormData(prevState => ({
                ...prevState,
                servicioId: value, // Actualiza el ID del servicio
                nombre: selectedService ? selectedService.nombre : '' // Actualiza el nombre del servicio si se encuentra
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    
        console.log(`Campo ${name} actualizado:`, value); // Para debug
    };
    




    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateReserva();
            } else {
                await registerReserva();
            }
            handleReset();
        } catch (error) {
            console.error('Error al registrar o actualizar Reserva:', error);
        }
    };

    const registerReserva = async () => {
        const data = {
            persona: {
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                telefono: formData.telefono,
                numeroDocumento: formData.nroDocumento
            },
            servicioId: formData.servicioId, // Usa el servicioId del formulario
            fecha: formData.fecha,
            hora: formData.horario
        };

        console.log('Datos que se envían a la API:', data);
        try {
            const response = await axios.post('http://localhost:8081/api/createReserva', data);
            setReservas([...reservas, response.data]);
        } catch (error) {
            console.error('Error al registrar reserva:', error);
        }
    };

 
    const updateReserva = async () => {
        const personaData = {
            idPersona: formData.idPersona,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            numeroDocumento: formData.nroDocumento,
        };
    
        const reservaData = {
            idReserva:formData.idReserva,
            fecha: formData.fecha,
            hora: formData.horario,
        };
    
        //Obtener el nombre del servicio actualizado
        const servicioSeleccionado = servicios.find(servicio => servicio.idServicio === parseInt(formData.servicioId)); // Convierto a número para asegurar coincidencia
    
        const servicioData = {
            idServicio: formData.servicioId,
            nombre: servicioSeleccionado ? servicioSeleccionado.nombre : '' // Usa el nombre del servicio seleccionado
        };
    
        try {
            // Actualiza la persona
            await axios.put('http://localhost:8081/api/personaUpdate', personaData);
    
            // Actualiza la reserva
            await axios.put('http://localhost:8081/api/reservaUpdate',reservaData );
               // idReserva: formData.idReserva,
                //...reservaData
    
            // Actualiza el servicio
            console.log('Servicios observa', servicioData);
            await axios.put('http://localhost:8081/api/servicioUpdate', servicioData);
    
            // Actualiza el estado local de reservas
            const updatedReservas = reservas.map(reserva =>
                reserva.idReserva === formData.idReserva ? { 
                    ...reserva, 
                    ...reservaData, 
                    persona: personaData,
                    servicio: { ...servicioData } 
                } : reserva
            );
            setReservas(updatedReservas);
    
            console.log('Actualización exitosa en las tres tablas');
        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    };
    
    const handleEdit = (reserva) => {
        console.log('Servicio seleccionado:', reserva.servicio.nombre); 
        setFormData({
            idReserva: reserva.idReserva, // Captura el ID de la reserva
            idPersona: reserva.persona.idPersona, // Captura el ID de la persona
            nombres: reserva.persona.nombres, // Acceso directo a los nombres
            apellidos: reserva.persona.apellidos, // Acceso directo a los apellidos
            telefono: reserva.persona.telefono, // Acceso directo al teléfono
            nroDocumento: reserva.persona.numeroDocumento, // Acceso directo al documento
            servicioId: reserva.servicio.idServicio, // Captura el ID del servicio
            nombre:reserva.servicio.nombre,
            fecha: reserva.fecha, // Captura la fecha
            horario: reserva.hora // Captura el horario
        });
        setIsEditing(true);
    };
    

    const handleReset = () => {
        setFormData({
            nombres: '',
            apellidos: '',
            telefono: '',
            nroDocumento: '',
            servicioId: '', // Reinicia también este campo
            fecha: today,
            horario: ''
        });
        setIsEditing(false);
    };

    const deleteReserva = async (idReserva) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
            try {
                await axios.delete(`http://localhost:8081/api/reserva/${idReserva}`);
                const updatedReservas= reservas.filter(reserva => reserva.idReserva !== idReserva);
                setReservas(updatedReservas);
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            }
        }
    };

    return (
        <div className="row">
            <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Registro Reservas</h5>
                        <form onSubmit={handleSubmit}>
                             {/* Campo Nombres */}
                             <div className="form-group">
                                <label>Nombres</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            {/* Campo Apellidos */}
                            <div className="form-group">
                                <label>Apellidos</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Campo Teléfono */}
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Campo Número de Documento */}
                            <div className="form-group">
                                <label>Número de Documento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nroDocumento"
                                    value={formData.nroDocumento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Campo Servicio (Lista desplegable) */}
                            <div className="form-group">
                                <label>Servicio</label>
                                <select
                                    className="form-control"
                                    name="servicioId" 
                                    value={formData.servicioId} // Valor del select basado en el estado
                                    onChange={handleChange} // Función para manejar cambios
                                    required
                                 >
                                    <option value="">Seleccione un servicio</option>
                                    {servicios.map((servicio) => (
                                        <option key={servicio.idServicio} value={servicio.idServicio}>
                                            {servicio.nombre} {/* Cmostrar el nombre del servicio */}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Campo Fecha */}
                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fecha"
                                    value={formData.fecha}
                                    min={today} // Restringe la selección de fechas a la actual o futuras
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Campo Horario (Lista desplegable) */}
                            <div className="form-group">
                                <label>Horario</label>
                                <select
                                    className="form-control"
                                    name="horario"
                                    value={formData.horario}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un horario</option>
                                    {horariosDisponibles.map((horario, index) => (
                                        <option key={index} value={horario}>
                                            {horario}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Actualizar' : 'Registrar'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-md-9">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Reservas  Registradas</h5>
                        <table className="table">
                            <thead className="bg-dark text-white">
                                <tr>
                                    <th scope="col">Nombres</th>
                                    <th scope="col">Apellidos</th>
                                    <th scope="col">Teléfono</th>
                                    <th scope="col">Documento</th>
                                    <th scope="col">Servicio</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Horario</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.idReserva}>
                                        <td>{reserva.persona.nombres}</td>
                                        <td>{reserva.persona.apellidos}</td> {/* Persona en reserva */}
                                        <td>{reserva.persona.telefono}</td> 
                                        <td>{reserva.persona.numeroDocumento}</td> 
                                        <td>{reserva.servicio?.nombre || 'Servicio no disponible'}</td> 
                                        <td>{reserva.fecha}</td>
                                        <td>{reserva.hora}</td> 
                                        <td>
                                            <button className="btn btn-warning" onClick={() => handleEdit(reserva)}>Editar</button>
                                            <button className="btn btn-danger" onClick={() => deleteReserva(reserva.id)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservas;
