import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import colmenaImage from "../assets/img_colmena.jpg";
import enVivoIcon from "../assets/en-vivo.png";
import Navbar from 'componentes-compartidos/navbar';

const Colmenas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedColmena, setSelectedColmena] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const [mapError, setMapError] = useState(null);
  const [colmenas, setColmenas] = useState([]);
  const [newColmena, setNewColmena] = useState({
    nombre: "",
    fecha_instalacion: "",
    longitud: null,
    latitud: null,
    humedad: null,
    temperatura: null,
    peso: null,
    imagen_url: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colmenaToDelete, setColmenaToDelete] = useState(null);
  const [userRole, setUserRole] = useState(""); // Estado para el rol del usuario
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el estado de envío

  const API_URL = "https://8lhoa5atqf.execute-api.us-east-1.amazonaws.com/desarrollo/colmena";

  const menuRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const googleScriptLoaded = useRef(false);

  // Cargar el rol desde localStorage al montar el componente
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    console.log("Valor leído de localStorage en Colmenas:", storedRole); // Depuración
    setUserRole(storedRole || "Usuario"); // Valor por defecto si no hay rol
  }, []);

  useEffect(() => {
    const fetchColmenas = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setColmenas(data.body); // Extrae el array de la propiedad 'body'
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener colmenas:", err);
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchColmenas();
  }, []);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!googleScriptLoaded.current && !window.google) {
        googleScriptLoaded.current = true;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAzvjPshVi9uQUokL7uZ_ZJovSircoZMF4&libraries=places`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => {
          console.log("Script de Google Maps cargado correctamente");
          initializeMapAndAutocomplete();
        };
        script.onerror = () => {
          console.error("Error al cargar el script de Google Maps");
          setMapError("No se pudo cargar el script de Google Maps");
        };
      } else if (window.google) {
        initializeMapAndAutocomplete();
      }
    };

    const initializeMapAndAutocomplete = () => {
      if (mapRef.current) {
        try {
          const initialPosition = selectedColmena ? 
            { lat: parseFloat(selectedColmena.latitud) || -25.2637, lng: parseFloat(selectedColmena.longitud) || -57.5759 } : 
            { lat: -25.2637, lng: -57.5759 };
          
          const map = new window.google.maps.Map(mapRef.current, {
            center: initialPosition,
            zoom: 15,
          });
          
          if (selectedColmena && selectedColmena.latitud && selectedColmena.longitud) {
            new window.google.maps.Marker({
              position: { lat: parseFloat(selectedColmena.latitud), lng: parseFloat(selectedColmena.longitud) },
              map: map,
            });
          }

          const autocomplete = new window.google.maps.places.Autocomplete(
            autocompleteRef.current,
            { types: ["geocode"] }
          );
          
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              const newLat = place.geometry.location.lat();
              const newLng = place.geometry.location.lng();
              
              if (isModifyModalOpen && selectedColmena) {
                setSelectedColmena({
                  ...selectedColmena,
                  latitud: newLat,
                  longitud: newLng,
                });
              } else {
                setNewColmena({
                  ...newColmena,
                  latitud: newLat,
                  longitud: newLng,
                });
              }
              
              setLocationInput(place.formatted_address);
              map.setCenter({ lat: newLat, lng: newLng });
              new window.google.maps.Marker({
                position: { lat: newLat, lng: newLng },
                map: map,
              });
            }
          });
        } catch (error) {
          console.error("Error al inicializar el mapa:", error);
          setMapError("Error al cargar el mapa");
        }
      }
    };

    if (isModalOpen || isModifyModalOpen) {
      loadGoogleMapsScript();
    }
  }, [isModalOpen, isModifyModalOpen, selectedColmena]);

  const handleOpenModal = () => {
    setNewColmena({
      nombre: "",
      fecha_instalacion: "",
      longitud: null,
      latitud: null,
      humedad: null,
      temperatura: null,
      peso: null,
      imagen_url: null
    });
    setLocationInput("");
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
    setLocationInput(colmena.latitud && colmena.longitud ? 
      `${colmena.latitud}, ${colmena.longitud}` : "");
    setIsModifyModalOpen(true);
    setOpenMenuId(null);
    setMapError(null);
  };

  const handleCloseModifyModal = () => {
    setIsModifyModalOpen(false);
    setSelectedColmena(null);
    setIsCalendarOpen(false);
    setLocationInput("");
    setMapError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewColmena({
      ...newColmena,
      [name]: value
    });
  };

  const handleModifyInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedColmena({
      ...selectedColmena,
      [name]: value
    });
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Activar estado de envío
    try {
      const response = await fetch(`${API_URL}/${selectedColmena.id_colmena}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedColmena)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const updatedColmena = await response.json();
      setColmenas(colmenas.map(colmena => 
        colmena.id_colmena === updatedColmena.id_colmena ? updatedColmena : colmena
      ));
      handleCloseModifyModal();
    } catch (err) {
      console.error("Error al modificar colmena:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false); // Desactivar estado de envío
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Activar estado de envío
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newColmena)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const newColmenaData = await response.json();
      // Asegurarse de que newColmenaData tenga la estructura correcta
      const formattedNewColmena = {
        id_colmena: newColmenaData.id_colmena || Date.now(), // Usar un ID temporal si no viene del backend
        nombre: newColmena.nombre,
        fecha_instalacion: newColmena.fecha_instalacion,
        longitud: newColmena.longitud,
        latitud: newColmena.latitud,
        humedad: newColmena.humedad,
        temperatura: newColmena.temperatura,
        peso: newColmena.peso,
        imagen_url: newColmena.imagen_url
      };
      setColmenas([...colmenas, formattedNewColmena]);
      handleCloseModal();
    } catch (err) {
      console.error("Error al agregar colmena:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false); // Desactivar estado de envío
    }
  };

  const handleDelete = (id_colmena) => {
    const colmena = colmenas.find(c => c.id_colmena === id_colmena);
    setColmenaToDelete(colmena);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!colmenaToDelete) return;

    setIsSubmitting(true); // Activar estado de envío
    try {
      const response = await fetch(`${API_URL}/${colmenaToDelete.id_colmena}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      setColmenas(colmenas.filter(colmena => colmena.id_colmena !== colmenaToDelete.id_colmena));
      setIsDeleteModalOpen(false);
      setColmenaToDelete(null);
    } catch (err) {
      console.error("Error al eliminar colmena:", err);
      setError(err.message);
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false); // Desactivar estado de envío
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setColmenaToDelete(null);
  };

  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const toggleMenu = (id_colmena) => setOpenMenuId(openMenuId === id_colmena ? null : id_colmena);

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
    const formattedDate = newDate.toISOString();
    
    if (isModifyModalOpen && selectedColmena) {
      setSelectedColmena({
        ...selectedColmena,
        fecha_instalacion: formattedDate
      });
    } else {
      setNewColmena({
        ...newColmena,
        fecha_instalacion: formattedDate
      });
    }
    
    setSelectedDate(newDate);
    setIsCalendarOpen(false);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, () => null);

  const filteredColmenas = colmenas.filter(colmena =>
    colmena.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colmena.id_colmena?.toString().includes(searchTerm)
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                <span style={{ marginRight: '10px' }}>{userRole}</span> {/* Mostrar el rol */}
                <button 
                  className="add-button" 
                  onClick={handleOpenModal}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Agregando..." : "+ Agregar"}
                </button>
              </div>
            </header>

            <div className="colmenas-grid">
              {filteredColmenas.length > 0 ? (
                filteredColmenas.map((colmena) => (
                  <div key={colmena.id_colmena} className="colmena-card">
                    <div className="colmena-header" style={{ flexWrap: 'wrap' }}>
                      <span>{colmena.nombre || `Colmena ${colmena.id_colmena}`}</span>
                      <div className="colmena-header-icons" style={{ display: 'flex', gap: '10px' }}>
                        <span className="dropdown-icon" onClick={() => toggleMenu(colmena.id_colmena)}>▼</span>
                        {openMenuId === colmena.id_colmena && (
                          <div className="dropdown-menu" ref={menuRef}>
                            <div className="menu-item" onClick={() => handleOpenModifyModal(colmena)}>
                              Modificar
                            </div>
                            <div className="menu-item" onClick={() => handleDelete(colmena.id_colmena)}>
                              Eliminar
                            </div>
                          </div>
                        )}
                        {colmena.latitud && colmena.longitud && (
                          <img
                            src={enVivoIcon}
                            alt="En Vivo"
                            className="audio-icon"
                            onClick={() => handleOpenMapModal(colmena)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="colmena-image-placeholder">
                      <img 
                        src={colmena.imagen_url || colmenaImage} 
                        alt="Colmena" 
                        className="colmena-image" 
                        onError={(e) => {
                          e.target.src = colmenaImage;
                        }}
                      />
                    </div>
                    <div className="colmena-stats" style={{ flexWrap: 'wrap' }}>
                      <div className="stat-item">
                        <span className="stat-icon">🌡️</span>
                        <span>{colmena.temperatura || '--'}°C</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">💧</span>
                        <span>{colmena.humedad || '--'}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">⚖️</span>
                        <span>{colmena.peso || '--'} kg</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  {loading ? (
                    <p>Cargando colmenas...</p>
                  ) : (
                    <p>No se encontraron colmenas.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal" style={{ width: '90%', maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2>Nueva colmena</h2>
                  <button className="modal-close" onClick={handleCloseModal}>✕</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddSubmit}>
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={newColmena.nombre}
                        onChange={handleInputChange}
                        placeholder="Nombre de la colmena"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>URL de la Imagen</label>
                      <input
                        type="url"
                        name="imagen_url"
                        value={newColmena.imagen_url || ''}
                        onChange={handleInputChange}
                        placeholder="https://example.com/imagen.jpg"
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
                                {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                                  <span key={`day-${index}`}>{day}</span>
                                ))}
                              </div>
                              <div className="calendar-dates" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                                {emptyDays.map((_, index) => (
                                  <span key={`empty-${index}`} className="empty"></span>
                                ))}
                                {daysArray.map((day) => (
                                  <span
                                    key={`day-${day}`}
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
                      {mapError && <p style={{ color: 'red' }}>{mapError}</p>}
                    </div>
                    <div className="form-group">
                      <label>Temperatura (°C)</label>
                      <input
                        type="number"
                        name="temperatura"
                        value={newColmena.temperatura || ''}
                        onChange={handleInputChange}
                        placeholder="Temperatura"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Humedad (%)</label>
                      <input
                        type="number"
                        name="humedad"
                        value={newColmena.humedad || ''}
                        onChange={handleInputChange}
                        placeholder="Humedad"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Peso (kg)</label>
                      <input
                        type="number"
                        name="peso"
                        value={newColmena.peso || ''}
                        onChange={handleInputChange}
                        placeholder="Peso"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="submit-button" 
                      style={{ width: '100%' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Agregando..." : "Guardar Colmena"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {isMapModalOpen && selectedColmena && (
            <div className="modal-overlay">
              <div className="modal" style={{ width: '90%', maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2>Ubicación de la Colmena {selectedColmena.nombre || selectedColmena.id_colmena}</h2>
                  <button className="modal-close" onClick={handleCloseMapModal}>✕</button>
                </div>
                <div className="modal-body">
                  {selectedColmena.latitud && selectedColmena.longitud ? (
                    <iframe
                      width="100%"
                      height="300"
                      style={{ border: 0, maxWidth: '100%' }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAzvjPshVi9uQUokL7uZ_ZJovSircoZMF4&q=${selectedColmena.latitud},${selectedColmena.longitud}&zoom=15`}
                      onError={() => setMapError("Error al cargar el mapa embebido. Verifica que la API de Mapas Embebidos esté habilitada.")}
                    ></iframe>
                  ) : (
                    <p>No hay ubicación disponible para esta colmena</p>
                  )}
                  {mapError && <p style={{ color: 'red' }}>{mapError}</p>}
                </div>
              </div>
            </div>
          )}

          {isModifyModalOpen && selectedColmena && (
            <div className="modal-overlay">
              <div className="modal" style={{ width: '90%', maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2>Modificar Colmena {selectedColmena.nombre || selectedColmena.id_colmena}</h2>
                  <button className="modal-close" onClick={handleCloseModifyModal}>✕</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleModifySubmit}>
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={selectedColmena.nombre || ''}
                        onChange={handleModifyInputChange}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>URL de la Imagen</label>
                      <input
                        type="url"
                        name="imagen_url"
                        value={selectedColmena.imagen_url || ''}
                        onChange={handleModifyInputChange}
                        placeholder="https://example.com/image.jpg"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha de Instalación</label>
                      <div className="date-picker">
                        <input
                          type="text"
                          value={selectedDate ? 
                            `${selectedDate.getDate()} de ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : 
                            selectedColmena.fecha_instalacion ? 
                              new Date(selectedColmena.fecha_instalacion).toLocaleDateString() : 
                              "Selecciona una fecha"}
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
                                {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                                  <span key={`day-${index}`}>{day}</span>
                                ))}
                              </div>
                              <div className="calendar-dates" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                                {emptyDays.map((_, index) => (
                                  <span key={`empty-${index}`} className="empty"></span>
                                ))}
                                {daysArray.map((day) => (
                                  <span
                                    key={`day-${day}`}
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
                      {mapError && <p style={{ color: 'red' }}>{mapError}</p>}
                    </div>
                    <div className="form-group">
                      <label>Temperatura (°C)</label>
                      <input
                        type="number"
                        name="temperatura"
                        value={selectedColmena.temperatura || ''}
                        onChange={handleModifyInputChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Humedad (%)</label>
                      <input
                        type="number"
                        name="humedad"
                        value={selectedColmena.humedad || ''}
                        onChange={handleModifyInputChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Peso (kg)</label>
                      <input
                        type="number"
                        name="peso"
                        value={selectedColmena.peso || ''}
                        onChange={handleModifyInputChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="submit-button" 
                      style={{ width: '100%' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {isDeleteModalOpen && colmenaToDelete && (
            <div className="modal-overlay">
              <div className="modal" style={{ width: '90%', maxWidth: '400px' }}>
                <div className="modal-header">
                  <h2>Confirmar Eliminación</h2>
                  <button className="modal-close" onClick={cancelDelete}>✕</button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar la colmena "{colmenaToDelete.nombre || `Colmena ${colmenaToDelete.id_colmena}`}"? Esta acción no se puede deshacer.</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button 
                      onClick={cancelDelete} 
                      className="submit-button" 
                      style={{ width: '45%', backgroundColor: '#ccc' }}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={confirmDelete} 
                      className="submit-button" 
                      style={{ width: '45%', backgroundColor: '#ff4444' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
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