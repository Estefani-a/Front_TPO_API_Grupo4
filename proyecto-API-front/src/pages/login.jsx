// Importación del componente Link de React Router para navegación entre páginas
import { Link } from "react-router-dom"; 
// Importación de los estilos CSS específicos para componentes de autenticación
import "./auth.css";  

// Exportación por defecto del componente funcional Login
export default function Login() {   
  // Variable local que contiene el prefijo de clase CSS para mantener consistencia
  const auth = "auth";      

  // FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO
  const handleSubmit = (e) => {
    // Prevenir el comportamiento por defecto del form (recarga de página)
    e.preventDefault();
    
    // OBTENER DATOS DEL FORMULARIO
    // Obtener email del input y convertirlo a minúsculas para comparación
    const email = e.target.email.value.toLowerCase().trim();
    // Obtener contraseña del input tal como fue ingresada
    const password = e.target.password.value;
    
    // VALIDACIÓN DE CAMPOS VACÍOS
    if (!email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }
    
    // VALIDACIÓN DE CREDENCIALES DE ADMINISTRADOR
    // Verificar si las credenciales coinciden con el admin hardcodeado
    if (email === "admin@admin" && password === "admin") {
      // AUTENTICACIÓN EXITOSA PARA ADMIN
      // Guardar en localStorage que el usuario es administrador
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("currentUser", JSON.stringify({
        name: "Administrador",
        email: "admin@admin",
        isAdmin: true
      }));
      // Redirigir a la página principal usando navegación nativa del navegador
      window.location.href = "/";
      // Terminar ejecución de la función aquí
      return;
    }
    
    // VALIDACIÓN DE CREDENCIALES DE USUARIOS REGISTRADOS
    // Obtener lista de usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Buscar usuario con email y contraseña coincidentes
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // AUTENTICACIÓN EXITOSA PARA USUARIO REGISTRADO
      // Limpiar flag de admin ya que es usuario regular
      localStorage.removeItem("isAdmin");
      // Guardar información del usuario actual
      localStorage.setItem("currentUser", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: false
      }));
      // Redirigir a la página principal
      window.location.href = "/";
      return;
    }
    
    // CREDENCIALES INCORRECTAS
    // Mostrar alerta si ninguna credencial coincide
    alert("Email o contraseña incorrectos");
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
          
        </div>
      </div>
    </div>
  ); 
};