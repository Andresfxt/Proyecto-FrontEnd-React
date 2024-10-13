import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    const [formData, setFormData] = useState({
        idCliente: '',
        nombres: '',
        primerApellido: '',
        segundoApellido: '',
        nroDocumento: '',
        telefono: '',
        email: '',
        password: '',
        usuario: {
            idUsuario: ''
        }
    });
    
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/getclientes');
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
            }
        };

        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateUsuario();
            } else {
                await registerUsuario();
            }
            handleReset();
        } catch (error) {
            console.error('Error al registrar o actualizar el usuario:', error);
        }
    };

    const registerUsuario = async () => {
        const data = {
            nombres: formData.nombres,
            primerApellido: formData.primerApellido,
            segundoApellido: formData.segundoApellido,
            nroDocumento: formData.nroDocumento,
            telefono: formData.telefono,
            usuario: {
                email: formData.email,
                password: formData.password
            }
        };
        try {
            const response = await axios.post('http://localhost:8081/api/createCliente', data);
            setUsuarios([...usuarios, response.data]);
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
        }
    };

    const updateUsuario = async () => {
        const data = {
            idCliente: formData.idCliente,
            nombres: formData.nombres,
            primerApellido: formData.primerApellido,
            segundoApellido: formData.segundoApellido,
            nroDocumento: formData.nroDocumento,
            telefono: formData.telefono,
            usuario: {
                idUsuario: formData.usuario.idUsuario,
                email: formData.email,
                password: formData.password
            }
        };

        try {
            await axios.put('http://localhost:8081/api/clienteUpdate', data);
            const updatedUsuarios = usuarios.map(usuario =>
                usuario.idCliente === formData.idCliente ? { ...usuario, ...data } : usuario
            );
            setUsuarios(updatedUsuarios);

            setUsuario(prev => ({
                ...prev,
                email: data.usuario.email // Actualiza el correo del usuario
            }));
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    };

    const handleEdit = (usuario) => {
        setFormData({
            idCliente: usuario.idCliente,
            nombres: usuario.nombres,
            primerApellido: usuario.primerApellido,
            segundoApellido: usuario.segundoApellido,
            nroDocumento: usuario.nroDocumento,
            telefono: usuario.telefono,
            email: usuario.usuario.email,
            password: '', // No mostrar la contraseña por razones de seguridad
            usuario: {
                idUsuario: usuario.usuario.idUsuario
            }
        });
        setIsEditing(true);
    };

    const handleReset = () => {
        setFormData({
            idCliente: '',
            nombres: '',
            primerApellido: '',
            segundoApellido: '',
            nroDocumento: '',
            telefono: '',
            email: '',
            password: '',
            usuario: {
                idUsuario: ''
            }
        });
        setIsEditing(false);
    };

    const deleteUsuario = async (idCliente) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await axios.delete(`http://localhost:8081/api/cliente/${idCliente}`);
                const updatedUsuarios = usuarios.filter(usuario => usuario.idCliente !== idCliente);
                setUsuarios(updatedUsuarios);
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            }
        }
    };

    return (

        
        <div className="row">
            <div className="card col-md-4">
                <div className="card-body">
                    <h5 className="card-title">{isEditing ? 'Editar Usuario' : 'Registrar Usuario'}</h5>
                    <form onSubmit={handleSubmit}>
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
                        <div className="form-group">
                            <label>Primer Apellido</label>
                            <input
                                type="text"
                                className="form-control"
                                name="primerApellido"
                                value={formData.primerApellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Segundo Apellido</label>
                            <input
                                type="text"
                                className="form-control"
                                name="segundoApellido"
                                value={formData.segundoApellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!isEditing}
                            />
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

            <div className="col-md-8">
                <table className="table">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th scope="col">Nombres</th>
                            <th scope="col">Primer Apellido</th>
                            <th scope="col">Segundo Apellido</th>
                            <th scope="col">Documento</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Email</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.idCliente}>
                                <td>{usuario.nombres}</td>
                                <td>{usuario.primerApellido}</td>
                                <td>{usuario.segundoApellido}</td>
                                <td>{usuario.nroDocumento}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.usuario.email}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={() => handleEdit(usuario)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => deleteUsuario(usuario.idCliente)}>
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

export default Usuarios;
