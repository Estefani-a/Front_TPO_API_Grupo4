import React from "react";
import { useNavigate } from "react-router-dom";

const steamLogo = "https://store.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";

export default function HeaderSteam() {
  const navigate = useNavigate();
  return (
    <header style={{
      width: "100vw",
      left: 0,
      top: 0,
      position: "fixed",
      background: "#171a21",
      borderBottom: "1px solid #2d3544",
      zIndex: 1000,
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        width: "100%",
        margin: 0,
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={steamLogo} alt="Steam" style={{ height: 36, cursor: "pointer" }} onClick={() => navigate("/")} />
          <nav style={{ display: "flex", gap: 24 }}>
            <a href="#" style={{ color: "#c7d5e0", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>TIENDA</a>
            <a href="#" style={{ color: "#c7d5e0", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>COMUNIDAD</a>
            <a href="#" style={{ color: "#c7d5e0", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>ACERCA DE</a>
            <a href="#" style={{ color: "#c7d5e0", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>SOPORTE</a>
          </nav>
        </div>
        <div>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "linear-gradient(90deg, #3a9aed 0%, #2179c7 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              padding: "8px 20px",
              fontSize: 13,
              cursor: "pointer",
              marginRight: 8,
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "#5c7e10",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              padding: "8px 20px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
}
