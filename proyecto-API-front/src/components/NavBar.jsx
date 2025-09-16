import React from "react";
import "./NavBar.css";

const NavBar = ({ handleChange, input, onCartClick, cartCount }) => {
  return (
    <nav className="steam-navbar">
      <div className="navbar-left">
        <a href="#tienda" className="navbar-link">Tienda</a>
        <a href="#destacados" className="navbar-link">Juegos destacados</a>
        <a href="#categorias" className="navbar-link">Categorías</a>
      </div>
      <div className="navbar-right">
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={input}
            onChange={handleChange}
          />
          <button type="button">
            <svg width="20" height="20" fill="white">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" fill="none"/>
              <line x1="15" y1="15" x2="19" y2="19" stroke="white" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        <button className="cart-btn" onClick={onCartClick}>
          🛒
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;