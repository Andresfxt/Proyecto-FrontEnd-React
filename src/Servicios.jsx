import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Reservas from './Reservas'; 

const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [formData, setFormData] = useState({
        idServicio: '',
        nombreServicio: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // Cargar los servicios al iniciar el componente
    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/getservicios');
                setServicios(response.data);
            } catch (error) {
                console.error('Error al cargar los servicios:', error);
            }
        };

        fetchServicios();
    }, []);

 

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Enviar el formulario (crear o actualizar servicio)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateServicio();
            } else {
                await registerServicio();
            }
            handleReset();
        } catch (error) {
            console.error('Error al registrar o actualizar el servicio:', error);
        }
    };

    // Registrar nuevo servicio
    const registerServicio = async () => {
        const data = {
            nombre: formData.nombreServicio
        };
        try {
            const response = await axios.post('http://localhost:8081/api/createServicio', data);
            setServicios([...servicios, response.data]); // Agregar el servicio registrado a la lista
        } catch (error) {
            console.error('Error al registrar el servicio:', error);
        }
    };

    // Actualizar servicio existente
    const updateServicio = async () => {
        const data = {
            idServicio: formData.idServicio,
            nombre: formData.nombreServicio
        };

        try {
            await axios.put(`http://localhost:8081/api/servicioUpdate`, data);
            const updatedServicios = servicios.map(servicio =>
                servicio.idServicio === formData.idServicio ? { ...servicio, ...data } : servicio
            );
            setServicios(updatedServicios);
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
        }
    };

    // Editar servicio
    const handleEdit = (servicio) => {
        console.log(servicio);
        setFormData({
            idServicio: servicio.idServicio,
            nombreServicio: servicio.nombre
        });
        setIsEditing(true);
    };

    // Reiniciar el formulario
    const handleReset = () => {
        setFormData({
            idServicio: '',
            nombreServicio: ''
        });
        setIsEditing(false);
    };

    // Eliminar servicio
    const deleteServicio = async (idServicio) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            try {
                await axios.delete(`http://localhost:8081/api/servicio/${idServicio}`);
                const updatedServicios = servicios.filter(servicio => servicio.idServicio !== idServicio);
                setServicios(updatedServicios);
            } catch (error) {
                console.error('Error al eliminar el servicio:', error);
            }
        }
    };

    return (

    
        
        <div className="row">
            <div className="card col-md-4">
                <div className="card-body">
                    <h5 className="card-title">{isEditing ? 'Editar Servicio' : 'Registrar Servicio'}</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Servicio</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombreServicio"
                                value={formData.nombreServicio|| ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between mt-3">
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

            <div className="col-md-8">
                <table className="table">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th scope="col">Servicio</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.map((servicio) => (
                            <tr key={servicio.idServicio}>
                                <td>{servicio.nombre}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={() => handleEdit(servicio)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-danger" onClick={() => deleteServicio(servicio.idServicio)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
        
                    </tbody>
                </table>
            </div>
         
            
        </div>
        
    );

};

export default Servicios;
