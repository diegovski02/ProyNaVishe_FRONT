import React, { useState } from 'react';
import './Navbar.css';
import naVisheLogo from "./assets/na-vishe-logo.png";
import icon1 from "./assets/dashboardIcon.png";
import icon2 from "./assets/colmena.png";
import icon3 from "./assets/cameras-icon.png";
import icon4 from "./assets/worker-icon.png";
import icon5 from "./assets/logout-icon.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Lista de Colmenas'); // Track active item

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsMenuOpen(false); // Close menu on item click
  };

  return (
    <div className="navbar">
      <div className="navbar-header">
        <button className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
        <img src={naVisheLogo} alt="Ña Vishe Logo" className="logo-principal" />
        <h1>Ña Vishe</h1>
      </div>

      {/* Desktop Layout */}
      <div className="navbar-navegacion">
        <div className={`nav-item ${activeItem === 'Dashboard' ? 'active' : ''}`} onClick={() => handleItemClick('Dashboard')}>
          <div className="icon1"><img src={icon1} alt="Dashboard" className="icono-1" /></div>
          <div className="descripcion"><label>Dashboard</label></div>
          <div className="iconFlecha"><label>{">"}</label></div>
        </div>
        <div className={`nav-item ${activeItem === 'Lista de Colmenas' ? 'active' : ''}`} onClick={() => handleItemClick('Lista de Colmenas')}>
          <div className="icon1"><img src={icon2} alt="Colmenas" className="icono-2" /></div>
          <div className="descripcion"><label>Lista de Colmenas</label></div>
          <div className="iconFlecha"><label>{">"}</label></div>
        </div>
        <div className={`nav-item ${activeItem === 'Cámaras' ? 'active' : ''}`} onClick={() => handleItemClick('Cámaras')}>
          <div className="icon1"><img src={icon3} alt="Cámaras" className="icono-3" /></div>
          <div className="descripcion"><label>Cámaras</label></div>
          <div className="iconFlecha"><label>{">"}</label></div>
        </div>
        <div className={`nav-item ${activeItem === 'Gestionar Trabajador' ? 'active' : ''}`} onClick={() => handleItemClick('Gestionar Trabajador')}>
          <div className="icon1"><img src={icon4} alt="Trabajador" className="icono-4" /></div>
          <div className="descripcion"><label>Gestionar Trabajador</label></div>
          <div className="iconFlecha"><label>{">"}</label></div>
        </div>
      </div>

      <div className="LogOut">
        <label>Configuración</label>
        <div className="cs" onClick={() => handleItemClick('Cerrar Sesión')}>
          <div className="icon6"><img src={icon5} alt="Cerrar Sesión" className="icono-5" /></div>
          <div className="descripcion"><label>Cerrar Sesión</label></div>
          <div className="iconFlecha"><label>{">"}</label></div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-list">
          <li
            className={`mobile-menu-item ${activeItem === 'Dashboard' ? 'active' : ''}`}
            onClick={() => handleItemClick('Dashboard')}
          >
            <img src={icon1} alt="Dashboard" className="mobile-menu-icon" />
            <span>Dashboard</span>
          </li>
          <li
            className={`mobile-menu-item ${activeItem === 'Lista de Colmenas' ? 'active' : ''}`}
            onClick={() => handleItemClick('Lista de Colmenas')}
          >
            <img src={icon2} alt="Colmenas" className="mobile-menu-icon" />
            <span>Lista de Colmenas</span>
          </li>
          <li
            className={`mobile-menu-item ${activeItem === 'Cámaras' ? 'active' : ''}`}
            onClick={() => handleItemClick('Cámaras')}
          >
            <img src={icon3} alt="Cámaras" className="mobile-menu-icon" />
            <span>Cámaras</span>
          </li>
          <li
            className={`mobile-menu-item ${activeItem === 'Gestionar Trabajador' ? 'active' : ''}`}
            onClick={() => handleItemClick('Gestionar Trabajador')}
          >
            <img src={icon4} alt="Trabajador" className="mobile-menu-icon" />
            <span>Gestionar Trabajador</span>
          </li>
          <li
            className="mobile-menu-item"
            onClick={() => handleItemClick('Configuración')}
          >
            <span>Configuración</span>
          </li>
          <li
            className={`mobile-menu-item ${activeItem === 'Cerrar Sesión' ? 'active' : ''}`}
            onClick={() => handleItemClick('Cerrar Sesión')}
          >
            <img src={icon5} alt="Cerrar Sesión" className="mobile-menu-icon" />
            <span>Cerrar Sesión</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;