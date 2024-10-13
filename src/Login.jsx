import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUsuario }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/login', {
                email: email.trim(),
                password: password.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const user = {
                
                email: email.trim()
            };

            console.log('Login successful:', response.data);
            setUsuario(user); // Asegúrate de que 'user' exista en la respuesta
            navigate('/principal'); // Navega a la ruta principal
        } catch (err) {
            console.error('Login failed:', err);
            const errorMessage = err.response?.data?.message || 'Invalid email or password';
            setError(errorMessage);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card" style={{ width: '24rem' }}>
                <div className="card-body">
                    <h4 className="card-title text-center mb-4">Login</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-4">Login</button>
                    </form>
                    {error && <p className="text-danger text-center mt-3">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
