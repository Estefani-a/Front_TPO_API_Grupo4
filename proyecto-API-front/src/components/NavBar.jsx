import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const ALL_TAGS = [
  "Shooter", "Multiplayer", "Táctico", "Acción", "Mundo Abierto", "Crimen", "Aventura", "Western", "RPG", "Futurista", "Cooperativo", "Criaturas", "Supervivencia", "Multijugador"
];

const NavBar = ({ handleChange, input, onCartClick, cartCount, onTagFilter }) => {
  const navigate = useNavigate();
  const [showTags, setShowTags] = useState(false);
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';

  // Obtener tags únicos de todos los juegos (incluyendo custom)
  const getAllTags = () => {
    let tags = [...ALL_TAGS];
    try {
      const rawGames = localStorage.getItem('customGames');
      if (rawGames) {
        const customGames = JSON.parse(rawGames);
        customGames.forEach(game => {
          if (Array.isArray(game.tags)) {
            game.tags.forEach(tag => {
              if (!tags.includes(tag)) tags.push(tag);
            });
          }
        });
      }
    } catch {}
    return Array.from(new Set(tags));
  };

  // Más categorías fijas
  const extraCategories = ["Indie", "Estrategia", "Simulación", "Deportes", "Puzzle", "Terror", "Educativo", "Casual", "Aventura gráfica", "Plataformas"];

  return (
    <nav className="steam-navbar">
      <div className="navbar-left">
        <a href="#tienda" className="navbar-link" onClick={e => { e.preventDefault(); navigate("/"); }}>Tienda</a>
        <a href="#destacados" className="navbar-link">Juegos destacados</a>
        <div
          className="navbar-link"
          style={{ position: 'relative', cursor: 'pointer' }}
          onMouseEnter={() => setShowTags(true)}
          onMouseLeave={() => setShowTags(false)}
        >
          Categorías
          {showTags && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#23262e',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              padding: '10px 0',
              minWidth: 160,
              zIndex: 100,
              maxHeight: 320,
              overflowY: 'auto',
            }}>
              {[...getAllTags(), ...extraCategories].map(tag => (
                <div
                  key={tag}
                  style={{
                    padding: '8px 18px',
                    color: '#c7d5e0',
                    cursor: 'pointer',
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => { setShowTags(false); onTagFilter(tag); }}
                  onMouseDown={e => e.preventDefault()}
                  onMouseOver={e => e.currentTarget.style.background = '#2a475e'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
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
      </div>
    </nav>
  );
};

export default NavBar;