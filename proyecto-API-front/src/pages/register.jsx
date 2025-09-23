// Importación del componente Link de React Router para navegación entre páginas
import { Link } from "react-router-dom"; 
// Importación de los estilos CSS específicos para componentes de autenticación
import "./auth.css";  

// Exportación por defecto del componente funcional Register
export default function Register() {   
  // Variable local que contiene el prefijo de clase CSS para mantener consistencia en nombres
  const auth = "auth";      

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
          <form>
            
            {/* CAMPO: NOMBRE */}
            <div className={`${auth}-form-group`}>
              <label htmlFor="name">Nombre</label>
              <input 
                id="name"                  // ID que conecta con el label
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
                type="password"            // Tipo que oculta el texto ingresado
                placeholder="********"     // Indicador visual de campo de contraseña
                required                   // Campo obligatorio
              />
            </div> 

            {/* CAMPO: CONFIRMAR CONTRASEÑA */}
            <div className={`${auth}-form-group`}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input 
                id="confirmPassword"       // ID único para este campo
                type="password"            // Tipo que oculta el texto
                placeholder="********"     // Indicador visual
                required                   // Campo obligatorio
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