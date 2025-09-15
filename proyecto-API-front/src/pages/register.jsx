import { Link } from "react-router-dom";
import "./auth.css";

export default function Register() { 
  return (
    <div className="container">
      <div className="form-card">
        <div className="logo">
          <img src="/Steam_icon_logo.png" alt="Steam Logo" className="logo-image" />
        </div>

        <h2>Registrarse</h2>

        <form>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input 
              id="name"
              type="text" 
              placeholder="Tu nombre" 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="correo@ejemplo.com" 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password"
              type="password" 
              placeholder="********" 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input 
              id="confirmPassword"
              type="password" 
              placeholder="********" 
              required
            />
          </div>

          <button type="submit" className="btn">
            Crear cuenta
          </button>
        </form>

        <p className="switch-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}