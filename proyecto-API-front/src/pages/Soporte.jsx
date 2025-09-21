// Soporte.jsx - Actualizado  
import React, { useEffect } from "react";
import "./ExtraPages.css";

export default function Soporte() {
  useEffect(() => {
    
    document.body.className = "info-page";
    
  
    return () => {
      document.body.className = "";
    };
  }, []);

  const faqs = [
    {
      q: "¿Cómo puedo comprar un juego?",
      a: "Agrega el juego al carrito y dirígete a la sección de compra para completar el pago."
    },
    {
      q: "¿Puedo devolver un juego?",
      a: "Sí, puedes solicitar un reembolso dentro de los 14 días posteriores a la compra siempre que no hayas jugado más de 2 horas."
    },
    {
      q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos tarjetas de crédito, débito y billeteras virtuales como MercadoPago."
    },
    {
      q: "¿Por qué no puedo iniciar sesión?",
      a: "Verifica que tu correo y contraseña sean correctos. Si el problema persiste, utiliza la opción 'Recuperar contraseña'."
    },
    {
      q: "¿Cómo contacto con soporte técnico?",
      a: "Puedes escribirnos a soporte@grupocuatro.com o usar el formulario de contacto dentro de la plataforma."
    },
    {
      q: "¿Puedo compartir mi cuenta?",
      a: "No está permitido compartir la cuenta. Cada usuario debe tener su propia cuenta para mantener la seguridad."
    }
  ];

  return (
    <div className="info-root">
      <div className="info-container">
        <h1 className="info-title">Centro de soporte</h1>
        {faqs.map((item, idx) => (
          <div key={idx} className="faq-item">
            <h3 className="faq-question">{item.q}</h3>
            <p className="faq-answer">{item.a}</p>
          </div>
        ))}
      </div>
      <footer className="info-footer">
        ¿Aún tienes dudas? Escríbenos a soporte@grupocuatro.com
      </footer>
    </div>
  );
}