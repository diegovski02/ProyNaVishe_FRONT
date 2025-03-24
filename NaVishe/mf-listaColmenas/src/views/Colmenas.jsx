import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import colmenaImage from "../assets/img_colmena.jpg";
import enVivoIcon from "../assets/en-vivo.png";
import Navbar from 'componentes-compartidos/navbar';


const Colmenas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de agregar
  const [isMapModalOpen, setIsMapModalOpen] = useState(false); // Modal del mapa
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false); // Modal de modificar
  const [selectedColmena, setSelectedColmena] = useState(null); // Colmena seleccionada para modificar o ver mapa
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear, setCurrentYear] = useState(2021);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [colmenas, setColmenas] = useState([
    { id: "3213", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2637, lng: -57.5759 },
    { id: "6436", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.3000, lng: -57.6000 },
    { id: "5436", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2800, lng: -57.5800 },
    { id: "6452", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2700, lng: -57.5900 },
    { id: "7482", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2600, lng: -57.5700 },
    { id: "8764", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2500, lng: -57.5600 },
  ]);

  const menuRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCalendarOpen(false);
  };

  const handleOpenMapModal = (colmena) => {
    setSelectedColmena(colmena);
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedColmena(null);
  };

  const handleOpenModifyModal = (colmena) => {
    setSelectedColmena(colmena);
    setIsModifyModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseModifyModal = () => {
    setIsModifyModalOpen(false);
    setSelectedColmena(null);
    setIsCalendarOpen(false);
  };

  const handleModifySubmit = (e) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica para actualizar la colmena
    console.log("Colmena modificada:", selectedColmena);
    handleCloseModifyModal();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta colmena?");
    if (confirmDelete) {
      setColmenas(colmenas.filter((colmena) => colmena.id !== id));
      console.log(`Colmena con ID ${id} eliminada`);
    }
    setOpenMenuId(null);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setIsCalendarOpen(false);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, () => null);

  const filteredColmenas = colmenas.filter((colmena) =>
    colmena.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  return (
    /* importar el nabvar */
    <div>
     <div>
      <Navbar />
    </div>

    <div className="dashboard-container">
      {/* Contenido principal */}
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h2>
              Gestionar <span>Colmena</span>
            </h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar Colmena"
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          <div className="header-right">
            <span>Leonardo Palomino</span>
            <button className="add-button" onClick={handleOpenModal}>
              + Agregar
            </button>
          </div>
        </header>

        <div className="colmenas-grid">
          {filteredColmenas.length > 0 ? (
            filteredColmenas.map((colmena) => (
              <div key={colmena.id} className="colmena-card">
                <div className="colmena-header">
                  <span>N° - {colmena.id}</span>
                  <div className="colmena-header-icons">
                    <span
                      className="dropdown-icon"
                      onClick={() => toggleMenu(colmena.id)}
                    >
                      ▼
                    </span>
                    {openMenuId === colmena.id && (
                      <div className="dropdown-menu" ref={menuRef}>
                        <div
                          className="menu-item"
                          onClick={() => handleOpenModifyModal(colmena)}
                        >
                          Modificar
                        </div>
                        <div
                          className="menu-item"
                          onClick={() => handleDelete(colmena.id)}
                        >
                          Eliminar
                        </div>
                      </div>
                    )}
                    <img
                      src={enVivoIcon}
                      alt="En Vivo"
                      className="audio-icon"
                      onClick={() => handleOpenMapModal(colmena)}
                    />
                  </div>
                </div>
                <div className="colmena-image-placeholder">
                  <img
                    src={colmena.image}
                    alt="Colmena"
                    className="colmena-image"
                  />
                </div>
                <div className="colmena-stats">
                  <div className="stat-item">
                    <span className="stat-icon">🌡️</span>
                    <span>{colmena.temp}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💧</span>
                    <span>{colmena.humidity}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">⚖️</span>
                    <span>{colmena.weight}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron colmenas con ese número.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Agregar */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Nueva colmena</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Añadir Código</label>
                <input type="text" placeholder="Ingresa el código de la colmena" />
              </div>
              <div className="form-group">
                <label>Fecha de Registro</label>
                <input type="text" placeholder="Ingresa la fecha" />
              </div>
              <div className="form-group">
                <label>Fecha de Instalación</label>
                <div className="date-picker">
                  <input
                    type="text"
                    value={
                      selectedDate
                        ? `${selectedDate.getDate()} de ${
                            months[selectedDate.getMonth()]
                          } ${selectedDate.getFullYear()}`
                        : "Selecciona una fecha"
                    }
                    onClick={toggleCalendar}
                    readOnly
                  />
                  {isCalendarOpen && (
                    <div className="calendar">
                      <div className="calendar-header">
                        <button onClick={handlePrevMonth}>◄</button>
                        <span>{`${months[currentMonth]} ${currentYear}`}</span>
                        <button onClick={handleNextMonth}>►</button>
                      </div>
                      <div className="calendar-body">
                        <div className="calendar-days">
                          <span>M</span>
                          <span>T</span>
                          <span>W</span>
                          <span>T</span>
                          <span>F</span>
                          <span>S</span>
                          <span>S</span>
                        </div>
                        <div className="calendar-dates">
                          {emptyDays.map((_, index) => (
                            <span key={`empty-${index}`} className="empty"></span>
                          ))}
                          {daysArray.map((day) => (
                            <span
                              key={day}
                              className={
                                selectedDate &&
                                selectedDate.getDate() === day &&
                                selectedDate.getMonth() === currentMonth &&
                                selectedDate.getFullYear() === currentYear
                                  ? "selected"
                                  : ""
                              }
                              onClick={() => handleDateSelect(day)}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Mapa */}
      {isMapModalOpen && selectedColmena && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Ubicación de la Colmena {selectedColmena.id}</h2>
              <button className="modal-close" onClick={handleCloseMapModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <iframe
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAzvjPshVi9uQUokL7uZ_ZJovSircoZMF4&q=${selectedColmena.lat},${selectedColmena.lng}&zoom=15`}

              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Modificar */}
      {isModifyModalOpen && selectedColmena && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Modificar Colmena {selectedColmena.id}</h2>
              <button className="modal-close" onClick={handleCloseModifyModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleModifySubmit}>
                <div className="form-group">
                  <label>Código</label>
                  <input
                    type="text"
                    defaultValue={selectedColmena.id}
                    onChange={(e) =>
                      setSelectedColmena({ ...selectedColmena, id: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Temperatura</label>
                  <input
                    type="text"
                    defaultValue={selectedColmena.temp}
                    onChange={(e) =>
                      setSelectedColmena({ ...selectedColmena, temp: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Humedad</label>
                  <input
                    type="text"
                    defaultValue={selectedColmena.humidity}
                    onChange={(e) =>
                      setSelectedColmena({ ...selectedColmena, humidity: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Peso</label>
                  <input
                    type="text"
                    defaultValue={selectedColmena.weight}
                    onChange={(e) =>
                      setSelectedColmena({ ...selectedColmena, weight: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Instalación</label>
                  <div className="date-picker">
                    <input
                      type="text"
                      value={
                        selectedDate
                          ? `${selectedDate.getDate()} de ${
                              months[selectedDate.getMonth()]
                            } ${selectedDate.getFullYear()}`
                          : "Selecciona una fecha"
                      }
                      onClick={toggleCalendar}
                      readOnly
                    />
                    {isCalendarOpen && (
                      <div className="calendar">
                        <div className="calendar-header">
                          <button onClick={handlePrevMonth}>◄</button>
                          <span>{`${months[currentMonth]} ${currentYear}`}</span>
                          <button onClick={handleNextMonth}>►</button>
                        </div>
                        <div className="calendar-body">
                          <div className="calendar-days">
                            <span>M</span>
                            <span>T</span>
                            <span>W</span>
                            <span>T</span>
                            <span>F</span>
                            <span>S</span>
                            <span>S</span>
                          </div>
                          <div className="calendar-dates">
                            {emptyDays.map((_, index) => (
                              <span key={`empty-${index}`} className="empty"></span>
                            ))}
                            {daysArray.map((day) => (
                              <span
                                key={day}
                                className={
                                  selectedDate &&
                                  selectedDate.getDate() === day &&
                                  selectedDate.getMonth() === currentMonth &&
                                  selectedDate.getFullYear() === currentYear
                                    ? "selected"
                                    : ""
                                }
                                onClick={() => handleDateSelect(day)}
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" className="submit-button">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Colmenas;