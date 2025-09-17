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
    description: "Shooter competitivo 5v5 con enfoque en precisión y trabajo en equipo.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"],
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
    description: "Mundo abierto con historia cinematográfica y online inmenso.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg"],
    reviews: [{ id: "r3", user: "Nico", rating: 5, date: "2025-07-20", text: "La historia es 10/10." }],
  },
  {
    id: 3,
    title: "Red Dead Redemption 2",
    price: 1199.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
    description: "Aventura épica en el Lejano Oeste con un mundo vivo y detallado.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg"],
    reviews: [],
  },
  {
    id: 4,
    title: "Cyberpunk 2077",
    price: 999.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    description: "RPG futurista en Night City con decisiones que importan.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg"],
    reviews: [],
  },
  {
    id: 5,
    title: "HELLDIVERS™ 2",
    price: 1299.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg",
    description: "Acción cooperativa frenética con fuego amigo siempre activo.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg"],
    reviews: [],
  },
  {
    id: 6,
    title: "Palworld",
    price: 799.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
    description: "Captura, cría y combate con criaturas en mundo abierto.",
    images: ["https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg"],
    reviews: [],
  },
];

export default function Home({ search = "" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ===== búsqueda =====
  const [input, setInput] = useState("");
  const [foundGames, setFoundGames] = useState(gamesList);
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    const filtered = gamesList.filter((g) =>
      g.title.toLowerCase().includes(value.toLowerCase())
    );
    setFoundGames(filtered);
  };

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

  const addToCart = (game) => {
    try {
      const raw = localStorage.getItem("cart");
      const current = raw ? JSON.parse(raw) : [];
      const i = current.findIndex((x) => x.id === game.id);
      if (i >= 0) {
        current[i] = { ...current[i], qty: (current[i].qty || 1) + 1 };
      } else {
        current.push({
          id: game.id,
          title: game.title,
          price: game.price,
          image: game.image,
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
      />

      {/* Carrusel (si lo usan) */}
      {typeof SteamCarousel === "function" && (
        <SteamCarousel addToCart={addToCart} cart={cart} />
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
                  <div style={{ color: "#66c0f4", fontSize: 16, fontWeight: 500 }}>
                    ${game.price.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(game)}
                  style={{
                    background: "linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)",
                    color: "#171a21",
                    border: "none",
                    borderRadius: 4,
                    padding: "10px 20px",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    minWidth: 110,
                  }}
                >
                  Agregar
                </button>
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
