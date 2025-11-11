// Importación del componente Link de React Router para navegación entre páginas
import { Link } from "react-router-dom";
import { useState } from "react";
// Importación de los estilos CSS específicos para componentes de autenticación
import "./auth.css";  

// Exportación por defecto del componente funcional Login
export default function Login() {   
  // Variable local que contiene el prefijo de clase CSS para mantener consistencia
  const auth = "auth";
  const [notification, setNotification] = useState(null);
  
  // Función para mostrar notificaciones
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };      

  // FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO
  const handleSubmit = async (e) => {
    // Prevenir el comportamiento por defecto del form (recarga de página)
    e.preventDefault();
    
    // OBTENER DATOS DEL FORMULARIO
    // Obtener email del input y convertirlo a minúsculas para comparación
    const email = e.target.email.value.toLowerCase().trim();
    // Obtener contraseña del input tal como fue ingresada
    const password = e.target.password.value;
    
    // VALIDACIÓN DE CAMPOS VACÍOS
    if (!email || !password) {
      showNotification("Por favor completa todos los campos", "error");
      return;
    }
    
    try {
      console.log('📤 Intentando iniciar sesión con:', email);
      
      // ENVIAR PETICIÓN AL BACKEND PARA AUTENTICAR USUARIO
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      console.log('📡 Respuesta recibida:', response.status, response.statusText);
      
      // VERIFICAR SI LA AUTENTICACIÓN FUE EXITOSA
      if (response.ok) {
        const authData = await response.json();
        console.log('✅ Login exitoso:', authData);
        
        // Verificar si el usuario es administrador
        const isAdmin = authData.role === 'ADMIN';
        
        // Guardar token JWT y datos del usuario
        localStorage.setItem("authToken", authData.token);
        if (isAdmin) {
          localStorage.setItem("isAdmin", "true");
        } else {
          localStorage.removeItem("isAdmin");
        }
        localStorage.setItem("currentUser", JSON.stringify({
          name: authData.name,
          email: authData.email,
          role: authData.role,
          isAdmin: isAdmin
        }));
        
        // AUTENTICACIÓN EXITOSA
        showNotification(`¡Bienvenido ${authData.name}!${isAdmin ? ' 🔑 (Admin)' : ''}`, 'success');
        
        // Redirigir a la página principal
        setTimeout(() => window.location.href = "/", 1000);
      } else {
        // MANEJAR ERRORES DEL SERVIDOR
        console.error('❌ Error en login, status:', response.status);
        
        let errorMessage = "Error al iniciar sesión. Por favor intenta nuevamente.";
        
        try {
          const errorData = await response.json();
          console.error('❌ Detalles del error:', errorData);
          
          if (response.status === 401 || response.status === 400) {
            errorMessage = "Email o contraseña incorrectos. Por favor verifica tus credenciales.";
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
      console.error('❌ Error al iniciar sesión:', error);
      showNotification(`Error de conexión con el servidor. Por favor verifica que el backend esté funcionando.`, 'error');
    }
  };

  return (
    // ESTRUCTURA PRINCIPAL DEL COMPONENTE
    
    // Contenedor principal que envuelve todo el formulario de login
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
          <h2>Iniciar Sesión</h2> 

          {/* FORMULARIO DE LOGIN */}
          {/* onSubmit conecta el evento de envío con la función handleSubmit */}
          <form onSubmit={handleSubmit}>
            
            {/* CAMPO: EMAIL */}
            <div className={`${auth}-form-group`}>
              <label htmlFor="email">Email</label>
              <input 
                id="email"                     // ID que conecta con el label
                name="email"                   // Nombre para acceder al valor en handleSubmit
                type="email"                   // Tipo que valida formato de email
                placeholder="correo@ejemplo.com"  // Ejemplo de formato esperado
                required                       // Campo obligatorio para validación HTML5
              />
            </div> 

            {/* CAMPO: CONTRASEÑA */}
            <div className={`${auth}-form-group`}>
              <label htmlFor="password">Contraseña</label>
              <input 
                id="password"              // ID que conecta con el label
                name="password"            // Nombre para acceder al valor en handleSubmit
                type="password"            // Tipo que oculta el texto ingresado
                placeholder="••••••••"     // Indicador visual de campo de contraseña
                required                   // Campo obligatorio
              />
            </div> 

            {/* BOTÓN DE ENVÍO */}
            {/* Al hacer click, se ejecuta handleSubmit automáticamente */}
            <button type="submit" className={`${auth}-btn`}>
              Ingresar
            </button>
            
          </form> 

          {/* ENLACE PARA USUARIOS NUEVOS */}
          <p className={`${auth}-switch-text`}>
            ¿No tienes cuenta?{" "}  {/* Texto + espacio en blanco */}
            {/* Link de React Router que navega a la página de registro */}
            <Link to="/register" className={`${auth}-link`}>
              Regístrate
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
};