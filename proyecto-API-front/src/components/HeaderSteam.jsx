import React from "react";
import { useNavigate } from "react-router-dom";

const steamLogo = "https://store.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";

export default function HeaderSteam() {
  const [showTagDropdown, setShowTagDropdown] = React.useState(false);
  // Obtener tags únicos de todos los juegos (incluyendo custom)
  const ALL_TAGS = [
    "Shooter", "Multiplayer", "Táctico", "Acción", "Mundo Abierto", "Crimen", "Aventura", "Western", "RPG", "Futurista", "Cooperativo", "Criaturas", "Supervivencia", "Multijugador",
    "Indie", "Estrategia", "Simulación", "Deportes", "Puzzle", "Terror", "Educativo", "Casual", "Aventura gráfica", "Plataformas"
  ];
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
  const navigate = useNavigate();
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [form, setForm] = React.useState({
    title: '',
    image: '',
    description: '',
    tags: '',
    price: ''
  });
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  return (
    <header style={{
      width: "100vw",
      left: 0,
      top: 0,
      position: "fixed",
      background: "#171a21",
      borderBottom: "1px solid #2d3544",
      zIndex: 1000,
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        width: "100%",
        margin: 0,
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={steamLogo} alt="Steam" style={{ height: 36, cursor: "pointer" }} onClick={() => navigate("/")} />
          <nav style={{ display: "flex", gap: 24 }}>
            <a
              href="#"
              onClick={e => { e.preventDefault(); navigate("/"); }}
              style={{ color: "#c7d5e0", textDecoration: "none", fontSize: 15, fontWeight: 500 }}
            >
              TIENDA
            </a>
            <a href="#" style={{ color: "#c7d5e0", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>COMUNIDAD</a>
            <a
              href="#"
              onClick={e => { e.preventDefault(); navigate("/acerca-de"); }}
              style={{ color: "#c7d5e0", textDecoration: "none", fontSize: 15, fontWeight: 500 }}
            >
              ACERCA DE
            </a>
            <a
              href="#"
              onClick={e => { e.preventDefault(); navigate("/soporte"); }}
              style={{ color: "#c7d5e0", textDecoration: "none", fontSize: 15, fontWeight: 500 }}
            >
              SOPORTE
            </a>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', height: '60px', position: 'relative' }}>
          {isAdmin ? (
            <>
              <button
                style={{ marginRight: 12, background: '#66c0f4', color: '#171a21', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', height: 40, alignSelf: 'center' }}
                onClick={() => setShowAddModal(true)}
              >
                Agregar juego
              </button>
              <span
                title="Admin"
                style={{ display: 'flex', alignItems: 'center', height: '60px', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <svg width="28" height="28" fill="white" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                </svg>
                {showUserDropdown && (
                  <div
                    className="user-dropdown"
                    style={{ position: 'absolute', top: 'calc(100% + 2px)', right: 0, background: '#23262e', color: '#fff', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', padding: '10px 24px', minWidth: 120, zIndex: 100, fontSize: 15, textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => { localStorage.removeItem('isAdmin'); window.location.reload(); }}
                  >
                    Cerrar sesión
                  </div>
                )}
              </span>
              {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>
                  <form onClick={e => e.stopPropagation()} style={{ background: '#23262e', borderRadius: 12, padding: '32px 32px 24px 32px', minWidth: 340, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={e => {
                    e.preventDefault();
                    const tagsFormatted = form.tags.split(',').map(t => {
                      const tag = t.trim();
                      return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
                    }).filter(Boolean);
                    const newGame = {
                      id: Date.now(),
                      title: form.title,
                      image: form.image,
                      description: form.description,
                      tags: tagsFormatted,
                      price: parseFloat(form.price),
                      images: [form.image],
                      reviews: [],
                    };
                    const raw = localStorage.getItem('customGames');
                    const customGames = raw ? JSON.parse(raw) : [];
                    customGames.push(newGame);
                    localStorage.setItem('customGames', JSON.stringify(customGames));
                    window.dispatchEvent(new CustomEvent('customGames-updated'));
                    setShowAddModal(false);
                    setForm({ title: '', image: '', description: '', tags: '', price: '' });
                    alert('Juego agregado correctamente');
                  }}>
                    <h3 style={{ color: '#66c0f4', marginBottom: 8 }}>Agregar juego</h3>
                    <input type="text" placeholder="Nombre del juego" value={form.title} required onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15 }} />
                    <input type="text" placeholder="Link a la foto" value={form.image} required onChange={e => setForm(f => ({ ...f, image: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15 }} />
                    <textarea placeholder="Descripción" value={form.description} required onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15, minHeight: 60 }} />
          
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        readOnly
                        value={form.tags ? form.tags.split(',').join(', ') : ''}
                        placeholder="Tags"
                        style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15, width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                        onFocus={() => setShowTagDropdown(true)}
                        onClick={() => setShowTagDropdown(v => !v)}
                      />
                      {/* Chips de tags seleccionados */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                        {form.tags && form.tags.split(',').map(tag => (
                          <span key={tag} style={{ background: '#2a475e', color: '#c7d5e0', borderRadius: 12, padding: '2px 10px', fontSize: 13, display: 'inline-flex', alignItems: 'center' }}>
                            {tag}
                            <span style={{ marginLeft: 6, cursor: 'pointer', fontWeight: 'bold' }} onClick={() => {
                              const arr = form.tags.split(',').filter(t => t !== tag);
                              setForm(f => ({ ...f, tags: arr.join(',') }));
                            }}>×</span>
                          </span>
                        ))}
                      </div>
                      {showTagDropdown && (
                        <div style={{ position: 'absolute', top: 38, left: 0, background: '#23262e', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', padding: '8px 0', minWidth: 180, zIndex: 100, maxHeight: 180, overflowY: 'auto' }}>
                          {getAllTags().filter(tag => !(form.tags && form.tags.split(',').includes(tag))).map(tag => (
                            <div
                              key={tag}
                              style={{ padding: '8px 18px', color: '#c7d5e0', cursor: form.tags && form.tags.split(',').length >= 3 ? 'not-allowed' : 'pointer', fontSize: 14, whiteSpace: 'nowrap', transition: 'background 0.2s', opacity: form.tags && form.tags.split(',').length >= 3 ? 0.5 : 1 }}
                              onClick={() => {
                                if (form.tags && form.tags.split(',').length >= 3) return;
                                setForm(f => ({ ...f, tags: f.tags ? f.tags + ',' + tag : tag }));
                                setShowTagDropdown(false);
                              }}
                              onMouseDown={e => e.preventDefault()}
                              onMouseOver={e => e.currentTarget.style.background = '#2a475e'}
                              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Cerrar dropdown al hacer click fuera */}
                      {showTagDropdown && (
                        <div onClick={() => setShowTagDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'transparent' }} />
                      )}
                    </div>
                    <input type="number" placeholder="Precio" value={form.price} required min={0} step={0.01} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15 }} />
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <button type="submit" style={{ background: '#66c0f4', color: '#171a21', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Guardar</button>
                      <button type="button" style={{ background: '#c1272d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={() => setShowAddModal(false)}>Cancelar</button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{ background: "linear-gradient(90deg, #3a9aed 0%, #2179c7 100%)", color: "#fff", border: "none", borderRadius: 2, padding: "8px 20px", fontSize: 13, cursor: "pointer", marginRight: 8 }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate("/register")}
                style={{ background: "#5c7e10", color: "#fff", border: "none", borderRadius: 2, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
