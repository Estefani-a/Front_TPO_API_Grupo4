// Comentario de archivo - Componente Soporte actualizado
// Importación de React y el hook useEffect para manejar efectos secundarios
import React, { useEffect } from "react"; 
// Importación de los estilos CSS específicos para este componente
import "./Soporte.css";  

// Exportación por defecto del componente funcional Soporte
export default function Soporte() {   
  
  // HOOK useEffect PARA MANEJAR ESTILOS GLOBALES DEL BODY
  useEffect(() => {     
    // EFECTO: Se ejecuta después de que el componente se monta
    // Cambiar la clase CSS del elemento <body> del documento para aplicar estilos específicos
    document.body.className = "info-page";        
    
    // CLEANUP FUNCTION: Se ejecuta cuando el componente se desmonta     
    // Función de limpieza que restaura el className original del body
    return () => {
      // Eliminar la clase CSS del body cuando se salga de esta página
      document.body.className = "";
    };
  }, []); // Array de dependencias vacío = se ejecuta solo una vez al montar

  // ARRAY DE PREGUNTAS FRECUENTES (FAQ)
  // Estructura de datos que contiene las preguntas y respuestas del soporte
  const faqs = [     
    {       
      // Pregunta sobre proceso de compra
      q: "¿Cómo puedo comprar un juego?",       
      // Respuesta explicando el flujo de compra
      a: "Agrega el juego al carrito y dirígete a la sección de compra para completar el pago."     
    },     
    {       
      // Pregunta sobre política de devoluciones
      q: "¿Puedo devolver un juego?",       
      // Respuesta con condiciones específicas de reembolso
      a: "Sí, puedes solicitar un reembolso dentro de los 14 días posteriores a la compra siempre que no hayas jugado más de 2 horas."     
    },     
    {       
      // Pregunta sobre métodos de pago disponibles
      q: "¿Qué métodos de pago aceptan?",       
      // Respuesta listando opciones de pago
      a: "Aceptamos tarjetas de crédito, débito y billeteras virtuales como MercadoPago."     
    },     
    {       
      // Pregunta sobre problemas de acceso
      q: "¿Por qué no puedo iniciar sesión?",       
      // Respuesta con pasos de solución de problemas
      a: "Verifica que tu correo y contraseña sean correctos. Si el problema persiste, utiliza la opción 'Recuperar contraseña'."     
    },     
    {       
      // Pregunta sobre contacto con soporte
      q: "¿Cómo contacto con soporte técnico?",       
      // Respuesta con información de contacto
      a: "Puedes escribirnos a soporte@grupocuatro.com o usar el formulario de contacto dentro de la plataforma."     
    },     
    {       
      // Pregunta sobre compartir cuentas
      q: "¿Puedo compartir mi cuenta?",       
      // Respuesta sobre políticas de seguridad
      a: "No está permitido compartir la cuenta. Cada usuario debe tener su propia cuenta para mantener la seguridad."     
    }   
  ];

  return (     
    // ESTRUCTURA PRINCIPAL DEL COMPONENTE
    
    // Contenedor raíz con clase específica para páginas informativas
    <div className="info-root">       
      
      {/* Contenedor principal que centra el contenido */}
      <div className="info-container">         
        
        {/* TÍTULO PRINCIPAL DE LA PÁGINA */}
        <h1 className="info-title">Centro de soporte</h1>         
        
        {/* RENDERIZADO DINÁMICO DE PREGUNTAS FRECUENTES */}
        {/* map() itera sobre el array faqs y crea un elemento por cada FAQ */}
        {faqs.map((item, idx) => (           
          // Contenedor individual para cada pregunta-respuesta
          // key={idx} es requerido por React para identificar cada elemento de la lista
          <div key={idx} className="faq-item">             
            
            {/* PREGUNTA */}
            {/* Renderiza la pregunta usando la propiedad 'q' del objeto actual */}
            <h3 className="faq-question">{item.q}</h3>             
            
            {/* RESPUESTA */}
            {/* Renderiza la respuesta usando la propiedad 'a' del objeto actual */}
            <p className="faq-answer">{item.a}</p>           
          </div>         
        ))}       
      </div>       
      
      {/* FOOTER CON INFORMACIÓN DE CONTACTO ADICIONAL */}
      {/* Footer fuera del container principal para diferente posicionamiento */}
      <footer className="info-footer">         
        ¿Aún tienes dudas? Escríbenos a soporte@grupocuatro.com       
      </footer>     
    </div>   
  ); 
}