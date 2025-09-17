import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./auth.css";
import NavBar from "../components/NavBar";
import SteamCarousel from "../components/SteamCarousel";

/* =========================
   DB local
   ========================= */
const gamesList = [
  {
    id: 1,
    title: "Counter-Strike 2",
    price: 499.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
  description: "Shooter competitivo 5v5 con enfoque en precisión y trabajo en equipo. Counter-Strike 2 es la evolución del clásico FPS, con físicas mejoradas, nuevos mapas y una comunidad activa. Domina el arte de la puntería y la estrategia en partidas intensas y torneos mundiales.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"],
    tags: ["Shooter", "Multiplayer", "Táctico"],
    reviews: [
      { id: "r1", user: "Santi", rating: 4.8, date: "2025-08-01", text: "Muy sólido en ranked." },
      { id: "r2", user: "Vale",  rating: 4.6, date: "2025-08-06", text: "Requiere práctica pero vale la pena." },
    ],
  },
  {
    id: 2,
    title: "Grand Theft Auto V",
    price: 899.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
  description: "Mundo abierto con historia cinematográfica y online inmenso. Grand Theft Auto V te lleva a Los Santos, una ciudad vibrante llena de posibilidades, misiones, y caos. Vive la historia de tres protagonistas y explora el modo online con amigos en actividades ilimitadas.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg"],
    tags: ["Acción", "Mundo Abierto", "Crimen"],
    reviews: [{ id: "r3", user: "Nico", rating: 5, date: "2025-07-20", text: "La historia es 10/10." }],
  },
  {
    id: 3,
    title: "Red Dead Redemption 2",
    price: 1199.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
  description: "Aventura épica en el Lejano Oeste con un mundo vivo y detallado. Red Dead Redemption 2 te sumerge en la vida de Arthur Morgan, enfrentando decisiones morales, paisajes impresionantes y una narrativa profunda. Caza, explora y sobrevive en el salvaje oeste.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg"],
    tags: ["Aventura", "Mundo Abierto", "Western"],
    reviews: [],
  },
  {
    id: 4,
    title: "Cyberpunk 2077",
    price: 999.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
  description: "RPG futurista en Night City con decisiones que importan. Cyberpunk 2077 ofrece una ciudad vibrante, personajes complejos y una historia ramificada. Personaliza tu personaje, hackea sistemas y descubre secretos en un mundo de alta tecnología y peligro.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg"],
    tags: ["RPG", "Futurista", "Acción"],
    reviews: [],
  },
  {
    id: 5,
    title: "HELLDIVERS™ 2",
    price: 1299.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg",
  description: "Acción cooperativa frenética con fuego amigo siempre activo. HELLDIVERS™ 2 te desafía a trabajar en equipo para salvar la galaxia, enfrentando hordas alienígenas y peligros constantes. Coordina estrategias y sobrevive en misiones intensas.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg"],
    tags: ["Cooperativo", "Acción", "Shooter"],
    reviews: [],
  },
  {
    id: 6,
    title: "Palworld",
    price: 799.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
  description: "Captura, cría y combate con criaturas en mundo abierto. Palworld combina exploración, supervivencia y gestión de criaturas únicas llamadas Pals. Construye, lucha y descubre secretos en un universo lleno de aventuras y desafíos.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg"],
    tags: ["Criaturas", "Supervivencia", "Multijugador"],
    reviews: [],
  },
];

