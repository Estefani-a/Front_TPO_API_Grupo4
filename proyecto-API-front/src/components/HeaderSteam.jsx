import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/auth.css";
import "./NavBar.css";

const steamLogo = "https://store.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";

export default function HeaderSteam({ cart = [], showCart, setShowCart, removeFromCart, total }) {
  // Estados del header y utilidades
  const [showTagDropdown, setShowTagDropdown] = React.useState(false);
  const [notification, setNotification] = React.useState(null);
  
  // Función para mostrar notificaciones
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };
  // Obtener tags desde la API
  const [availableTags, setAvailableTags] = React.useState([]);
  
  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/gametypes');
        if (response.ok) {
          const types = await response.json();
          const tags = types.map(t => t.type);
          setAvailableTags(tags);
        }
      } catch (error) {
        console.error('Error cargando tags:', error);
      }
    };
    fetchTags();
  }, []);
  
  const getAllTags = () => {
    return availableTags;
  };
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
  
  // Obtener información del usuario actual
  const getCurrentUser = () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      return currentUser ? JSON.parse(currentUser) : null;
    } catch {
      return null;
    }
  };
  
  const currentUser = getCurrentUser();
  const isLoggedIn = currentUser !== null;
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

  // Handlers de formularios del popup - Ahora usan la API
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase().trim();
    const password = e.target.password.value;
    
    // Validar campos vacíos
    if (!email || !password) {
      showNotification("Por favor completa todos los campos", "error");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar token y datos del usuario
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify({
          name: data.name,
          email: data.email,
          isAdmin: data.role === 'ADMIN'
        }));
        
        // Guardar flag de admin si corresponde
        if (data.role === 'ADMIN') {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }
        
        showNotification(`¡Bienvenido ${data.name}!${data.role === 'ADMIN' ? ' (Admin)' : ''}`, 'success');
        setShowLogin(false);
        setTimeout(() => window.location.reload(), 1000);
      } else if (response.status === 401) {
        showNotification('Email o contraseña incorrectos', 'error');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification(errorData.message || 'Error al iniciar sesión', 'error');
      }
    } catch (error) {
      console.error('Error de red:', error);
      showNotification('Error de conexión. Por favor verifica que el servidor esté activo.', 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.toLowerCase().trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      showNotification("Por favor completa todos los campos", "error");
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error");
      return;
    }
    
    if (password.length < 6) {
      showNotification("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        showNotification(`¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.`, 'success');
        setTimeout(() => {
          setShowRegister(false);
          setShowLogin(true);
        }, 1500);
      } else if (response.status === 409) {
        showNotification('Este email ya está registrado. Por favor usa otro email.', 'error');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification(errorData.message || 'Error al registrar usuario', 'error');
      }
    } catch (error) {
      console.error('Error de red:', error);
      showNotification('Error de conexión. Por favor verifica que el servidor esté activo.', 'error');
    }
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
              className={`header-link${location.pathname === '/' ? ' header-link-active' : ''}`}
              onClick={e => { e.preventDefault(); navigate("/"); }}
            >
              TIENDA
            </a>
            <a
              href="#"
              className={`header-link${location.pathname === '/comunidad' ? ' header-link-active' : ''}`}
              onClick={e => { e.preventDefault(); navigate("/comunidad"); }}
            >
              COMUNIDAD
            </a>
            <a
              href="#"
              className={`header-link${location.pathname === '/acerca-de' ? ' header-link-active' : ''}`}
              onClick={e => { e.preventDefault(); navigate("/acerca-de"); }}
            >
              ACERCA DE
            </a>
            <a
              href="#"
              className={`header-link${location.pathname === '/soporte' ? ' header-link-active' : ''}`}
              onClick={e => { e.preventDefault(); navigate("/soporte"); }}
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
          {isLoggedIn ? (
            <div
              style={{ display: 'flex', alignItems: 'center', height: '60px', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span title={currentUser.name}>
                  <svg width="28" height="28" fill="white" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                  </svg>
                </span>
                <span style={{ color: '#66c0f4', fontSize: 14, fontWeight: 500 }}>
                  {currentUser.name}
                  {currentUser.isAdmin && (
                    <span style={{ color: '#90ba3c', marginLeft: 4, fontSize: 12 }}>(Admin)</span>
                  )}
                </span>
              </div>
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
                    minWidth: 180, 
                    zIndex: 100, 
                    fontSize: 15
                  }}
                >
                  <div style={{ padding: '8px 20px', borderBottom: '1px solid #3d414a', color: '#c7d5e0', fontSize: 13 }}>
                    {currentUser.email}
                  </div>
                  <div
                    style={{ 
                      padding: '12px 20px', 
                      cursor: 'pointer', 
                      transition: 'background 0.2s',
                      ':hover': { background: '#2a475e' }
                    }}
                    onClick={() => { 
                      localStorage.removeItem('isAdmin'); 
                      localStorage.removeItem('currentUser'); 
                      window.location.reload(); 
                    }}
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
                <input id="reg-password" name="password" type="password" placeholder="********" required minLength="6" />
              </div>
              <div className="auth-form-group">
                <label htmlFor="confirmPassword" style={{ color: 'rgba(255,255,255,0.9)' }}>Confirmar Contraseña</label>
                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" required minLength="6" />
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
          <form onClick={e => e.stopPropagation()} style={{ background: '#23262e', borderRadius: 12, padding: '32px 32px 24px 32px', minWidth: 340, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={async e => {
            e.preventDefault();
            
            // Validar campos requeridos
            if (!form.title || !form.image || !form.description || !form.price || !form.tags) {
              showNotification('Por favor completa todos los campos requeridos', 'error');
              return;
            }
            
            try {
              // Formatear tags
              const tagsFormatted = form.tags.split(',').map(t => {
                const tag = t.trim();
                return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
              }).filter(Boolean);
              
              console.log('📋 Tags a procesar:', tagsFormatted);
              
              // 1. Obtener todos los tipos existentes de la base de datos
              const typesResponse = await fetch('http://localhost:8080/api/gametypes');
              if (!typesResponse.ok) {
                throw new Error('Error al obtener tipos de juegos');
              }
              const existingTypes = await typesResponse.json();
              console.log('📊 Tipos existentes en BD:', existingTypes);
              
              // 2. Crear o encontrar los tipos para este juego
              const types = [];
              for (const tagName of tagsFormatted) {
                // Normalizar y buscar si el tipo ya existe
                const normalizedTag = tagName.trim();
                let existingType = existingTypes.find(t => {
                  const normalizedExisting = t.type.trim();
                  return normalizedExisting.toLowerCase() === normalizedTag.toLowerCase();
                });
                
                if (existingType) {
                  // Si existe, usar su ID
                  console.log(`✓ Tipo "${normalizedTag}" ya existe con ID: ${existingType.id}`);
                  types.push({
                    id: existingType.id,
                    type: existingType.type
                  });
                } else {
                  // Si no existe, crearlo
                  console.log(`➕ Creando nuevo tipo: "${normalizedTag}"`);
                  const createTypeResponse = await fetch('http://localhost:8080/api/gametypes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: normalizedTag })
                  });
                  
                  if (createTypeResponse.ok) {
                    const newType = await createTypeResponse.json();
                    console.log(`✅ Tipo creado: ${newType.type} (ID: ${newType.id})`);
                    // Agregar el nuevo tipo a la lista para futuras referencias
                    existingTypes.push(newType);
                    types.push({
                      id: newType.id,
                      type: newType.type
                    });
                  } else {
                    const errorText = await createTypeResponse.text();
                    console.error(`❌ Error al crear tipo "${normalizedTag}":`, errorText);
                    throw new Error(`Error al crear tipo: ${normalizedTag}`);
                  }
                }
              }
              
              console.log('✅ Tipos finales a usar:', types);
              
              // Preparar imágenes (screenshots)
              const images = [
                form.image,
                form.screenshot1,
                form.screenshot2,
                form.screenshot3,
                form.screenshot4
              ].filter(Boolean);
              
              // Preparar datos para el backend según GameDTO
              const gameData = {
                name: form.title,
                cost: parseFloat(form.price),
                description: form.description,
                images: images,
                types: types,
                comments: []
              };
              
              console.log('📤 Enviando juego al backend:', gameData);
              
              // Enviar al backend
              const response = await fetch('http://localhost:8080/api/games', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData)
              });
              
              if (response.ok) {
                const savedGame = await response.json();
                console.log('✅ Juego guardado en la base de datos:', savedGame);
                
                showNotification(`Juego "${savedGame.name}" agregado correctamente`, 'success');
                
                // Limpiar formulario y cerrar modal
                setShowAddModal(false);
                setForm({ title: '', image: '', description: '', tags: '', price: '', screenshot1: '', screenshot2: '', screenshot3: '', screenshot4: '' });
                
                // Recargar página para mostrar el nuevo juego
                setTimeout(() => window.location.reload(), 1500);
              } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Error al guardar juego:', errorData);
                showNotification(errorData.message || 'Error al agregar el juego', 'error');
              }
            } catch (error) {
              console.error('❌ Error:', error);
              showNotification(error.message || 'Error de conexión. Verifica que el servidor esté activo.', 'error');
            }
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
      
      {/* Notificación Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 24,
          background: notification.type === 'success' ? '#5c7e10' : notification.type === 'error' ? '#c1272d' : '#2a475e',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: 8,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          zIndex: 9999,
          minWidth: 300,
          maxWidth: 400,
          animation: 'slideIn 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 15,
          fontWeight: 500
        }}>
          <span style={{ fontSize: 20 }}>
            {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span style={{ flex: 1 }}>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
              padding: 4,
              opacity: 0.7,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
}
