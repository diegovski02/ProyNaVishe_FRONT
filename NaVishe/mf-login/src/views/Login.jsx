import React, { useState } from "react";
import "../index.css";
import naVisheLogo from "../assets/na-vishe-logo.png";

const Login = ({ onLoginSuccess, onGuestLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Nuevo estado para mensaje de éxito

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      setSuccessMessage(null); // Limpiar mensaje de éxito si hay error
      return;
    }

    try {
      const response = await fetch("https://8lhoa5atqf.execute-api.us-east-1.amazonaws.com/dev/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setError(null);
      setSuccessMessage("¡Logeo exitoso! Bienvenido"); // Mostrar mensaje de éxito
      console.log("Inicio de sesión exitoso:", data);
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (err) {
      setError(err.message || "Algo salió mal");
      setSuccessMessage(null); // Limpiar mensaje de éxito si hay error
    }
  };

  const handleGuestLogin = () => {
    console.log("Ingresar como invitado");
    if (onGuestLogin) {
      onGuestLogin();
    }
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
          {successMessage && <p className="success-message">{successMessage}</p>} {/* Mostrar mensaje de éxito */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="login-input"
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
              />
            </div>
            <button type="submit" className="login-button">
              Ingresar
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