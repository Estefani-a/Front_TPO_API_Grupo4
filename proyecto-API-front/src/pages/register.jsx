import { Link } from "react-router-dom";
import "./auth.css";

export default function register() {
  return (
    <div className="container">
      <div className="form-card">
        <div className="logo">
          <div className="logo-placeholder">LOGO</div>
        </div>
        
        <h2>Registrarse</h2>
        
        <form>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" placeholder="Tu nombre" />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="correo@ejemplo.com" />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="********" />
          </div>
          
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input type="password" placeholder="********" />
          </div>
          
          <button type="submit" className="btn">
            Crear cuenta
          </button>
        </form>
        
        <p className="switch-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}