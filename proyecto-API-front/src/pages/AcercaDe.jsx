// Importación de React y el hook useEffect para manejar efectos secundarios
import React, { useEffect } from "react"; 
// Importación de los estilos CSS específicos para este componente
import "./AcercaDe.css";  

// Exportación por defecto del componente funcional AcercaDe
export default function AcercaDe() {   
  
  // HOOK useEffect PARA MANEJAR ESTILOS GLOBALES DEL BODY
  useEffect(() => {
    // EFECTO: Se ejecuta después de que el componente se monta
    // Cambiar la clase CSS del elemento <body> del documento
    document.body.className = "info-page";
    
    // CLEANUP FUNCTION: Se ejecuta cuando el componente se desmonta
    // Función de limpieza que restaura el className original del body
    return () => {
      // Eliminar la clase CSS del body cuando se salga de esta página
      document.body.className = "";
    };
  }, []); // Array de dependencias vacío = se ejecuta solo una vez al montar
  
  return (
    // ESTRUCTURA PRINCIPAL DEL COMPONENTE
    
    // Contenedor raíz con clase específica para esta página
    <div className="info-root">
      
      {/* Contenedor principal que centra el contenido */}
      <div className="info-container">
        
        {/* TÍTULO PRINCIPAL DE LA PÁGINA */}
        <h1 className="info-title">Acerca de esta plataforma</h1> 

        {/* PÁRRAFO 1: INTRODUCCIÓN Y PROPÓSITO */}
        <p className="info-text">
          Bienvenido a nuestra plataforma de juegos. Este proyecto está inspirado en{" "}
          {/* Texto en negrita para destacar "Steam" */}
          <b>Steam</b> y fue desarrollado para ofrecerte una experiencia sencilla pero
          completa: explorar juegos, añadirlos al carrito y gestionar tus compras de
          manera intuitiva.
        </p> 

        {/* PÁRRAFO 2: OBJETIVO Y CARACTERÍSTICAS */}
        <p className="info-text">
          Nuestro objetivo es brindar un catálogo variado y una interfaz amigable,
          permitiendo a los usuarios descubrir juegos, ver detalles, y realizar compras
          en pocos pasos.
        </p> 

        {/* PÁRRAFO 3: INFORMACIÓN DEL EQUIPO Y PROYECTO */}
        <p className="info-text">
          Esta aplicación fue creada por el equipo{" "}
          {/* Span con estilos inline para destacar el nombre del grupo */}
          <span style={{ fontWeight: "bold", color: "#66c0f4" }}>Grupo 4</span> como
          proyecto académico en 2025.
        </p> 

        {/* FOOTER CON INFORMACIÓN DE DERECHOS */}
        <footer className="info-footer">
          © 2025 Grupo 4. Todos los derechos reservados.
        </footer>
        
      </div>
    </div>
  ); 
}