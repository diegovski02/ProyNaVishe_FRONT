import React, { useState } from "react";
import "../index.css";
import naVisheLogo from "../assets/na-vishe-logo.png";

const Login = ({ onLoginSuccess, onGuestLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://8lhoa5atqf.execute-api.us-east-1.amazonaws.com/desarrollo/usuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: email,
            contrasena: password,
          }),
        }
      );

      const data = await response.json();
      console.log("Respuesta completa de la API:", data); // Depuración
      console.log("Tipo de data.body:", typeof data.body); // Depuración
      console.log("Valor de data.body:", data.body); // Depuración

      // Verificación basada en la estructura de respuesta
      if (response.status !== 200) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      // Manejo de data.body como un array
      let parsedBody = {};
      if (!data.body || !Array.isArray(data.body) || data.body.length === 0) {
        console.error("Formato inesperado de data.body:", data.body);
        throw new Error("La respuesta del servidor no contiene datos válidos");
      }

      // Tomar el primer elemento del array
      parsedBody = data.body[0];
      console.log("Parsed body:", parsedBody); // Depuración

      // Verifica si el rol está presente
      if (!parsedBody.rol) {
        console.error("No se encontró el campo 'rol' en la respuesta:", parsedBody);
        throw new Error("La respuesta no contiene información de rol");
      }

      console.log("Rol obtenido:", parsedBody.rol); // Depuración

      // Almacenar en cookie
      const cookieOptions = {
        path: '/',
        domain: 'localhost', // Usar 'localhost' para compartir entre puertos
        maxAge: 86400, // 1 día en segundos
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
      };

      document.cookie = `userRole=${parsedBody.rol}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;
      console.log("Cookie establecida:", document.cookie); // Depuración

      // Opcional: Almacenar en localStorage (solo para depuración, no se compartirá entre puertos)
      localStorage.setItem("userRole", parsedBody.rol);
      console.log("Valor guardado en localStorage (solo para depuración):", localStorage.getItem("userRole")); // Depuración

      // Autenticación exitosa
      setSuccessMessage(`¡Bienvenido ${parsedBody.rol}! Redirigiendo...`);

      if (onLoginSuccess) {
        onLoginSuccess(parsedBody);
      }

      setTimeout(() => {
        window.location.href = "http://localhost:5003";
      }, 1500);

    } catch (err) {
      console.error("Error completo:", err);
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    console.log("Ingresar como invitado");

    // Almacenar rol de invitado en cookie
    const cookieOptions = {
      path: '/',
      domain: 'localhost',
      maxAge: 86400,
      secure: window.location.protocol === 'https:',
      sameSite: 'Lax',
    };

    document.cookie = `userRole=invitado; ${Object.entries(cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`;
    console.log("Cookie establecida (invitado):", document.cookie); // Depuración

    // Opcional: Almacenar en localStorage (solo para depuración)
    localStorage.setItem("userRole", "invitado");
    console.log("Valor guardado en localStorage (invitado, solo para depuración):", localStorage.getItem("userRole")); // Depuración

    if (onGuestLogin) {
      onGuestLogin();
    }

    window.location.href = "http://localhost:5003";
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={naVisheLogo} alt="Ña Vishe Logo" className="login-logo" />
        <h1>Ña Vishe</h1>
        <p>
          Bienvenido a Ña Vishe <br /> inicia sesión para poder ingresar
        </p>
      </div>
      <div className="right-section">
        <div className="form-container">
          <h2>Iniciar Sesión en ÑaVishe</h2>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="login-input"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="login-input"
                required
              />
            </div>
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
          <button className="guest-button" onClick={handleGuestLogin}>
            Ingresar como invitado
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;