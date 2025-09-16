import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import NavBar from "../components/NavBar";

const steamLogo = "https://store.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";
const promoImage = "src/assets/promoImage.png";

const gamesList = [
  {
    id: 1,
    title: "Counter-Strike 2",
    price: 499.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
  },
  {
    id: 2,
    title: "Grand Theft Auto V",
    price: 899.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
  },
  {
    id: 3,
    title: "Red Dead Redemption 2",
    price: 1199.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
  },
  {
    id: 4,
    title: "Cyberpunk 2077",
    price: 999.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
  },
  {
    id: 5,
    title: "HELLDIVERS™ 2",
    price: 1299.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg",
  },
  {
    id: 6,
    title: "Palworld",
    price: 799.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
  },
];

export default function Home({ search = "" }) {
  const [input, setInput] = useState("");
  const [foundGames, setFoundGames] = useState(gamesList);
  const handleChange = (e) => {
    setFoundGames(gamesList.filter(game =>
      game.title.toLowerCase().includes(e.target.value.toLowerCase())
    ));
    setInput(e.target.value);
    console.log("Juegos encontrados:", foundGames);
  };

  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const addToCart = (game) => {
    if (!cart.find((item) => item.id === game.id)) {
      setCart([...cart, game]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const filteredGames = gamesList.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="home-root">
      {/* Header */}
      <div style={{
        width: "100%",
        background: "#171a21",
        borderBottom: "1px solid #2d3544",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}>
            <img src={steamLogo} alt="Steam" style={{ height: 36 }} />
            <nav style={{
              display: "flex",
              gap: 24,
            }}>
              <a href="#" style={{
                color: "#c7d5e0",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
              }}>TIENDA</a>
              <a href="#" style={{
                color: "#c7d5e0",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
              }}>BIBLIOTECA</a>
            </nav>
          </div>

          <button
            onClick={() => navigate("/login")}
            style={{
              background: "linear-gradient(90deg, #3a9aed 0%, #2179c7 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              padding: "8px 20px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </div>

      {/* Banner */}
      <div style={{
        width: "100%",
        maxHeight: 320,
        overflow: "hidden",
        position: "relative",
      }}>
        <img
          src={promoImage}
          alt="World of Tanks"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      <NavBar handleChange={handleChange} input={input} />

      {/* Contenido principal */}
      <div style={{
        maxWidth: "1600px",
        margin: "32px auto",
        padding: "0 24px",
        display: "flex",
        gap: 32,
        flexWrap: "wrap",
      }}>
        {/* Carrito */}
        <div style={{ flex: "1 1 300px", minWidth: 300 }}>
          <div className="auth-container" style={{
            background: "rgba(23,26,33,0.98)",
            padding: "24px",
            borderRadius: "4px",
          }}>
            <h2 style={{ color: "#66c0f4", marginBottom: 24 }}>Tu carrito</h2>
            {cart.length === 0 ? (
              <div style={{ color: "#fff" }}>Tu carrito está vacío.</div>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#23262e",
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
                      <div style={{ color: "#66c0f4" }}>${item.price}</div>
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
                <div style={{
                  marginTop: 16,
                  textAlign: "right",
                  color: "#fff",
                  fontWeight: "bold",
                }}>
                  Total: ${total.toFixed(2)}
                </div>
                <button
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
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de juegos */}
        <div style={{ flex: "2 1 600px" }}>
          <div className="featured-games-container">
            <h2 className="featured-title">Juegos destacados</h2>
            {foundGames.map((game) => (
              <div key={game.id} className="game-item">
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16
                }}>
                  <img
                    src={game.image}
                    alt={game.title}
                    style={{
                      width: 184,
                      height: 69,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                  }}>
                    <div style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 500
                    }}>
                      {game.title}
                    </div>
                    <div style={{
                      color: "#66c0f4",
                      fontSize: 16,
                      fontWeight: 500
                    }}>
                      ${game.price.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(game)}
                    disabled={cart.find((item) => item.id === game.id)}
                    style={{
                      background: cart.find((item) => item.id === game.id)
                        ? "#4b6479"
                        : "linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)",
                      color: cart.find((item) => item.id === game.id)
                        ? "#acb4bd"
                        : "#171a21",
                      border: "none",
                      borderRadius: 4,
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      minWidth: 100,
                    }}
                  >
                    {cart.find((item) => item.id === game.id) ? "Agregado" : "Agregar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="footer">
        © 2025 Grupo 4. Todos los derechos reservados.
      </footer>
    </div>
  );
}