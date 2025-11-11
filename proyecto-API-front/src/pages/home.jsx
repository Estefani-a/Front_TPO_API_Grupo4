import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./auth.css";
import NavBar from "../components/NavBar";
import SteamCarousel from "../components/SteamCarousel";

/* =========================
   Fallback games in case API fails
   ========================= */
const fallbackGames = [
  {
    id: 'fallback-1',
    title: "Counter-Strike 2",
    price: 0,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
    description: "El icónico juego de disparos táctico en su nueva versión.",
    rating: 4.8,
    images: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_d830cfd0f39b2bac5ad6c6a07e7c8c5b5e398eb3.1920x1080.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_d5e8ae65276d92cd1a4e28a9da2e97b0cf1a2808.1920x1080.jpg"
    ],
    tags: ["Shooter", "Multiplayer", "Competitivo"],
    genre: "Acción",
    reviews: [
      { id: "r1", user: "ProGamer", rating: 5, date: "2024-11-10", text: "El mejor shooter táctico de todos los tiempos. La nueva versión es increíble." },
      { id: "r2", user: "CS_Fan", rating: 4.5, date: "2024-11-08", text: "Excelente actualización, mejores gráficos y mismo gameplay adictivo." },
      { id: "r3", user: "TacticalShooter", rating: 5, date: "2024-11-05", text: "Perfecto para jugar competitivo. La comunidad es muy activa." }
    ]
  },
  {
    id: 'fallback-2',
    title: "Dota 2",
    price: 0,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
    description: "El MOBA más popular del mundo.",
    rating: 4.7,
    images: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/570/ss_d7c8d3d69a6c5d7f8c5c5f6f5f6f5f6f5f6f5f6f.1920x1080.jpg"
    ],
    tags: ["MOBA", "Estrategia", "Multijugador"],
    genre: "Estrategia",
    reviews: [
      { id: "r1", user: "MOBALover", rating: 5, date: "2024-11-09", text: "El mejor MOBA del mercado. Estrategia pura y competencia de alto nivel." },
      { id: "r2", user: "DotaPlayer", rating: 4.5, date: "2024-11-07", text: "Increíble profundidad estratégica. Cada partida es diferente." },
      { id: "r3", user: "StrategyKing", rating: 4.8, date: "2024-11-04", text: "Requiere mucha práctica pero vale totalmente la pena." }
    ]
  },
  {
    id: 'fallback-3',
    title: "Team Fortress 2",
    price: 0,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg",
    description: "Shooter multijugador por equipos con estilo único.",
    rating: 4.6,
    images: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/440/ss_a1c1d6e1c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5.1920x1080.jpg"
    ],
    tags: ["Shooter", "Multijugador", "Acción"],
    genre: "Acción",
    reviews: [
      { id: "r1", user: "TF2Veteran", rating: 5, date: "2024-11-06", text: "Un clásico que nunca envejece. Gameplay divertido y carismático." },
      { id: "r2", user: "CasualGamer", rating: 4.5, date: "2024-11-03", text: "Perfecto para jugar con amigos. Muy entretenido y gratuito." },
      { id: "r3", user: "HatCollector", rating: 4.8, date: "2024-11-01", text: "La variedad de clases hace que cada partida sea única y divertida." }
    ]
  }
];

