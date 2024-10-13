import React from 'react';
import ReactDOM from 'react-dom/client'; // Actualización de importación
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root')); // Crear el root
root.render(
  <React.StrictMode> {/* Es recomendable envolver tu app en StrictMode */}
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

