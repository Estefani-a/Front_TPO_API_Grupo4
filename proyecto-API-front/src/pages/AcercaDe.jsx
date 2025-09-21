// AcercaDe.jsx - Actualizado
import React, { useEffect } from "react";
import "./ExtraPages.css";

export default function AcercaDe() {
  useEffect(() => {

    document.body.className = "info-page";
    
  
    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <div className="info-root">
      <div className="info-container">
        <h1 className="info-title">Acerca de esta plataforma</h1>
        <p className="info-text">
          Bienvenido a nuestra plataforma de juegos. Este proyecto está inspirado en Steam 
          y fue desarrollado para ofrecerte una experiencia sencilla pero completa: explorar 
          juegos, añadirlos al carrito y gestionar tus compras de manera intuitiva.
        </p>
        <p className="info-text">
          Nuestro objetivo es brindar un catálogo variado y una interfaz amigable, 
          permitiendo a los usuarios descubrir juegos, ver detalles, y realizar compras 
          en pocos pasos.
        </p>
        <p className="info-text">
          Esta aplicación fue creada por el equipo <b>Grupo 4</b> como proyecto académico en 2025.
        </p>
      </div>
      <footer className="info-footer">
        © 2025 Grupo 4. Todos los derechos reservados.
      </footer>
    </div>
  );
}

