// pages/Comunidad.jsx
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

/** ------------------------------
 * Helpers HTTP (API real si existe)
 * ------------------------------ */
async function http(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

/** ------------------------------
 * Fallback en localStorage
 * ------------------------------ */
const LS_KEY = "community_posts_v1";

const SEED_POSTS = [
  {
    id: "p1",
    title: "¿Recomiendan Hollow Knight en 2025?",
    content:
      "Estoy entre HK y Blasphemous 2. Busco algo desafiante pero que no se vuelva frustrante. ¿Qué dicen?",
    imageUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8f.jpg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likesCount: 7,
    likedByMe: false,
    author: { id: "u1", name: "Nico", avatarUrl: null },
    comments: [
      {
        id: "c1",
        text:
          "HK es una joya. Si te gustan los metroidvania con exploración libre, ni lo dudes. Consejo: andá por Mantis Lords temprano 😉",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        author: { id: "u2", name: "Paz", avatarUrl: null },
      },
      {
        id: "c2",
        text:
          "Si querés más combate y estética barroca, Blasphe 2. Si querés mapear y perderte, HK.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3.2).toISOString(),
        author: { id: "u3", name: "Lucho", avatarUrl: null },
      },
    ],
  },
  {
    id: "p2",
    title: "Recomendación coop local en PC",
    content:
      "¿Alguno probó It Takes Two o A Way Out? Busco algo para jugar a pantalla partida con mi novia.",
    imageUrl: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    likesCount: 12,
    likedByMe: true,
    author: { id: "u4", name: "Meli", avatarUrl: null },
    comments: [
      {
        id: "c3",
        text:
          "It Takes Two va como trompada. Puzzles creativos y duración justa (10-12hs). Si les gusta cooperar de verdad, es top.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
        author: { id: "u5", name: "Tom", avatarUrl: null },
      },
      {
        id: "c4",
        text:
          "A Way Out es más cinemático. Para primera experiencia en coop sofá, yo arrancaría por It Takes Two.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        author: { id: "u6", name: "Clau", avatarUrl: null },
      },
    ],
  },
  {
    id: "p3",
    title: "Tips para optimizar FPS en PC gama media",
    content:
      "RX 7600 + R5 5600: ¿qué ajustes recomiendan para llegar a 120Hz en shooters? ¿FSR on u off?",
    imageUrl: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likesCount: 5,
    likedByMe: false,
    author: { id: "u7", name: "Cami", avatarUrl: null },
    comments: [
      {
        id: "c5",
        text:
          "Bajá sombras y oclusión ambiental. Texturas en Alto si tenés VRAM. FSR 2 on en Quality suele sumar FPS sin matar nitidez.",
        createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
        author: { id: "u8", name: "Rama", avatarUrl: null },
      },
    ],
  },
];

function lsGet() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function lsSet(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/** API local de fallback */
const localApi = {
  list: async () => {
    let data = lsGet();
    if (!data) {
      data = SEED_POSTS;
      lsSet(data);
    }
    await delay(150); // mímica de red
    return structuredClone(data);
  },
  create: async (post) => {
    const data = lsGet() || [];
    const newPost = {
      id: uid("p"),
      title: post.title || "",
      content: post.content || "",
      imageUrl: post.imageUrl || "",
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedByMe: false,
      author: { id: "me", name: "Vos", avatarUrl: null },
      comments: [],
    };
    data.unshift(newPost);
    lsSet(data);
    await delay(120);
    return structuredClone(newPost);
  },
  comment: async (postId, text) => {
    const data = lsGet() || [];
    const idx = data.findIndex((p) => p.id === postId);
    if (idx < 0) throw new Error("Post no encontrado");
    const c = {
      id: uid("c"),
      text: text || "",
      createdAt: new Date().toISOString(),
      author: { id: "me", name: "Vos", avatarUrl: null },
    };
    const updated = { ...data[idx], comments: [...data[idx].comments, c] };
    data[idx] = updated;
    lsSet(data);
    await delay(120);
    return structuredClone(updated);
  },
  like: async (postId) => {
    const data = lsGet() || [];
    const idx = data.findIndex((p) => p.id === postId);
    if (idx < 0) throw new Error("Post no encontrado");
    const p = data[idx];
    // toggle simple (sin usuarios)
    const liked = !p.likedByMe;
    const likesCount = (p.likesCount || 0) + (liked ? 1 : -1);
    const updated = { ...p, likedByMe: liked, likesCount: Math.max(likesCount, 0) };
    data[idx] = updated;
    lsSet(data);
    await delay(100);
    return structuredClone(updated);
  },
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** ------------------------------
 * Capa de servicios (elige API real o local)
 * ------------------------------ */
const useLocal = !API_BASE; // si no hay VITE_API_URL → usa local
async function listPosts() {
  if (useLocal) return localApi.list();
  try {
    const data = await http("GET", "/community/posts");
    if (Array.isArray(data) && data.length) return data;
    // si viene vacío del server, igual mostramos seed local
    return localApi.list();
  } catch {
    // si falla server, fallback local
    return localApi.list();
  }
}
async function createPost(payload) {
  if (useLocal) return localApi.create(payload);
  try {
    const created = await http("POST", "/community/posts", payload);
    return created ?? localApi.create(payload);
  } catch {
    return localApi.create(payload);
  }
}
async function addComment(postId, text) {
  if (useLocal) return localApi.comment(postId, text);
  try {
    const updated = await http("POST", `/community/posts/${postId}/comments`, { text });
    return updated ?? localApi.comment(postId, text);
  } catch {
    return localApi.comment(postId, text);
  }
}
async function likePost(postId) {
  if (useLocal) return localApi.like(postId);
  try {
    const updated = await http("POST", `/community/posts/${postId}/like`);
    return updated ?? localApi.like(postId);
  } catch {
    return localApi.like(postId);
  }
}

/** ------------------------------
 * UI
 * ------------------------------ */
export default function Comunidad() {
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listPosts();
        setPosts(data);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const content = String(fd.get("content") || "").trim();
    const imageUrl = String(fd.get("imageUrl") || "").trim();
    if (!title && !content) return;
    try {
      setCreating(true);
      const created = await createPost({ title, content, imageUrl });
      if (created) setPosts((p) => [created, ...p]);
      e.currentTarget.reset();
    } catch (e) {
      alert(e.message || e);
    } finally {
      setCreating(false);
    }
  }

  async function handleLike(p) {
    try {
      // Optimista
      setPosts((prev) =>
        prev.map((x) =>
          x.id === p.id
            ? { ...x, likedByMe: !x.likedByMe, likesCount: (x.likesCount || 0) + (x.likedByMe ? -1 : 1) }
            : x
        )
      );
      const updated = await likePost(p.id);
      if (updated) setPosts((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch {}
  }

  async function handleComment(p, e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = String(fd.get("text") || "").trim();
    if (!text) return;
    try {
      const updated = await addComment(p.id, text);
      if (updated) setPosts((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      e.currentTarget.reset();
    } catch (e) {
      alert(e.message || e);
    }
  }

  return (
    <main style={{ width: "100%", maxWidth: 1200, margin: "100px auto 40px", padding: "0 16px" }}>
      <h1 style={{ color: "#66c0f4", margin: "0 0 16px", fontSize: 28, fontWeight: 700 }}>Comunidad</h1>

      {/* New post */}
      <form onSubmit={handleCreate} style={styles.card}>
        <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          <label style={{ fontSize: 13 }}>Título</label>
          <input name="title" placeholder="¿Sobre qué querés hablar?"
                 style={styles.input}/>
        </div>
        <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          <label style={{ fontSize: 13 }}>Contenido</label>
          <textarea name="content" placeholder="Contá algo a la comunidad…"
                    style={{ ...styles.input, minHeight: 100 }}/>
        </div>
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Imagen (URL opcional)</label>
          <input name="imageUrl" placeholder="https://..."
                 style={styles.input}/>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button disabled={creating} style={styles.primaryBtn}>
            {creating ? "Publicando…" : "Publicar"}
          </button>
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p style={{ color: "#c7d5e0" }}>Cargando publicaciones…</p>
      ) : error ? (
        <p style={{ color: "#c1272d" }}>Error: {error}</p>
      ) : posts.length === 0 ? (
        <p style={{ color: "#acb4bd" }}>Todavía no hay publicaciones.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((p) => (
            <article key={p.id} style={styles.card}>
              <header style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700, color: "#cfe5f6" }}>{p.title}</div>
                <small style={{ color: "#9fb3c1" }}>
                  {p.author?.name || "Anónimo"} · {formatDate(p.createdAt)}
                </small>
              </header>
              {p.content && <p style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{p.content}</p>}
              {p.imageUrl && (
                <div style={{ marginTop: 12, borderRadius: 8, overflow: "hidden" }}>
                  <img src={p.imageUrl} alt="" style={{ maxWidth: "100%", display: "block" }} />
                </div>
              )}
              <footer style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
                <button onClick={() => handleLike(p)} style={{
                  ...styles.likeBtn,
                  background: p.likedByMe ? "#66c0f4" : "#2a475e",
                  color: p.likedByMe ? "#171a21" : "#c7d5e0",
                }}>
                  ❤ {p.likesCount ?? 0}
                </button>
              </footer>

              <section style={{ marginTop: 12 }}>
                <h4 style={{ margin: "8px 0", color: "#cfe5f6" }}>Comentarios</h4>
                <div style={{ display: "grid", gap: 6 }}>
                  {(p.comments || []).map((c) => (
                    <div key={c.id} style={styles.comment}>
                      <small style={{ color: "#9fb3c1" }}>
                        {c.author?.name || "Alguien"} · {formatDate(c.createdAt)}
                      </small>
                      <div>{c.text}</div>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => handleComment(p, e)} style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input name="text" placeholder="Escribí un comentario…"
                         style={{ ...styles.input, flex: 1 }}/>
                  <button style={styles.whiteBtn}>Comentar</button>
                </form>
              </section>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

/** ------------------------------
 * estilos inline (compatibles con tu UI)
 * ------------------------------ */
const styles = {
  card: {
    background: "#23262e",
    padding: 16,
    borderRadius: 10,
    color: "#c7d5e0",
    boxShadow: "0 3px 16px rgba(0,0,0,0.16)",
  },
  input: {
    background: "#2a475e",
    border: "1px solid #3b5a74",
    color: "#c7d5e0",
    borderRadius: 6,
    padding: "8px 10px",
  },
  primaryBtn: {
    background: "linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)",
    color: "#171a21",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  whiteBtn: {
    background: "#ffffff",
    color: "#171a21",
    border: "none",
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  likeBtn: {
    border: "none",
    borderRadius: 6,
    padding: "6px 10px",
    cursor: "pointer",
  },
  comment: {
    background: "#2a475e",
    borderRadius: 6,
    padding: "6px 8px",
  },
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}
