import React from "react";
import "../index.css";
import Navbar from "componentes-compartidos/navbar";

const Camaras = () => {
  return (
    <div style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div className="content-wrapper" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1>Colmenas</h1>
      </div>
    </div>
  );
};

export default Camaras;