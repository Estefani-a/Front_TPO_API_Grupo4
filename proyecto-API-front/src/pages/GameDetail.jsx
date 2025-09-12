import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function GameDetail({ gameId: idProp, apiBase = "http://localhost:3000" }) {
  const { id: idFromParams } = useParams();
  const gameId = idProp || idFromParams;
  const { state } = useLocation();  // { game } desde Home (id, title, price, image)
  const navigate = useNavigate();

  const [game, setGame] = useState(state?.game || null);
  const [reviews, setReviews] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Traer datos completos + reseñas
  useEffect(() => {
    let abort = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const r = await fetch(`${apiBase}/games/${gameId}?_embed=reviews`);
        if (!r.ok) throw new Error("No se pudo cargar el juego");
        const data = await r.json();

        const merged = { ...(state?.game || {}), ...(data || {}) };
        let gameReviews = Array.isArray(data?.reviews) ? data.reviews : [];

        if (!gameReviews.length) {
          const rr = await fetch(`${apiBase}/reviews?gameId=${gameId}`);
          if (rr.ok) gameReviews = await rr.json();
        }

        if (!abort) {
          setGame(merged);
          setReviews(gameReviews);
        }
      } catch {
        if (!abort) {
          setError("No pudimos cargar info adicional. Mostramos lo disponible.");
          setGame((prev) => prev || state?.game || null);
          setReviews([]);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => { abort = true; };
  }, [apiBase, gameId, state?.game]);

  // imágenes: images -> cover -> image del Home
  const imgs =
    (Array.isArray(game?.images) && game.images.length && game.images) ||
    (game?.cover ? [game.cover] : null) ||
    (game?.image ? [game.image] : []);

  const price = Number(game?.price || 0);
  const discount = Number(game?.discountPercent || 0);
  const finalPrice = discount ? (price * (100 - discount)) / 100 : price;

  if (loading && !game) return <Centered>Cargando juego…</Centered>;
  if (!game) return <Centered>No se encontró el juego.</Centered>;

  return (
    <div className="container">
      <div className="form-card" style={{ width: 980, maxWidth: "95%", textAlign: "left" }}>
        {/* Título */}
        <div className="logo" style={{ marginBottom: 16 }}>
          <div className="logo-placeholder">{game.title}</div>
        </div>

        {/* Portada */}
        <div style={{ width: "100%", aspectRatio: "16/9", background: "rgba(0,0,0,.35)", borderRadius: 16, overflow: "hidden" }}>
          {imgs[activeImg]
            ? <img src={imgs[activeImg]} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ display: "grid", placeItems: "center", height: "100%", color: "rgba(255,255,255,.7)" }}>Sin imagen</div>}
        </div>

        {imgs.length > 1 && (
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {imgs.map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                style={{ minWidth: 96, height: 64, borderRadius: 12, overflow: "hidden",
                         border: i===activeImg ? "2px solid white" : "1px solid rgba(255,255,255,.25)",
                         background: "transparent", padding: 0, cursor: "pointer" }}>
                <img src={src} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}

        {/* Precio + carrito */}
        <section style={{ background: "rgba(255,255,255,.08)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,.18)", marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            {discount > 0 && <span style={{ color: "rgba(255,255,255,.6)", textDecoration: "line-through" }}>${price.toFixed(2)}</span>}
            <span style={{ fontSize: 24, fontWeight: 700, color: "white" }}>${finalPrice.toFixed(2)}</span>
            {discount > 0 && <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 8, background: "rgba(4,173,220,.25)", color: "#b3ecff", border: "1px solid rgba(255,255,255,.18)" }}>-{discount}%</span>}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              className="btn"
              onClick={() => {
                try {
                  const raw = localStorage.getItem("cart");
                  const current = raw ? JSON.parse(raw) : [];
                  const exists = current.find((i) => i.id === game.id);
                  if (!exists) {
                    current.push({
                      id: game.id,
                      title: game.title,
                      price: game.price,
                      image:
                        game.image ||
                        game.cover ||
                        (Array.isArray(game.images) && game.images[0]) ||
                        "",
                      qty: 1
                    });
                    localStorage.setItem("cart", JSON.stringify(current));
                  }
                  alert(`Agregado al carrito: ${game.title}`);
                } catch (e) {
                  console.error(e);
                  alert("No se pudo agregar al carrito.");
                }
              }}
            >
              Agregar al carrito
            </button>

            <button className="btn" onClick={() => navigate("/")}>Ir al carrito</button>
          </div>

          {error && <div style={{ marginTop: 10, color: "rgba(255,255,255,.8)" }}>{error}</div>}
        </section>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 12, borderTop: "1px solid rgba(255,255,255,.18)", paddingTop: 12, marginTop: 16 }}>
          <Tab label="Descripción" active={tab==="desc"} onClick={() => setTab("desc")} />
          <Tab label={`Reseñas (${(reviews||[]).length})`} active={tab==="rev"} onClick={() => setTab("rev")} />
        </div>

        {tab==="desc" && (
          <p style={{ color: "rgba(255,255,255,.92)", lineHeight: 1.6, marginTop: 10 }}>
            {game.description || "Sin descripción disponible."}
          </p>
        )}

        {tab==="rev" && (
          <div style={{ marginTop: 10 }}>
            {(reviews||[]).map((r) => (
              <article key={r.id || r.user + r.date}
                style={{ background: "rgba(255,255,255,.08)", borderRadius: 16, padding: 14, border: "1px solid rgba(255,255,255,.18)", color: "rgba(255,255,255,.92)", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600 }}>{r.user}</div>
                  <div style={{ color: "rgba(255,255,255,.75)", fontSize: 14 }}>{r.date}</div>
                </div>
                <div style={{ marginTop: 6, fontSize: 14 }}>Puntaje: ⭐ {Number(r.rating || 0).toFixed(1)}</div>
                <p style={{ marginTop: 8, lineHeight: 1.5 }}>{r.text}</p>
              </article>
            ))}
            {!(reviews||[]).length && <div style={{ color: "rgba(255,255,255,.8)" }}>Sé el primero en reseñar.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} className="link"
      style={{ border: 0, background: "transparent", padding: "6px 0",
               borderBottom: active ? "2px solid white" : "2px solid transparent" }}>
      {label}
    </button>
  );
}
function Centered({ children }) {
  return (
    <div className="container">
      <div className="form-card" style={{ textAlign: "center" }}>{children}</div>
    </div>
  );
}
