import React from 'react';
import './Navbar.css';
import naVisheLogo from "./assets/na-vishe-logo.png";
import icon1 from "./assets/dashboardIcon.png";
import icon2 from "./assets/colmena.png";
import icon3 from "./assets/cameras-icon.png";
import icon4 from "./assets/worker-icon.png";
import icon5 from "./assets/logout-icon.png";

const Navbar = () => {
  return (
    <div className="navbar">
        <div className='navbar-header'>
            <img src={naVisheLogo} alt="Ña Vishe Logo" className="logo-principal" />
            <h1>Ña Vishe</h1>
        </div>
        <div className='navbar-navegacion'>
            <div className='icon1'><img src={icon1} className="icono-1"/></div>
            <div className='descripcion'><label>Dashboard</label></div>
            <div className='iconFlecha'><label>{">"}</label></div>
            <div className='icon1'><img src={icon2} className="icono-2"/></div>
            <div className='descripcion'><label>Lista de Colmenas</label></div>
            <div className='iconFlecha'><label>{">"}</label></div>
            <div className='icon1'><img src={icon3} className="icono-3"/></div>
            <div className='descripcion'><label>Cámaras</label></div>
            <div className='iconFlecha'><label>{">"}</label></div>
            <div className='icon1'><img src={icon4} className="icono-4"/></div>
            <div className='descripcion'><label>Gestionar Trabajador</label></div>
            <div className='iconFlecha'><label>{">"}</label></div>
        </div>

        <div className='LogOut'>
            <label>Configuración</label>
            <div className='cs'>
                <div className='icon6'><img src={icon5} className="icono-5"/></div>
                <div className='descripcion'><label>Cerrar Sesión</label></div>
                <div className='iconFlecha'><label>{">"}</label></div>
            </div>
        </div>
    </div>
  );
};

export default Navbar;
