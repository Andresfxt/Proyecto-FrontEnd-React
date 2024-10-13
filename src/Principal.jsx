import React from 'react';
import { Navbar, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import { NavLink, Outlet, useNavigate ,useLocation} from 'react-router-dom'; 
import './styles.css';

const Principal = ({ usuario }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Para obtener la ruta actual

    const handleNavigateToUsuarios = () => {
        navigate('usuarios');
    };

    const handleNavigateToServicios = () => {
        navigate('servicios');
    };

    const handleNavigateToReservas = () => {
        navigate('/reservas');
    };


    const handleLogout = () => {
        // Lógica para cerrar sesión
        
        navigate('/'); // ruta de tu página de inicio de sesión
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="#">Sistema de Gestión de Reservas Servicios</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} to="usuarios">Usuarios</Nav.Link>
                        <Nav.Link as={NavLink} to="servicios">Servicios</Nav.Link>
                        <Nav.Link as={NavLink} to="reservas">Reservas</Nav.Link>
                    </Nav>
                    <div className="dropdown-margin ml-auto">

                    <DropdownButton title={usuario ? usuario.email : 'Invitado'} id="dropdown-menu">
                        <Dropdown.Item href="#">
                        <img 
                          src="/images/perfil.png" // Ruta a la imagen
                          alt="Perfil"
                          style={{ width: '30px', height: '30px', marginRight: '8px' }} // Ajusta el tamaño y margen
    />

                        Perfil
                            
                        </Dropdown.Item>
                        <Dropdown.Item disabled>{usuario ? usuario.email : 'No disponible'}</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item as="button" onClick={handleLogout} className="text-danger"> {/* Cambia a un botón que llame a handleLogout */}
                                Cerrar Sesión
                            </Dropdown.Item>
                    </DropdownButton>
                  
                    </div>
                </Navbar.Collapse>
            </Navbar>


            
            {location.pathname === '/principal' && (
            <div className="main-page-card-container">
            <div className="card">
              <img src="/images/Coworking.jpg" alt="Descripción de la tarjeta 1" className="card-image" />
              <h5>Coworking</h5>
              <p>Descripción de la tarjeta 1.</p>
            </div>
            <div className="card">
              <img src="/images/piscina.jpg" alt="Descripción de la tarjeta 2" className="card-image" />
              <h5>Piscina</h5>
              <p>Descripción de la tarjeta 2.</p>
            </div>
            <div className="card">
              <img src="/images/tennis.jpg" alt="Descripción de la tarjeta 3" className="card-image" />
              <h5>Cancha de Tennis</h5>
              <p>Descripción de la tarjeta 3.</p>
            </div>
          </div>
          
            )}

        


            {/* Aquí se renderizarán las rutas secundarias */}
            <Outlet />
        </div>
    );
};

export default Principal;