export default function Home({ search = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
 
  // Estado para los juegos desde la API
  const [gamesList, setGamesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el hover del juego seleccionado
  const [hoveredGame, setHoveredGame] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Cargar juegos desde la API
  useEffect(() => {
    const fetchGames = async () => {
      console.log('🎮 Cargando juegos desde la API...');
      try {
        const response = await fetch('http://localhost:8080/api/games');
        console.log('📡 Respuesta recibida:', response.status);
        
        if (response.ok) {
          const games = await response.json();
          console.log('✅ Juegos cargados desde API:', games.length, 'juegos');
          
          // Transformar los datos de la API al formato que usa la aplicación
          const transformedGames = games.map(game => {
            // Transformar comentarios de la API al formato de reviews
            const reviews = game.comments?.map((comment, index) => ({
              id: `r${index}`,
              user: comment.user || "Usuario Anónimo",
              rating: comment.rating || 4,
              date: comment.date || new Date().toISOString().split('T')[0],
              text: comment.text || comment.comment || "Sin comentario"
            })) || [];
            
            // Calcular rating promedio basado en los comentarios
            const avgRating = reviews.length > 0 
              ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
              : 4.5; // Rating por defecto si no hay comentarios
            
            return {
              id: game.id,
              title: game.name,
              price: game.cost,
              image: game.images && game.images.length > 0 ? game.images[0] : 'https://via.placeholder.com/300x150',
              description: game.description || 'Sin descripción disponible',
              rating: Math.round(avgRating * 100) / 100, // Redondear a 2 decimales
              images: game.images || [],
              tags: game.types?.map(type => type.type) || ["Juego"],
              genre: game.types && game.types.length > 0 ? game.types[0].type : "General",
              reviews: reviews
            };
          });
          
          console.log('🎯 Juegos transformados:', transformedGames);
          setGamesList(transformedGames);
        } else {
          console.log('⚠️ API respondió con error:', response.status, '- Usando juegos de respaldo');
          setGamesList(fallbackGames);
        }
      } catch (error) {
        console.error('❌ Error cargando juegos:', error, '- Usando juegos de respaldo');
        setGamesList(fallbackGames);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Verificar si el usuario es admin
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';

  // Funciones para manejar el hover con delay
  const handleMouseEnter = (game) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredGame(game);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredGame(null);
    }, 150); // 150ms de delay antes de ocultar
    setHoverTimeout(timeout);
  };

  const handlePanelMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handlePanelMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredGame(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  // Obtener todos los juegos (ahora solo desde la API, no desde localStorage)
  const getAllGames = React.useCallback(() => {
    return gamesList;
  }, [gamesList]);

  // ===== búsqueda =====
  const [input, setInput] = useState("");
  const [foundGames, setFoundGames] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);  // Ahora es un array para múltiples categorías
  
  // Actualizar foundGames cuando gamesList cambie
  useEffect(() => {
    console.log('🔄 Actualizando foundGames con', gamesList.length, 'juegos');
    setFoundGames(getAllGames());
  }, [gamesList, getAllGames]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    const filtered = getAllGames().filter((g) =>
      g.title.toLowerCase().includes(value.toLowerCase()) &&
      (tagFilter.length > 0 ? tagFilter.every(tag => g.tags?.includes(tag)) : true)
    );
    setFoundGames(filtered);
  };

  const handleTagFilter = (tag) => {
    // Si ya está activa la misma categoría, la desactivamos
    if (tagFilter.includes(tag)) {
      const newTagFilter = tagFilter.filter(t => t !== tag);
      setTagFilter(newTagFilter);
      setInput("");
      const filtered = newTagFilter.length > 0 
        ? getAllGames().filter((g) => newTagFilter.every(t => g.tags?.includes(t)))
        : getAllGames();
      setFoundGames(filtered);
      return;
    }
    
    // Agregar nueva categoría
    const newTagFilter = [...tagFilter, tag];
    setTagFilter(newTagFilter);
    setInput("");
    const filtered = getAllGames().filter((g) => newTagFilter.every(t => g.tags?.includes(t)));
    setFoundGames(filtered);
  };

  // Función para remover una categoría específica
  const removeTagFilter = (tag) => {
    const newTagFilter = tagFilter.filter(t => t !== tag);
    setTagFilter(newTagFilter);
    setInput("");
    const filtered = newTagFilter.length > 0 
      ? getAllGames().filter((g) => newTagFilter.every(t => g.tags?.includes(t)))
      : getAllGames();
    setFoundGames(filtered);
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setTagFilter([]);
    setInput("");
    setFoundGames(getAllGames());
  };

  // Actualizar la lista de juegos cuando cambie getAllGames
  useEffect(() => {
    setFoundGames(getAllGames());
  }, [getAllGames]);

  // ===== carrito =====
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      setCart(raw ? JSON.parse(raw) : []);
    } catch {
      setCart([]);
    }
    // Actualizar lista de juegos si se agregan nuevos
    setFoundGames(getAllGames());
  }, []);
  useEffect(() => {
    const reloadCart = () => {
      try {
        const raw = localStorage.getItem("cart");
        setCart(raw ? JSON.parse(raw) : []);
      } catch {}
    };
    window.addEventListener("cart-updated", reloadCart);
    window.addEventListener("focus", reloadCart);
    return () => {
      window.removeEventListener("cart-updated", reloadCart);
      window.removeEventListener("focus", reloadCart);
    };
  }, []);

  useEffect(() => {
    if (location.state?.openCart) {
      setShowCart(true);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const addToCart = (game) => {
    try {
      const raw = localStorage.getItem("cart");
      const current = raw ? JSON.parse(raw) : [];
      const i = current.findIndex((x) => x.id === game.id);
      // Asegura que la imagen esté correctamente asignada
      const image = game.image || game.mainImage;
      if (i >= 0) {
        current[i] = { ...current[i], qty: (current[i].qty || 1) + 1 };
      } else {
        current.push({
          id: game.id,
          title: game.title,
          price: game.price,
          image,
          qty: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(current));
      setCart(current);
      window.dispatchEvent(new CustomEvent("cart-updated"));
      // toast
      setToast(`✅ ${game.title} agregado al carrito`);
      setTimeout(() => setToast(""), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Función para remover juegos de la base de datos
  const removeGame = async (gameId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este juego? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      // Obtener token de autenticación
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setToast('❌ Debes iniciar sesión como admin para eliminar juegos');
        setTimeout(() => setToast(""), 3000);
        return;
      }
      
      console.log(`🗑️ Eliminando juego ID: ${gameId}`);
      
      // Eliminar de la base de datos
      const response = await fetch(`http://localhost:8080/api/games/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        console.log('✅ Juego eliminado de la base de datos');
        
        // Actualizar la lista local eliminando el juego
        setGamesList(prevGames => prevGames.filter(game => game.id !== gameId));
        
        setToast(`🗑️ Juego eliminado correctamente`);
        setTimeout(() => setToast(""), 2500);
        
        // Recargar la página para actualizar todo
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errorText = await response.text();
        console.error('❌ Error al eliminar:', errorText);
        setToast(`❌ Error al eliminar el juego`);
        setTimeout(() => setToast(""), 3000);
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      setToast(`❌ Error de conexión`);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const removeFromCart = (id) => {
    try {
      const updated = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      setCart(updated);
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
        0
      ),
    [cart]
  );

  // Filtro por prop externa `search` aplicado sobre los juegos ya filtrados por categoría
  const filteredByProp = useMemo(
    () =>
      foundGames.filter((g) =>
        g.title.toLowerCase().includes((search || "").toLowerCase())
      ),
    [search, foundGames]
  );

  const finalList = (search?.length ? filteredByProp : foundGames) || [];

  return (
  <div className="home-root" style={{ marginTop: 60, background: "linear-gradient(135deg, #1b2838 0%, #171a21 100%)", minHeight: '100vh' }}>
      <style jsx>{`
        .game-list-panel::-webkit-scrollbar {
          width: 8px;
        }
        .game-list-panel::-webkit-scrollbar-track {
          background: #23262e;
        }
        .game-list-panel::-webkit-scrollbar-thumb {
          background: #4b4b4b;
          border-radius: 4px;
        }
        .game-list-panel::-webkit-scrollbar-thumb:hover {
          background: #66c0f4;
        }
      `}</style>
      {/* Toast (sin alert y sin "localhost dice") */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#1b2838",
            color: "#66c0f4",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}

      {/* NavBar tipo Steam */}
      <NavBar
        handleChange={handleChange}
        input={input}
        onCartClick={() => setShowCart(true)}
        cartCount={cart.length}
        onTagFilter={handleTagFilter}
      />

      {/* Carrusel (si lo usan) */}
      {typeof SteamCarousel === "function" && (
          <SteamCarousel addToCart={addToCart} cart={cart} navigate={navigate} />
      )}

     
      {/* Interfaz Steam con dos paneles */}
      <div style={{
        maxWidth: "1400px",
        margin: "32px auto",
        padding: "0 24px",
        display: "flex",
        gap: 0,
        minHeight: "600px"
      }}>
        {/* Panel izquierdo - Lista de juegos */}
        <div style={{
          flex: "1",
          background: '#23262e',
          borderRadius: "12px 0 0 12px",
          padding: 16,
          maxHeight: "700px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#4b4b4b #23262e"
        }}
        className="game-list-panel"
        >
          <h2 style={{ 
            color: '#66c0f4', 
            fontSize: 20, 
            fontWeight: 600, 
            marginBottom: 16,
            borderBottom: "1px solid #2a475e",
            paddingBottom: 8
          }}>
            Juegos Destacados
          </h2>
          
          {/* Indicador de filtros activos */}
          {tagFilter.length > 0 && (
            <div style={{
              marginBottom: 16,
              padding: '8px 12px',
              background: '#1e2328',
              borderRadius: 6,
              border: '1px solid #2a475e'
            }}>
              <div style={{ 
                color: '#66c0f4', 
                fontSize: 12, 
                fontWeight: 600,
                marginBottom: 6
              }}>
                Filtros activos (debe tener TODAS las categorías):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tagFilter.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#66c0f4',
                      color: '#1b2838',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    onClick={() => removeTagFilter(tag)}
                    title="Clic para remover este filtro"
                  >
                    {tag}
                    <span style={{ fontWeight: 'bold' }}>×</span>
                  </span>
                ))}
                <button
                  style={{
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={clearAllFilters}
                  title="Limpiar todos los filtros"
                >
                  Limpiar todo
                </button>
              </div>
            </div>
          )}
          
          {finalList.map((game, index) => (
            <div key={game.id}>
              <div
                onMouseEnter={() => handleMouseEnter(game)}
                onMouseLeave={handleMouseLeave}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 8,
                  background: hoveredGame?.id === game.id ? '#2a475e' : 'transparent',
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: hoveredGame?.id === game.id ? '1px solid #66c0f4' : '1px solid transparent'
                }}
                onClick={() => navigate(`/game/${game.id}`, { state: { game } })}
              >
              {/* Imagen del juego */}
              <img
                src={game.image}
                alt={game.title}
                style={{
                  width: 120,
                  height: 45,
                  objectFit: "cover",
                  borderRadius: 4,
                  marginRight: 12
                }}
              />
              
              {/* Info del juego */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: "#fff", 
                  fontSize: 16, 
                  fontWeight: 500,
                  marginBottom: 4
                }}>
                  {game.title}
                </div>
                
                {/* Precio */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ 
                    color: '#66c0f4', 
                    fontWeight: 600,
                    fontSize: 16
                  }}>
                    ${game.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botones agregar al carrito y remover */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(game);
                  }}
                  disabled={cart.find((item) => item.id === game.id)}
                  style={{
                    background: cart.find((item) => item.id === game.id)
                      ? '#4b6479'
                      : '#66c0f4',
                    color: cart.find((item) => item.id === game.id)
                      ? '#acb4bd'
                      : '#171a21',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: cart.find((item) => item.id === game.id) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cart.find((item) => item.id === game.id) ? '✓' : '+'}
                </button>
                
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGame(game.id);
                    }}
                    style={{
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title="Eliminar juego"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* Línea divisoria persistente entre juegos */}
            {index < finalList.length - 1 && (
              <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, #2a475e 50%, transparent 100%)',
                margin: '8px 0'
              }} />
            )}
          </div>
          ))}
        </div>

        {/* Panel derecho - Detalles del juego en hover */}
        <div 
          style={{
            flex: "1",
            background: '#171a21',
            borderRadius: "0 12px 12px 0",
            padding: 24,
            minHeight: 600,
            position: "sticky",
            top: 24,
            cursor: hoveredGame ? 'pointer' : 'default'
          }}
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
          onClick={() => hoveredGame && navigate(`/game/${hoveredGame.id}`, { state: { game: hoveredGame } })}
        >
          {hoveredGame ? (
            <div style={{ height: "100%" }}>
              {/* Título y rating */}
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ 
                  color: '#fff', 
                  fontSize: 28, 
                  fontWeight: 700,
                  marginBottom: 8
                }}>
                  {hoveredGame.title}
                </h1>
                
                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= Math.floor(hoveredGame.rating) ? '#ffd700' : '#4b4b4b',
                          fontSize: 18
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span style={{ color: '#c7d5e0', fontSize: 16 }}>
                    {hoveredGame.rating}/5
                  </span>
                </div>

                {/* Tags clickeables */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {hoveredGame.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTag(tag)}
                      style={{
                        background: selectedTag === tag ? '#66c0f4' : '#2a475e',
                        color: selectedTag === tag ? '#171a21' : '#c7d5e0',
                        border: 'none',
                        borderRadius: 20,
                        padding: '6px 12px',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de 4 screenshots */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: '#66c0f4', fontSize: 18, marginBottom: 12 }}>Screenshots</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 16
                }}>
                  {hoveredGame.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Screenshot ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 6,
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: '#66c0f4', fontSize: 18, marginBottom: 12 }}>Descripción</h3>
                <p style={{ 
                  color: '#c7d5e0', 
                  lineHeight: 1.6,
                  fontSize: 14
                }}>
                  {hoveredGame.description}
                </p>
              </div>

              {/* Precio y botón de compra */}
              <div style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                right: 24,
                background: '#171a21',
                padding: 16,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ 
                    color: '#66c0f4', 
                    fontSize: 24, 
                    fontWeight: 700 
                  }}>
                    ${hoveredGame.price.toFixed(2)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => addToCart(hoveredGame)}
                    disabled={cart.find((item) => item.id === hoveredGame.id)}
                    style={{
                      background: cart.find((item) => item.id === hoveredGame.id)
                        ? '#4b6479'
                        : 'linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)',
                      color: cart.find((item) => item.id === hoveredGame.id)
                        ? '#acb4bd'
                        : '#171a21',
                      border: 'none',
                      borderRadius: 6,
                      padding: '12px 24px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: cart.find((item) => item.id === hoveredGame.id) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: 150
                    }}
                  >
                    {cart.find((item) => item.id === hoveredGame.id) ? 'En el carrito' : 'Agregar al carrito'}
                  </button>
                  
                  {isAdmin && (
                    <button
                      onClick={() => removeGame(hoveredGame.id)}
                      style={{
                        background: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        padding: '12px 16px',
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      title="Eliminar juego"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#8f98a0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
              <h3 style={{ color: '#66c0f4', fontSize: 20, marginBottom: 8 }}>
                Explora nuestros juegos
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.5 }}>
                Pasa el cursor sobre cualquier juego de la lista para ver sus detalles, 
                screenshots y más información.
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="auth-footer auth-footer--panel">
        <div className="auth-footer__inner">
          <span className="auth-footer__text">© 2025 Grupo 4. Todos los derechos reservados.</span>
          <div className="auth-footer__social" aria-label="Redes sociales">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/Steam"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.19 8.44 9.93v-7.02H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.74 8.44-4.91 8.44-9.93z" fill="currentColor"/>
              </svg>
            </a>
            {/* X (Twitter) */}
            <a
              href="https://twitter.com/steam"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              title="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M18.244 2H21L14.327 9.62 22 22h-6.2l-4.853-7.53L5.4 22H2.64l7.2-8.3L2 2h6.31l4.38 6.77L18.244 2Zm-2.166 18.4h1.2L7.98 3.6H6.72l9.358 16.8Z" fill="currentColor"/>
              </svg>
            </a>
            {/* Bluesky */}
            <a
              href="https://bsky.app/profile/steampowered.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bluesky"
              title="Bluesky"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M12 10.6c-2.3-3.4-6.3-6.9-8.3-7.5C1.6 2.5 1 3.5 1 5c0 3.5 2.3 5.6 4.5 7-2.2.9-4.1 2.5-4.1 5 0 1.2.5 2 1.4 2.2 2 .4 6.4-3 9.2-6.7 2.8 3.7 7.2 7.1 9.2 6.7.9-.2 1.4-1 1.4-2.2 0-2.5-1.9-4.1-4.1-5 2.2-1.4 4.5-3.5 4.5-7 0-1.5-.6-2.5-2.7-1.9-2 .6-6 4-8.3 7.5Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
