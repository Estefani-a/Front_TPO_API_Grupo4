// Importación del componente Link de React Router para navegación entre páginas
import { Link } from "react-router-dom"; 
// Importación de los estilos CSS específicos para componentes de autenticación
import "./auth.css";  

// Exportación por defecto del componente funcional Register
export default function Register() {   
  // Variable local que contiene el prefijo de clase CSS para mantener consistencia en nombres
  const auth = "auth";

  // FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO DE REGISTRO
  const handleSubmit = (e) => {
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
      alert("Por favor completa todos los campos");
      return;
    }
    
    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    // Verificar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    // VERIFICAR SI EL USUARIO YA EXISTE
    // Obtener usuarios existentes del localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar si el email ya está registrado
    if (existingUsers.find(user => user.email === email)) {
      alert("Este email ya está registrado");
      return;
    }
    
    // CREAR NUEVO USUARIO
    const newUser = {
      id: Date.now(), // ID único basado en timestamp
      name,
      email,
      password, // En un sistema real, esto debería estar hasheado
      createdAt: new Date().toISOString()
    };
    
    // GUARDAR USUARIO EN LOCALSTORAGE
    // Agregar el nuevo usuario al array y guardarlo
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    // REGISTRO EXITOSO
    alert("¡Registro exitoso! Ahora puedes iniciar sesión");
    
    // Redirigir a la página de login
    window.location.href = "/";
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
          
        </div>
      </div>
    </div>
  ); 
}