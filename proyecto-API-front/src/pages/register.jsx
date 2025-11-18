// Importación del componente Link de React Router para navegación entre páginas
import { Link } from "react-router-dom";
import { useState } from "react";
// Importación de los estilos CSS específicos para componentes de autenticación
import "./auth.css";  

// Exportación por defecto del componente funcional Register
export default function Register() {   
  // Variable local que contiene el prefijo de clase CSS para mantener consistencia en nombres
  const auth = "auth";
  const [notification, setNotification] = useState(null);
  
  // Función para mostrar notificaciones
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO DE REGISTRO
  const handleSubmit = async (e) => {
    // Prevenir el comportamiento por defecto del form (recarga de página)
    e.preventDefault();
    
    // OBTENER DATOS DEL FORMULARIO
    const name = e.target.name.value.trim();
    const email = e.target.email.value.toLowerCase().trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    
    // VALIDACIONES DEL FORMULARIO
    // Verificar que todos los campos estén completos
    if (!name || !email || !password || !confirmPassword) {
      showNotification("Por favor completa todos los campos", "error");
      return;
    }
    
    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error");
      return;
    }
    
    // Verificar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      showNotification("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    
    try {
      console.log('📤 Enviando datos de registro:', { name, email });
      
      // ENVIAR PETICIÓN AL BACKEND PARA REGISTRAR USUARIO
      //const response = await fetch('http://localhost:8080/api/auth/register', 
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });
      
      console.log('📡 Respuesta recibida:', response.status, response.statusText);
      
      // VERIFICAR SI EL REGISTRO FUE EXITOSO
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Usuario registrado exitosamente en la BASE DE DATOS:', userData);
        console.log('📊 ID del usuario en la base de datos:', userData.id);
        console.log('👤 Datos del usuario:', {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
        
        // REGISTRO EXITOSO
        showNotification(`¡Cuenta creada exitosamente! Ahora puedes iniciar sesión`, 'success');
        
        // Redirigir a la página de login
        setTimeout(() => window.location.href = "/", 2000);
      } else {
        // MANEJAR ERRORES DEL SERVIDOR
        let errorMessage = "Error al registrar usuario. Por favor intenta nuevamente.";
        
        try {
          const errorData = await response.json();
          console.error('❌ Error del servidor:', errorData);
          
          // Verificar si el error es por email duplicado
          if (response.status === 409 || errorData.message?.includes('email') || errorData.message?.includes('uso')) {
            errorMessage = "Este email ya está registrado. Por favor usa otro email o inicia sesión.";
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (parseError) {
          console.error('❌ Error al parsear respuesta:', parseError);
        }
        
        showNotification(errorMessage, 'error');
      }
    } catch (error) {
      // MANEJAR ERRORES DE CONEXIÓN
      console.error('❌ Error al registrar usuario:', error);
      showNotification(`Error de conexión con el servidor. Por favor verifica que el backend esté funcionando.`, 'error');
    }
  };      

  return (
    // ESTRUCTURA PRINCIPAL DEL COMPONENTE
    
    // Contenedor principal que envuelve todo el formulario de registro
    <div className="auth-body">
      
      {/* Contenedor secundario que centra el formulario en la página */}
      <div className={`${auth}-container`}>
        
        {/* Tarjeta/card que contiene el formulario con estilos específicos */}
        <div className={`${auth}-form-card`}>
          
          {/* SECCIÓN DEL LOGO */}
          <div className={`${auth}-logo`}>
            {/* Imagen del logo de Steam con ruta relativa desde public */}
            <img src="/Steam_icon_logo.png" alt="Steam Logo" className={`${auth}-logo-image`} />
          </div> 

          {/* TÍTULO DE LA PÁGINA */}
          <h2>Registrarse</h2> 

          {/* FORMULARIO DE REGISTRO */}
          {/* onSubmit conecta el evento de envío con la función handleSubmit */}
          <form onSubmit={handleSubmit}>
            
            {/* CAMPO: NOMBRE */}
            <div className={`${auth}-form-group`}>
              <label htmlFor="name">Nombre</label>
              <input 
                id="name"                  // ID que conecta con el label
                name="name"                // Nombre para acceder al valor en handleSubmit
                type="text"                // Tipo de input para texto libre
                placeholder="Tu nombre"    // Texto de ayuda mostrado en el campo
                required                   // Campo obligatorio para validación HTML5
              />
            </div> 

            {/* CAMPO: EMAIL */}
            <div className={`${auth}-form-group`}>
              <label htmlFor="email">Email</label>
              <input 
                id="email"                     // ID que conecta con el label
                name="email"                   // Nombre para acceder al valor en handleSubmit
                type="email"                   // Tipo especial que valida formato de email
                placeholder="correo@ejemplo.com"  // Ejemplo de formato esperado
                required                       // Campo obligatorio
              />
            </div> 

            {/* CAMPO: CONTRASEÑA */}
            <div className={`${auth}-form-group`}>
              <label htmlFor="password">Contraseña</label>
              <input 
                id="password"              // ID que conecta con el label
                name="password"            // Nombre para acceder al valor en handleSubmit
                type="password"            // Tipo que oculta el texto ingresado
                placeholder="********"     // Indicador visual de campo de contraseña
                required                   // Campo obligatorio
                minLength="6"              // Validación HTML5 para longitud mínima
              />
            </div> 

            {/* CAMPO: CONFIRMAR CONTRASEÑA */}
            <div className={`${auth}-form-group`}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input 
                id="confirmPassword"       // ID único para este campo
                name="confirmPassword"     // Nombre para acceder al valor en handleSubmit
                type="password"            // Tipo que oculta el texto
                placeholder="********"     // Indicador visual
                required                   // Campo obligatorio
                minLength="6"              // Validación HTML5 para longitud mínima
              />
            </div> 

            {/* BOTÓN DE ENVÍO */}
            <button type="submit" className={`${auth}-btn`}>
              Crear cuenta
            </button>
            
          </form> 

          {/* ENLACE PARA USUARIOS EXISTENTES */}
          <p className={`${auth}-switch-text`}>
            ¿Ya tienes cuenta?{" "}  {/* Texto + espacio en blanco */}
            {/* Link de React Router que navega a la página de login (ruta "/") */}
            <Link to="/" className={`${auth}-link`}>
              Inicia sesión
            </Link>
          </p>

          {/* ENLACE PARA VER USUARIOS REGISTRADOS */}
          <p className={`${auth}-switch-text`} style={{ marginTop: 10 }}>
            <Link to="/users" className={`${auth}-link`}>
              👥 Ver usuarios registrados en la base de datos
            </Link>
          </p>
          
        </div>
      </div>
      
      {/* Notificación Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 24,
          background: notification.type === 'success' ? '#5c7e10' : notification.type === 'error' ? '#c1272d' : '#2a475e',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: 8,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          zIndex: 9999,
          minWidth: 300,
          maxWidth: 400,
          animation: 'slideIn 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 15,
          fontWeight: 500
        }}>
          <span style={{ fontSize: 20 }}>
            {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span style={{ flex: 1 }}>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
              padding: 4,
              opacity: 0.7,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  ); 
}