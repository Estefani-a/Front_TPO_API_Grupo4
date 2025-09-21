import { Link } from "react-router-dom";
import "./auth.css";

export default function Register() {
  const auth = "auth";
  
  return (
    <div className="auth-body">
      <div className={`${auth}-container`}>
        <div className={`${auth}-form-card`}>
          <div className={`${auth}-logo`}>
            <img src="/Steam_icon_logo.png" alt="Steam Logo" className={`${auth}-logo-image`} />
          </div>

          <h2>Registrarse</h2>

          <form>
            <div className={`${auth}-form-group`}>
              <label htmlFor="name">Nombre</label>
              <input 
                id="name"
                type="text" 
                placeholder="Tu nombre" 
                required
              />
            </div>

            <div className={`${auth}-form-group`}>
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                placeholder="correo@ejemplo.com" 
                required
              />
            </div>

            <div className={`${auth}-form-group`}>
              <label htmlFor="password">Contraseña</label>
              <input 
                id="password"
                type="password" 
                placeholder="********" 
                required
              />
            </div>

            <div className={`${auth}-form-group`}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input 
                id="confirmPassword"
                type="password" 
                placeholder="********" 
                required
              />
            </div>

            <button type="submit" className={`${auth}-btn`}>
              Crear cuenta
            </button>
          </form>

          <p className={`${auth}-switch-text`}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/" className={`${auth}-link`}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}