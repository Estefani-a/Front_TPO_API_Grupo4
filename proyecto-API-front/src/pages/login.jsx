import { Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  return (
    <div className="container">
      <div className="form-card">
        <div className="logo">
          <img src="/Steam_icon_logo.png" alt="Steam Logo" className="logo-image" />
        </div>

        <h2>Iniciar Sesión</h2>

        <form>
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
              placeholder="••••••••" 
              required
            />
          </div>

          <button type="submit" className="btn">
            Ingresar
          </button>
        </form>

        <p className="switch-text">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="link">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}