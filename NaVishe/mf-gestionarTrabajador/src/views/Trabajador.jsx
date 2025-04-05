import React, { useState } from "react";
import "../index.css";
import Navbar from "componentes-compartidos/navbar";

const Trabajador = () => {
  const [trabajadores, setTrabajadores] = useState([
    { usuario: "Leonardo", dni: "23456782", correo: "leo@gmail.com", contraseña: "A654", fecha: "14/03/2025", status: true },
    { usuario: "Ezequiel", dni: "76578945", correo: "eze@gmail.com", contraseña: "D423", fecha: "Cash on Delivery", status: true },
    { usuario: "Leonel", dni: "45356788", correo: "leonel@gmail.com", contraseña: "GSDF", fecha: "Cash on Delivery", status: false },
    { usuario: "Juan", dni: "12354754", correo: "juan@gmail.com", contraseña: "T324", fecha: "Transfer Bank", status: true },
    { usuario: "Luis", dni: "15437534", correo: "luis@gmail.com", contraseña: "HF23", fecha: "Cash on Delivery", status: false },
    { usuario: "Ernesto", dni: "98765345", correo: "ernest@gmail.com", contraseña: "ern123", fecha: "Transfer Bank", status: false },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const itemsPerPage = 5;

  // Filter workers based on search term
  const filteredTrabajadores = trabajadores.filter(trabajador =>
    trabajador.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trabajador.dni.includes(searchTerm) ||
    trabajador.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrabajadores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrabajadores.length / itemsPerPage);

  // Handle adding new worker
  const handleAddWorker = () => {
    const newWorker = {
      usuario: "Nuevo Trabajador",
      dni: "00000000",
      correo: "nuevo@email.com",
      contraseña: "password",
      fecha: new Date().toLocaleDateString(),
      status: false
    };
    setTrabajadores([...trabajadores, newWorker]);
    setEditingIndex(trabajadores.length);
  };

  // Handle editing worker
  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  // Handle saving edit
  const handleSaveEdit = (index, updatedWorker) => {
    const updatedTrabajadores = [...trabajadores];
    updatedTrabajadores[index] = updatedWorker;
    setTrabajadores(updatedTrabajadores);
    setEditingIndex(null);
  };

  // Handle deleting worker
  const handleDelete = (index) => {
    if (window.confirm("¿Estás seguro de eliminar este trabajador?")) {
      const updatedTrabajadores = trabajadores.filter((_, i) => i !== index);
      setTrabajadores(updatedTrabajadores);
    }
  };

  // Handle status toggle
  const handleStatusToggle = (index) => {
    const updatedTrabajadores = [...trabajadores];
    updatedTrabajadores[index].status = !updatedTrabajadores[index].status;
    setTrabajadores(updatedTrabajadores);
  };

  // Handle pagination
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="camaras-container">
      <Navbar />
      <div className="content-wrapper">
        <div className="header">
          <h1>Gestionar Trabajadores</h1>
          <button className="gestionar-btn">Trabajadores</button>
        </div>
        <div className="table-controls">
          <button className="add-btn" onClick={handleAddWorker}>+ Agregar Trabajador</button>
          <input 
            type="text" 
            placeholder="Buscar Trabajador" 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="trabajadores-table">
          <thead>
            <tr>
              <th>USUARIO</th>
              <th>DNI</th>
              <th>CORREO</th>
              <th>CONTRASEÑA</th>
              <th>FECHA REGISTRO</th>
              <th>STATUS</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((trabajador, index) => (
              editingIndex === index ? (
                <tr key={index}>
                  <td><input defaultValue={trabajador.usuario} /></td>
                  <td><input defaultValue={trabajador.dni} /></td>
                  <td><input defaultValue={trabajador.correo} /></td>
                  <td><input defaultValue={trabajador.contraseña} /></td>
                  <td><input defaultValue={trabajador.fecha} /></td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={trabajador.status}
                        onChange={() => handleStatusToggle(index)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button 
                      className="action-btn save-btn"
                      onClick={() => handleSaveEdit(index, {
                        usuario: document.querySelectorAll('td input')[0].value,
                        dni: document.querySelectorAll('td input')[1].value,
                        correo: document.querySelectorAll('td input')[2].value,
                        contraseña: document.querySelectorAll('td input')[3].value,
                        fecha: document.querySelectorAll('td input')[4].value,
                        status: trabajador.status
                      })}
                    >
                      💾
                    </button>
                    <button 
                      className="action-btn cancel-btn"
                      onClick={() => setEditingIndex(null)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td><span className="user-icon">👤</span> {trabajador.usuario}</td>
                  <td>{trabajador.dni}</td>
                  <td>{trabajador.correo}</td>
                  <td>{trabajador.contraseña}</td>
                  <td>{trabajador.fecha}</td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={trabajador.status}
                        onChange={() => handleStatusToggle(index)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button 
                      className="action-btn edit-btn" 
                      onClick={() => handleEdit(index)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => handleDelete(index)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePrevious} disabled={currentPage === 1}>Anterior</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={handleNext} disabled={currentPage === totalPages}>Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default Trabajador;