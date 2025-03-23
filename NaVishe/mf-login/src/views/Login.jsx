import React, { useState } from "react";
import "../index.css";
import naVisheLogo from "../assets/na-vishe-logo.png";

const Login = ({ onLoginSuccess, onGuestLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    try {
      const response = await fetch("https://your-api.com/login", {
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
      console.log("Inicio de sesión exitoso:", data);
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (err) {
      setError(err.message || "Algo salió mal");
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
          <h2>Iniciar Sesión</h2>
          {error && <p className="error-message">{error}</p>}
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