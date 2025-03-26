import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import colmenaImage from "../assets/img_colmena.jpg";
import enVivoIcon from "../assets/en-vivo.png";
import Navbar from 'componentes-compartidos/navbar';

const Colmenas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedColmena, setSelectedColmena] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear, setCurrentYear] = useState(2021);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const [colmenas, setColmenas] = useState([
    { id: "3213", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2637, lng: -57.5759, address: "Asunción, Paraguay" },
    { id: "6436", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.3000, lng: -57.6000, address: "Asunción, Paraguay" },
    { id: "5436", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2800, lng: -57.5800, address: "Asunción, Paraguay" },
    { id: "6452", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2700, lng: -57.5900, address: "Asunción, Paraguay" },
    { id: "7482", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2600, lng: -57.5700, address: "Asunción, Paraguay" },
    { id: "8764", temp: "20°C", humidity: "10%", weight: "20 k", audio: true, image: colmenaImage, lat: -25.2500, lng: -57.5600, address: "Asunción, Paraguay" },
  ]);

  const menuRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isModifyModalOpen && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        { types: ['geocode'] }
      );
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setSelectedColmena({
            ...selectedColmena,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address
          });
          setLocationInput(place.formatted_address);
        }
      });
    }
  }, [isModifyModalOpen, selectedColmena]);

  const handleOpenModal = () => setIsModalOpen(true);
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
    setLocationInput(colmena.address || `${colmena.lat}, ${colmena.lng}`);
    setIsModifyModalOpen(true);
    setOpenMenuId(null);
  };
  const handleCloseModifyModal = () => {
    setIsModifyModalOpen(false);
    setSelectedColmena(null);
    setIsCalendarOpen(false);
    setLocationInput("");
  };
  const handleModifySubmit = (e) => {
    e.preventDefault();
    setColmenas(colmenas.map(colm => 
      colm.id === selectedColmena.id ? selectedColmena : colm
    ));
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
  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

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
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Contenido Principal */}
      <div className="content-wrapper" style={{ flex: 1 }}>
        <Navbar />
        <div className="dashboard-container">
          <div className="main-content">
            <header className="header" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <div className="header-left" style={{ flex: '1 1 100%', minWidth: '200px' }}>
                <h2>Gestionar <span>Colmena</span></h2>
                <div className="search-bar" style={{ width: '100%', maxWidth: '300px' }}>
                  <input
                    type="text"
                    placeholder="Buscar Colmena"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: '100%' }}
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>
              <div className="header-right" style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ marginRight: '10px' }}>Leonardo Palomino</span>
                <button className="add-button" onClick={handleOpenModal}>
                  + Agregar
                </button>
              </div>
            </header>

            <div className="colmenas-grid">
              {filteredColmenas.length > 0 ? (
                filteredColmenas.map((colmena) => (
                  <div key={colmena.id} className="colmena-card">
                    <div className="colmena-header" style={{ flexWrap: 'wrap' }}>
                      <span>N° - {colmena.id}</span>
                      <div className="colmena-header-icons" style={{ display: 'flex', gap: '10px' }}>
                        <span className="dropdown-icon" onClick={() => toggleMenu(colmena.id)}>▼</span>
                        {openMenuId === colmena.id && (
                          <div className="dropdown-menu" ref={menuRef}>
                            <div className="menu-item" onClick={() => handleOpenModifyModal(colmena)}>
                              Modificar
                            </div>
                            <div className="menu-item" onClick={() => handleDelete(colmena.id)}>
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
                      <img src={colmena.image} alt="Colmena" className="colmena-image" />
                    </div>
                    <div className="colmena-stats" style={{ flexWrap: 'wrap' }}>
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
              <div className="modal" style={{ width: '90%', maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2>Nueva colmena</h2>
                  <button className="modal-close" onClick={handleCloseModal}>✕</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Añadir Código</label>
                    <input type="text" placeholder="Ingresa el código de la colmena" style={{ width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Registro</label>
                    <input type="text" placeholder="Ingresa la fecha" style={{ width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Instalación</label>
                    <div className="date-picker">
                      <input
                        type="text"
                        value={selectedDate ? `${selectedDate.getDate()} de ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : "Selecciona una fecha"}
                        onClick={toggleCalendar}
                        readOnly
                        style={{ width: '100%' }}
                      />
                      {isCalendarOpen && (
                        <div className="calendar" style={{ width: '100%', maxWidth: '300px' }}>
                          <div className="calendar-header">
                            <button onClick={handlePrevMonth}>◄</button>
                            <span>{`${months[currentMonth]} ${currentYear}`}</span>
                            <button onClick={handleNextMonth}>►</button>
                          </div>
                          <div className="calendar-body">
                            <div className="calendar-days" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                            </div>
                            <div className="calendar-dates" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                              {emptyDays.map((_, index) => (
                                <span key={`empty-${index}`} className="empty"></span>
                              ))}
                              {daysArray.map((day) => (
                                <span
                                  key={day}
                                  className={selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear ? "selected" : ""}
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
              <div className="modal" style={{ width: '90%', maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2>Ubicación de la Colmena {selectedColmena.id}</h2>
                  <button className="modal-close" onClick={handleCloseMapModal}>✕</button>
                </div>
                <div className="modal-body">
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0, maxWidth: '100%' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAzvjPshVi9uQUokL7uZ_ZJovSircoZMF4&q=${selectedColmena.lat},${selectedColmena.lng}&zoom=15`}
                  ></iframe>
                </div>
              </div>
            </div>
          )}

         
          {isModifyModalOpen && selectedColmena && (
            <div className="modal-overlay">
              <div className="modal" style={{ width: '90%', maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2>Modificar Colmena {selectedColmena.id}</h2>
                  <button className="modal-close" onClick={handleCloseModifyModal}>✕</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleModifySubmit}>
                    <div className="form-group">
                      <label>Código</label>
                      <input
                        type="text"
                        defaultValue={selectedColmena.id}
                        onChange={(e) => setSelectedColmena({ ...selectedColmena, id: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>URL de la Imagen</label>
                      <input
                        type="url"
                        defaultValue={selectedColmena.image}
                        onChange={(e) => setSelectedColmena({ ...selectedColmena, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha de Instalación</label>
                      <div className="date-picker">
                        <input
                          type="text"
                          value={selectedDate ? `${selectedDate.getDate()} de ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : "Selecciona una fecha"}
                          onClick={toggleCalendar}
                          readOnly
                          style={{ width: '100%' }}
                        />
                        {isCalendarOpen && (
                          <div className="calendar" style={{ width: '100%', maxWidth: '300px' }}>
                            <div className="calendar-header">
                              <button onClick={handlePrevMonth}>◄</button>
                              <span>{`${months[currentMonth]} ${currentYear}`}</span>
                              <button onClick={handleNextMonth}>►</button>
                            </div>
                            <div className="calendar-body">
                              <div className="calendar-days" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                              </div>
                              <div className="calendar-dates" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                                {emptyDays.map((_, index) => (
                                  <span key={`empty-${index}`} className="empty"></span>
                                ))}
                                {daysArray.map((day) => (
                                  <span
                                    key={day}
                                    className={selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear ? "selected" : ""}
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
                    <div className="form-group">
                      <label>Ubicación</label>
                      <input
                        type="text"
                        ref={autocompleteRef}
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="Escribe una dirección"
                        style={{ width: '100%' }}
                      />
                      <div ref={mapRef} style={{ height: '300px', width: '100%', marginTop: '10px' }}></div>
                    </div>
                    <button type="submit" className="submit-button" style={{ width: '100%' }}>
                      Guardar Cambios
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Colmenas;