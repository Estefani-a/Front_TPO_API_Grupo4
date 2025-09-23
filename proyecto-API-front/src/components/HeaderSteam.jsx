import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/auth.css";

const steamLogo = "https://store.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";

export default function HeaderSteam({ cart = [], showCart, setShowCart, removeFromCart, total }) {
  // Estados del header y utilidades
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
    price: '',
    screenshot1: '',
    screenshot2: '',
    screenshot3: '',
    screenshot4: ''
  });
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  // Popups de autenticación
  // - showLogin y showRegister controlan la visibilidad de los modales de Login y Registro
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);

  // Handlers de formularios del popup
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase();
    const password = e.target.password.value;
    if (email === 'admin@admin' && password === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      setShowLogin(false);
      // Refrescar para que el header tome el estado admin inmediatamente
      window.location.reload();
      return;
    }
    alert('Credenciales incorrectas');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías guardar en API/LocalStorage; por ahora, feedback y cambio a login
    alert('Cuenta creada. Ahora puedes iniciar sesión.');
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    // Header fijo tipo Steam (color y borde iguales al footer)
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
          {/* Botón del carrito */}
          <button
            className="cart-btn"
            style={{ 
              marginRight: 18,
              background: "none",
              border: "none",
              color: "#c7d5e0",
              fontSize: 24,
              cursor: "pointer",
              position: "relative",
              padding: "8px",
            }}
            onClick={() => setShowCart(true)}
          >
            🛒
            {cart.length > 0 && (
              <span style={{
                position: "absolute",
                top: -2,
                right: -2,
                background: "#c1272d",
                color: "#fff",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>
                {cart.length}
              </span>
            )}
          </button>

          {/* Popup del carrito (reutiliza overlay/panel del cart) */}

          {showCart && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.45)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }} onClick={() => setShowCart(false)}>
              <div style={{
                background: "#23262e",
                borderRadius: 12,
                padding: "32px",
                minWidth: 420,
                maxWidth: 500,
                boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                color: "#fff"
              }} onClick={e => e.stopPropagation()}>
                <h2 style={{ color: "#66c0f4", marginBottom: 24, margin: "0 0 24px 0" }}>Tu carrito</h2>
                
                <div>
                  {cart.length === 0 ? (
                    <div style={{ color: "#fff", marginBottom: 24 }}>Tu carrito está vacío.</div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} style={{
                          display: "flex",
                          alignItems: "center",
                          background: "#171a21",
                          borderRadius: 8,
                          marginBottom: 12,
                          padding: 8,
                        }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: 60,
                              height: 28,
                              objectFit: "cover",
                              borderRadius: 4,
                              marginRight: 12,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#fff" }}>{item.title}</div>
                            <div style={{ color: "#66c0f4" }}>
                              ${Number(item.price).toFixed(2)} {item.qty ? `x${item.qty}` : ""}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              background: "#c1272d",
                              color: "#fff",
                              border: "none",
                              borderRadius: 4,
                              padding: "4px 10px",
                              marginRight: "12px", // separa el botón del borde derecho del contenedor
                              cursor: "pointer",
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                      <div style={{
                        marginTop: 16,
                        textAlign: "right",
                        color: "#fff",
                        fontWeight: "bold",
                      }}>
                        Total: ${total.toFixed(2)}
                      </div>
                    </>
                  )}
                  
                  {/* Botones Cerrar y Comprar - siempre visibles */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, gap: 12 }}>
                    <button
                      onClick={() => setShowCart(false)}
                      style={{
                        background: "#2a475e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "10px 28px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        minWidth: 120,
                        fontSize: 15,
                      }}
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        if (cart.length > 0) {
                          setShowCart(false);
                          navigate('/checkout', { state: { cart, total } });
                        }
                      }}
                      disabled={cart.length === 0}
                      style={{
                        background: cart.length > 0 ? "#66c0f4" : "#4b6479",
                        color: cart.length > 0 ? "#171a21" : "#acb4bd",
                        border: "none",
                        borderRadius: 4,
                        padding: "10px 28px",
                        fontWeight: "bold",
                        fontSize: 15,
                        cursor: cart.length > 0 ? "pointer" : "not-allowed",
                        minWidth: 120,
                        boxShadow: "0 2px 8px #0004",
                        transition: "background 0.18s",
                      }}
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Botón Agregar juego (admin) - entre carrito y usuario */}
          {isAdmin && (
            <button
              style={{ 
                background: '#66c0f4', 
                color: '#171a21', 
                border: 'none', 
                borderRadius: 6, 
                padding: '8px 18px', 
                fontWeight: 600, 
                fontSize: 15, 
                cursor: 'pointer', 
                height: 40,
                marginRight: 18
              }}
              onClick={() => setShowAddModal(true)}
            >
              Agregar juego
            </button>
          )}
          
          {/* Botones admin/login/register */}
          {isAdmin ? (
            <div
              style={{ display: 'flex', alignItems: 'center', height: '60px', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <span title="Admin">
                <svg width="28" height="28" fill="white" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                </svg>
              </span>
              {showUserDropdown && (
                <div
                  className="user-dropdown"
                  style={{ 
                    position: 'absolute', 
                    top: 'calc(100% - 2px)', 
                    right: 0, 
                    background: '#23262e', 
                    color: '#fff', 
                    borderRadius: 8, 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)', 
                    border: '1px solid #3d414a',
                    padding: '12px 0', 
                    minWidth: 140, 
                    zIndex: 100, 
                    fontSize: 15
                  }}
                >
                  <div
                    style={{ 
                      padding: '12px 20px', 
                      cursor: 'pointer', 
                      transition: 'background 0.2s',
                      ':hover': { background: '#2a475e' }
                    }}
                    onClick={() => { localStorage.removeItem('isAdmin'); window.location.reload(); }}
                    onMouseEnter={(e) => e.target.style.background = '#2a475e'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    Cerrar sesión
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                style={{ background: "linear-gradient(90deg, #3a9aed 0%, #2179c7 100%)", color: "#fff", border: "none", borderRadius: 2, padding: "8px 20px", fontSize: 13, cursor: "pointer", marginRight: 8 }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setShowRegister(true)}
                style={{ background: "#5c7e10", color: "#fff", border: "none", borderRadius: 2, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>

      {/* LOGIN POPUP
          Estructura general del modal:
          - Overlay: cart-popup-overlay (fondo translúcido; click cierra el modal)
          - Panel: cart-popup + auth-popup-panel (reutiliza layout del cart y aplica gradiente del auth)
          - stopPropagation en el panel evita que un click adentro cierre el modal
      */}
      {showLogin && (
        <div className="cart-popup-overlay" onClick={() => setShowLogin(false)}>
          <div
            className="cart-popup auth-popup-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', borderRadius: 12, padding: '28px 28px 22px 28px', width: '100%', maxWidth: 520, boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
          >
            {/* Botón de cierre "×" */}
            <button onClick={() => setShowLogin(false)} aria-label="Cerrar" style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', color: '#c7d5e0', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <img src="/Steam_icon_logo.png" alt="Steam Logo" style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.3))' }} />
            </div>
            <h2 style={{ color: '#66c0f4', margin: '0 0 12px 0', textAlign: 'center' }}>Iniciar Sesión</h2>
            <form onSubmit={handleLoginSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Campos de Login */}
              <div className="auth-form-group">
                <label htmlFor="email" style={{ color: 'rgba(255,255,255,0.9)' }}>Email</label>
                <input id="email" name="email" type="email" placeholder="correo@ejemplo.com" required />
              </div>
              <div className="auth-form-group">
                <label htmlFor="password" style={{ color: 'rgba(255,255,255,0.9)' }}>Contraseña</label>
                <input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="auth-btn">Ingresar</button>
            </form>
            <p className="auth-switch-text" style={{ textAlign: 'center' }}>
              ¿No tienes cuenta?{' '}
              <span className="auth-link" style={{ cursor: 'pointer' }} onClick={() => { setShowLogin(false); setShowRegister(true); }}>Regístrate</span>
            </p>
          </div>
        </div>
      )}

      {/* REGISTER POPUP
          Similar al Login. Se limita el alto con maxHeight y se habilita scroll interno (overflowY: 'auto')
      */}
      {showRegister && (
        <div className="cart-popup-overlay" onClick={() => setShowRegister(false)}>
          <div
            className="cart-popup auth-popup-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', borderRadius: 12, padding: '22px 22px 18px 22px', width: '100%', maxWidth: 520, maxHeight: '82vh', overflowY: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
          >
            {/* Botón de cierre "×" */}
            <button onClick={() => setShowRegister(false)} aria-label="Cerrar" style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', color: '#c7d5e0', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <img src="/Steam_icon_logo.png" alt="Steam Logo" style={{ width: 60, height: 60, objectFit: 'contain', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.3))' }} />
            </div>
            <h2 style={{ color: '#66c0f4', margin: '0 0 10px 0', textAlign: 'center' }}>Registrarse</h2>
            <form onSubmit={handleRegisterSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Campos de Registro */}
              <div className="auth-form-group">
                <label htmlFor="name" style={{ color: 'rgba(255,255,255,0.9)' }}>Nombre</label>
                <input id="name" name="name" type="text" placeholder="Tu nombre" required />
              </div>
              <div className="auth-form-group">
                <label htmlFor="reg-email" style={{ color: 'rgba(255,255,255,0.9)' }}>Email</label>
                <input id="reg-email" name="email" type="email" placeholder="correo@ejemplo.com" required />
              </div>
              <div className="auth-form-group">
                <label htmlFor="reg-password" style={{ color: 'rgba(255,255,255,0.9)' }}>Contraseña</label>
                <input id="reg-password" name="password" type="password" placeholder="********" required />
              </div>
              <div className="auth-form-group">
                <label htmlFor="confirmPassword" style={{ color: 'rgba(255,255,255,0.9)' }}>Confirmar Contraseña</label>
                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" required />
              </div>
              <button type="submit" className="auth-btn">Crear cuenta</button>
            </form>
            <p className="auth-switch-text" style={{ textAlign: 'center' }}>
              ¿Ya tienes cuenta?{' '}
              <span className="auth-link" style={{ cursor: 'pointer' }} onClick={() => { setShowRegister(false); setShowLogin(true); }}>Inicia sesión</span>
            </p>
          </div>
        </div>
      )}
      
      {/* Modal para agregar juego */}
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
              images: [
                form.screenshot1 || form.image,
                form.screenshot2 || form.image,
                form.screenshot3 || form.image,
                form.screenshot4 || form.image
              ].filter(Boolean),
              rating: 4.0,
              reviews: [],
            };
            const raw = localStorage.getItem('customGames');
            const customGames = raw ? JSON.parse(raw) : [];
            customGames.push(newGame);
            localStorage.setItem('customGames', JSON.stringify(customGames));
            window.dispatchEvent(new CustomEvent('customGames-updated'));
            setShowAddModal(false);
            setForm({ title: '', image: '', description: '', tags: '', price: '', screenshot1: '', screenshot2: '', screenshot3: '', screenshot4: '' });
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
            
            {/* Campos para screenshots */}
            <div style={{ marginTop: 12 }}>
              <h4 style={{ color: '#66c0f4', fontSize: 14, margin: '0 0 8px 0' }}>Screenshots (4 imágenes)</h4>
              <input type="text" placeholder="Screenshot 1 - URL de la imagen" value={form.screenshot1} onChange={e => setForm(f => ({ ...f, screenshot1: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15, marginBottom: 6 }} />
              <input type="text" placeholder="Screenshot 2 - URL de la imagen" value={form.screenshot2} onChange={e => setForm(f => ({ ...f, screenshot2: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15, marginBottom: 6 }} />
              <input type="text" placeholder="Screenshot 3 - URL de la imagen" value={form.screenshot3} onChange={e => setForm(f => ({ ...f, screenshot3: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15, marginBottom: 6 }} />
              <input type="text" placeholder="Screenshot 4 - URL de la imagen" value={form.screenshot4} onChange={e => setForm(f => ({ ...f, screenshot4: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: 'none', fontSize: 15 }} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" style={{ background: '#66c0f4', color: '#171a21', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Guardar</button>
              <button type="button" style={{ background: '#c1272d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={() => setShowAddModal(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
