import { Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase();
    const password = e.target.password.value;
    // Permitir acceso admin con email admin@admin y password admin
    if (email === "admin@admin" && password === "admin") {
      localStorage.setItem("isAdmin", "true");
      window.location.href = "/";
      return;
    }
    // Si quieres agregar lógica para otros usuarios, aquí
    alert("Credenciales incorrectas");
  };

  return (
    <div className="container">
      <div className="form-card">
        <div className="logo">
          <img src="/Steam_icon_logo.png" alt="Steam Logo" className="logo-image" />
        </div>

        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              placeholder="correo@ejemplo.com" 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password"
              name="password"
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