export default function Home({ search = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';

  // Obtener juegos agregados por el admin
  const getCustomGames = () => {
    try {
      const raw = localStorage.getItem('customGames');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Unir lista original y custom
  const [removedIds, setRemovedIds] = useState([]);
  const getAllGames = React.useCallback(() => {
    // Filtra los juegos hardcodeados borrados temporalmente
    const filteredHardcoded = gamesList.filter(g => !removedIds.includes(g.id));
    return [...filteredHardcoded, ...getCustomGames().filter(g => !removedIds.includes(g.id))];
  }, [removedIds]);

  // ===== búsqueda =====
  const [input, setInput] = useState("");
  const [foundGames, setFoundGames] = useState(getAllGames());
  const [tagFilter, setTagFilter] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    const filtered = getAllGames().filter((g) =>
      g.title.toLowerCase().includes(value.toLowerCase()) &&
      (tagFilter ? g.tags?.includes(tagFilter) : true)
    );
    setFoundGames(filtered);
  };

  const handleTagFilter = (tag) => {
    setTagFilter(tag);
    setInput("");
    const filtered = getAllGames().filter((g) => g.tags?.includes(tag));
    setFoundGames(filtered);
  };

  // Actualizar la lista de juegos cuando removedIds cambie
  useEffect(() => {
    setFoundGames(getAllGames());
  }, [removedIds, getAllGames]);

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
    const reloadGames = () => {
      setFoundGames(getAllGames());
    };
    window.addEventListener("cart-updated", reloadCart);
    window.addEventListener("focus", reloadCart);
    window.addEventListener("customGames-updated", reloadGames);
    return () => {
      window.removeEventListener("cart-updated", reloadCart);
      window.removeEventListener("focus", reloadCart);
      window.removeEventListener("customGames-updated", reloadGames);
    };
  }, []);

  useEffect(() => {
    if (location.state?.openCart) {
      setShowCart(true);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

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

  // Filtro por prop externa `search`
  const filteredByProp = useMemo(
    () =>
      gamesList.filter((g) =>
        g.title.toLowerCase().includes((search || "").toLowerCase())
      ),
    [search]
  );

  const finalList = (search?.length ? filteredByProp : foundGames) || [];

  return (
    <div className="home-root" style={{ marginTop: 60, background: "transparent" }}>
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

      {/* Popup Carrito */}
      {showCart && (
        <div className="cart-popup-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "#66c0f4", marginBottom: 24 }}>Tu carrito</h2>
            {cart.length === 0 ? (
              <div style={{ color: "#fff" }}>Tu carrito está vacío.</div>
            ) : (
              <div>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#23262e",
                      borderRadius: 8,
                      marginBottom: 12,
                      padding: 8,
                    }}
                  >
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
                        ${Number(item.price).toFixed(2)}{" "}
                        {item.qty ? `x${item.qty}` : ""}
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
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: 16,
                    textAlign: "right",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Total: ${total.toFixed(2)}
                </div>
                {/* Si usan checkout: */}
                {/* <button
                  onClick={() => navigate('/checkout', { state: { cart, total } })}
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "12px",
                    background: "#66c0f4",
                    color: "#171a21",
                    border: "none",
                    borderRadius: 4,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Comprar
                </button> */}
              </div>
            )}
            <button
              onClick={() => setShowCart(false)}
              style={{
                marginTop: 18,
                background: "#2a475e",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 20px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Lista de juegos */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "32px auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="featured-games-container" style={{ width: "100%" }}>
          <h2 className="featured-title">Juegos destacados</h2>
          {tagFilter && (
            <div style={{ marginBottom: 16 }}>
              <span style={{ background: '#2a475e', color: '#c7d5e0', borderRadius: 12, padding: '4px 14px', fontSize: 14, fontWeight: 500 }}>
                Filtrando por: {tagFilter}
              </span>
              <button onClick={() => { setTagFilter(""); setFoundGames(gamesList); }} style={{ marginLeft: 12, background: '#c1272d', color: '#fff', border: 'none', borderRadius: 8, padding: '2px 10px', cursor: 'pointer', fontSize: 13 }}>
                Quitar filtro
              </button>
            </div>
          )}

          {finalList.map((game) => (
            <div key={game.id} className="game-item">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  justifyContent: "center",
                  cursor: "default",
                }}
              >
                {/* Click en imagen/título -> detalle con state */}
                <img
                  src={game.image}
                  alt={game.title}
                  onClick={() => navigate(`/game/${game.id}`, { state: { game } })}
                  title="Ver detalle"
                  style={{
                    width: 184,
                    height: 69,
                    objectFit: "cover",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                />
                <div
                  onClick={() => navigate(`/game/${game.id}`, { state: { game } })}
                  title="Ver detalle"
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 500 }}>
                    {game.title}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    {game.tags?.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={{ background: '#2a475e', color: '#c7d5e0', borderRadius: 12, padding: '2px 10px', fontSize: 13 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ color: "#66c0f4", fontSize: 16, fontWeight: 500 }}>
                    ${game.price.toFixed(2)}
                  </div>
                </div>

                {/* Botón dinámico según si está en el carrito */}
                <button
                  onClick={() => addToCart(game)}
                  disabled={cart.find((item) => item.id === game.id)}
                  style={{
                    background: cart.find((item) => item.id === game.id)
                      ? '#4b6479'
                      : 'linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)',
                    color: cart.find((item) => item.id === game.id)
                      ? '#acb4bd'
                      : '#171a21',
                    border: 'none',
                    borderRadius: 4,
                    padding: '10px 20px',
                    cursor: cart.find((item) => item.id === game.id) ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    minWidth: 110,
                  }}
                >
                  {cart.find((item) => item.id === game.id) ? 'Agregado' : 'Agregar al carrito'}
                </button>
                {/* Botón borrar solo para admin */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      // Si es custom, borrar de localStorage
                      const customGames = getCustomGames();
                      if (customGames.find(g => g.id === game.id)) {
                        const updated = customGames.filter(g => g.id !== game.id);
                        localStorage.setItem('customGames', JSON.stringify(updated));
                        window.dispatchEvent(new CustomEvent('customGames-updated'));
                      } else {
                        // Si es hardcodeado, solo ocultar en la sesión
                        setRemovedIds(ids => [...ids, game.id]);
                      }
                    }}
                    style={{
                      background: '#c1272d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      marginLeft: 8,
                    }}
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer" style={{ background: "transparent" }}>
        © 2025 Grupo 4. Todos los derechos reservados.
      </footer>
    </div>
  );
}
