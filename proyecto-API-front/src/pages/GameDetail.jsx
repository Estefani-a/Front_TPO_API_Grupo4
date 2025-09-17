import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export default function GameDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

 
  const game = state?.game || null;

  useEffect(() => {
    const body = document.body;
    const prevStyle = body.getAttribute("style") || "";
    body.setAttribute(
      "style",
      `
        background: transparent !important;
        animation: none !important;
      `.trim()
    );
    return () => {
      body.setAttribute("style", prevStyle);
    };
  }, []);


  const imgs = useMemo(() => {
    if (!game) return [];
    if (Array.isArray(game.images) && game.images.length) return game.images;
    return game.image ? [game.image] : [];
  }, [game]);

  // Tabs
  const [activeTab, setActiveTab] = useState("desc"); 

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
      <div className="container" style={{ paddingTop: 80 }}>
        <div className="form-card" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#fff" }}>No se encontró el juego</h2>
          <p style={{ color: "rgba(255,255,255,.85)" }}>
            Entrá desde el Home para ver el detalle.
          </p>
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
      {/* Fondo animado SOLO para GameDetail */}
      <style>{`
        @keyframes gdGradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gd-bg-animated {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: linear-gradient(-45deg, #04addc, #89dcf0, #2a454a, #0a5891, #142a3a);
          background-size: 400% 400%;
          animation: gdGradientMove 15s ease infinite;
        }
        .gd-tab {
          border: 0;
          background: transparent;
          padding: 6px 0;
          color: rgba(255,255,255,.9);
          font-weight: 600;
          cursor: pointer;
        }
        .gd-tab--active {
          border-bottom: 2px solid #fff;
          color: #fff;
        }
      `}</style>
      <div className="gd-bg-animated" />

      <div className="container" style={{ paddingTop: 80, background: "transparent" }}>
        <div
          className="form-card"
          style={{
            width: 980,
            maxWidth: "95%",
            textAlign: "left",
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 25,
          }}
        >
          {/* Título */}
          <div className="logo" style={{ marginBottom: 16 }}>
            <div className="logo-placeholder">{game.title}</div>
          </div>

          {/* Portada */}
          <div
            style={{
              width: "100%",
              aspectRatio: "16/9",
              background: "rgba(0,0,0,.35)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {imgs[0] ? (
              <img
                src={imgs[0]}
                alt="cover"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: "100%",
                  color: "rgba(255,255,255,.7)",
                }}
              >
                Sin imagen
              </div>
            )}
          </div>

          {/* Precio + botones */}
          <section
            style={{
              background: "rgba(255,255,255,.08)",
              borderRadius: 16,
              padding: 16,
              border: "1px solid rgba(255,255,255,.18)",
              marginTop: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "white" }}>
                ${price.toFixed(2)}
              </span>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button className="btn" onClick={addToCart}>
                Agregar al carrito
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
          <div
            style={{
              display: "flex",
              gap: 16,
              borderTop: "1px solid rgba(255,255,255,.18)",
              paddingTop: 12,
              marginTop: 16,
            }}
          >
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
            <p
              style={{
                color: "rgba(255,255,255,.92)",
                lineHeight: 1.6,
                marginTop: 10,
              }}
            >
              {game.description || "Sin descripción disponible."}
            </p>
          ) : (
            <div style={{ marginTop: 10 }}>
              {(game.reviews || []).length === 0 && (
                <div style={{ color: "rgba(255,255,255,.8)" }}>
                  Sé el primero en reseñar.
                </div>
              )}
              {(game.reviews || []).map((r) => (
                <article
                  key={r.id}
                  style={{
                    background: "rgba(255,255,255,.08)",
                    borderRadius: 16,
                    padding: 14,
                    border: "1px solid rgba(255,255,255,.18)",
                    color: "rgba(255,255,255,.92)",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 600 }}>{r.user}</div>
                    <div style={{ color: "rgba(255,255,255,.75)", fontSize: 14 }}>
                      {r.date}
                    </div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14 }}>
                    Puntaje: ⭐ {Number(r.rating || 0).toFixed(1)}
                  </div>
                  <p style={{ marginTop: 8, lineHeight: 1.5 }}>{r.text}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
