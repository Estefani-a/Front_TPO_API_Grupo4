import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GameDetail.css";

export default function GameDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const game = state?.game || null;

  useEffect(() => {
    const body = document.body;
    const prevStyle = body.getAttribute("style") || "";
    body.setAttribute("style", "background: transparent !important; animation: none !important;");
    return () => {
      body.setAttribute("style", prevStyle);
    };
  }, []);

  const imgs = useMemo(() => {
    if (!game) return [];
    if (Array.isArray(game.images) && game.images.length) return game.images;
    return game.image ? [game.image] : [];
  }, [game]);

  const [activeTab, setActiveTab] = useState("desc");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      setCart(raw ? JSON.parse(raw) : []);
    } catch {
      setCart([]);
    }

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

  const addToCart = () => {
    if (!game) return;
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
      window.dispatchEvent(new CustomEvent("cart-updated"));
      alert(`Agregado al carrito: ${game.title}`);
    } catch (e) {
      console.error(e);
      alert("No se pudo agregar al carrito.");
    }
  };

  if (!game) {
    return (
      <div className="container no-game">
        <div className="form-card">
          <h2>No se encontró el juego</h2>
          <p>Entrá desde el Home para ver el detalle.</p>
          <button className="btn" onClick={() => navigate("/")}>
            Volver al Home
          </button>
        </div>
      </div>
    );
  }

  const price = Number(game.price || 0);

  return (
    <>
      <div className="gd-bg-animated" />
      <div className="container game-detail">
        <div className="form-card">
          {/* Título */}
          <div className="logo">
            <div className="logo-placeholder">{game.title}</div>
          </div>

          {/* Portada */}
          <div className="cover-image">
            {imgs[0] ? (
              <img src={imgs[0]} alt="cover" />
            ) : (
              <div className="no-image">Sin imagen</div>
            )}
          </div>

          {/* Precio + botones */}
          <section className="price-section">
            <div className="price-row">
              <span className="price">${price.toFixed(2)}</span>
            </div>

            <div className="button-row">
              <button
                className="btn"
                onClick={addToCart}
                disabled={cart.find((item) => item.id === game.id)}
              >
                {cart.find((item) => item.id === game.id) ? "Agregado" : "Agregar al carrito"}
              </button>
              <button
                className="btn"
                onClick={() => navigate("/", { state: { openCart: true } })}
              >
                Ir al carrito
              </button>
            </div>
          </section>

          {/* Tabs */}
          <div className="tab-bar">
            <button
              className={`gd-tab ${activeTab === "desc" ? "gd-tab--active" : ""}`}
              onClick={() => setActiveTab("desc")}
            >
              Descripción
            </button>
            <button
              className={`gd-tab ${activeTab === "reviews" ? "gd-tab--active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reseñas ({(game.reviews || []).length})
            </button>
          </div>

          {/* Contenido de tabs */}
          {activeTab === "desc" ? (
            <div className="game-description">
              {game.description || "Sin descripción disponible."}
              <div className="tags">
                {game.tags?.map((tag, idx) => (
                  <span key={idx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="game-reviews">
              {(game.reviews || []).length ? (
                game.reviews.map((review, idx) => (
                  <div key={idx} className="review">
                    <strong>{review.user || "Anónimo"}:</strong> {review.comment}
                  </div>
                ))
              ) : (
                <div className="no-reviews">No hay reseñas.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
