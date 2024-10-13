import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Principal from './Principal';
import Usuarios from './Usuarios'; 
import Servicios from './Servicios';
import Reservas from './Reservas';

const App = () => {
    const [usuario, setUsuario] = useState(null); // Estado para el usuario

    return (
       
            <Routes>
                <Route path="/" element={<Login setUsuario={setUsuario} />} />
                {/* Ruta principal que incluye el navbar y las rutas secundarias */}
                <Route path="/principal" element={<Principal usuario={usuario} />}>
                    <Route path="usuarios" element={<Usuarios setUsuario={setUsuario} />} />
                    <Route path="servicios" element={<Servicios />} />  
                    <Route path="reservas" element={<Reservas />} />  
                </Route>
            </Routes>
      
    );
};

export default App;
