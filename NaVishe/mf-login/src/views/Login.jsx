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
          credentials: 'include', // Importante para cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: email,
            contrasena: password
          }),
        }
      );

      const data = await response.json();
      console.log("Respuesta completa de la API:", data);

      if (response.status !== 200) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      // Parseo del body de respuesta
      let parsedBody = {};
      try {
        const cleanBody = data.body
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .replace(/\\"/g, '"')
          .replace(/i\\"/, '"');
        
        parsedBody = JSON.parse(cleanBody);
      } catch (parseError) {
        console.error("Error al parsear el body:", parseError);
        throw new Error("Error procesando la respuesta del servidor");
      }

      if (!parsedBody.rol) {
        throw new Error("La respuesta no contiene información de rol");
      }

      // Almacenar en cookie (para persistencia entre microfrontends)
      const cookieOptions = {
        path: '/',
        domain: window.location.hostname,
        maxAge: 86400, // 1 día en segundos
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax'
      };
      
      document.cookie = `userRole=${parsedBody.rol}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;

      // También almacenar en localStorage (para uso dentro del mismo frontend)
      localStorage.setItem("userRole", parsedBody.rol);
      
      setSuccessMessage(`¡Bienvenido ${parsedBody.rol}! Redirigiendo...`);
      
      if (onLoginSuccess) {
        onLoginSuccess(parsedBody);
      }

      // Redirección con breve retraso para mostrar mensaje
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
    
    // Establecer rol de invitado
    document.cookie = `userRole=invitado; path=/; domain=${window.location.hostname}; max-age=86400`;
    localStorage.setItem("userRole", "invitado");
    
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