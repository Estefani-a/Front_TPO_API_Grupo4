// pages/Comunidad.jsx
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

/** ------------------------------
 * Helpers HTTP (API real si existe)
 * ------------------------------ */
async function http(method, path, body, requiresAuth = false) {
  const headers = { "Content-Type": "application/json" };
  
  if (requiresAuth) {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

/** ------------------------------
 * Transformar datos del backend al formato del frontend
 * ------------------------------ */
function transformBackendPost(post) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl || "",
    createdAt: post.createdAt,
    likesCount: post.likes || 0,
    likedByMe: false,
    author: { id: post.authorName, name: post.authorName, avatarUrl: null },
    comments: (post.comments || []).map(c => ({
      id: c.id,
      text: c.content,
      createdAt: c.createdAt,
      author: { id: c.userName, name: c.userName, avatarUrl: null }
    }))
  };
}

/** ------------------------------
 * Capa de servicios (usa API de la base de datos)
 * ------------------------------ */

async function listPosts() {
  try {
    console.log("🌐 Llamando a API:", `${API_BASE}/community/posts`);
    const data = await http("GET", "/community/posts");
    console.log("✅ Datos recibidos del backend:", data);
    
    if (Array.isArray(data)) {
      // Transformar datos del backend al formato esperado
      const transformed = data.map(transformBackendPost);
      console.log("🔄 Datos transformados:", transformed);
      return transformed;
    }
    return [];
  } catch (error) {
    console.error("❌ Error al llamar API:", error);
    throw error;
  }
}

async function createPost(payload) {
  try {
    // Obtener el usuario actual del localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const authorName = currentUser.name || 'Usuario';
    
    // Agregar el authorName al payload
    const postData = {
      title: payload.title || '',
      content: payload.content || '',
      imageUrl: payload.imageUrl || '',
      category: payload.category || 'General',
      authorName: authorName
    };
    
    console.log('📝 Creando post:', postData);
    const created = await http("POST", "/community/posts", postData, true);
    console.log('✅ Post creado:', created);
    return transformBackendPost(created);
  } catch (error) {
    console.error('❌ Error al crear post:', error);
    throw error;
  }
}

async function addComment(postId, text) {
  try {
    // Obtener el usuario actual del localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = currentUser.name || 'Usuario';
    
    // El backend retorna el comentario creado, no el post actualizado
    const comment = await http("POST", `/community/comments/post/${postId}`, { 
      content: text,
      userName: userName
    }, true);
    console.log('✅ Comentario creado:', comment);
    
    // Necesitamos refrescar el post completo para obtener la lista actualizada de comentarios
    const updatedPost = await http("GET", `/community/posts/${postId}`);
    return transformBackendPost(updatedPost);
  } catch (error) {
    console.error('❌ Error al crear comentario:', error);
    throw error;
  }
}

async function likePost(postId) {
  try {
    const updated = await http("POST", `/community/posts/${postId}/like`, null, true);
    return transformBackendPost(updated);
  } catch (error) {
    console.error('❌ Error al dar like:', error);
    throw error;
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
  const [notification, setNotification] = useState(null);

  // Verificar si el usuario es admin
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

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
    if (!title && !content) {
      showNotification('Debes escribir al menos un título o contenido', 'error');
      return;
    }
    try {
      setCreating(true);
      const created = await createPost({ title, content, imageUrl });
      if (created) {
        setPosts((p) => [created, ...p]);
        showNotification('Post creado correctamente', 'success');
        e.currentTarget.reset();
      }
    } catch (e) {
      console.error('Error al crear post:', e);
      showNotification(e.message || 'Error al crear el post', 'error');
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
    } catch (error) {
      console.error('Error al dar like:', error);
      // Revertir el cambio optimista si falla
      setPosts((prev) =>
        prev.map((x) =>
          x.id === p.id
            ? { ...x, likedByMe: p.likedByMe, likesCount: p.likesCount }
            : x
        )
      );
    }
  }

  async function handleComment(p, e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = String(fd.get("text") || "").trim();
    if (!text) return;
    try {
      const updated = await addComment(p.id, text);
      if (updated) {
        setPosts((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        showNotification('Comentario agregado', 'success');
        e.currentTarget.reset();
      }
    } catch (e) {
      console.error('Error al comentar:', e);
      showNotification(e.message || 'Error al comentar', 'error');
    }
  }

  async function handleDeletePost(postId, postTitle) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el post "${postTitle}"?\n\nEsto eliminará también todos sus comentarios.`)) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        showNotification('Debes iniciar sesión como admin', 'error');
        return;
      }

      console.log(`🗑️ Eliminando post ID: ${postId}`);

      const response = await fetch(`http://localhost:8080/community/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        console.log('✅ Post eliminado correctamente');
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        showNotification('Post eliminado correctamente', 'success');
      } else {
        console.error('❌ Error al eliminar:', response.status);
        showNotification('Error al eliminar el post', 'error');
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      showNotification('Error de conexión', 'error');
    }
  }

  async function handleDeleteComment(postId, commentId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        showNotification('Debes iniciar sesión como admin', 'error');
        return;
      }

      console.log(`🗑️ Eliminando comentario ID: ${commentId}`);

      const response = await fetch(`http://localhost:8080/community/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        console.log('✅ Comentario eliminado correctamente');
        // Actualizar el post eliminando el comentario de la lista
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, comments: post.comments.filter(c => c.id !== commentId) }
              : post
          )
        );
        showNotification('Comentario eliminado correctamente', 'success');
      } else {
        console.error('❌ Error al eliminar comentario:', response.status);
        showNotification('Error al eliminar el comentario', 'error');
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      showNotification('Error de conexión', 'error');
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
              <header style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#cfe5f6" }}>{p.title}</div>
                  <small style={{ color: "#9fb3c1" }}>
                    {p.author?.name || "Anónimo"} · {formatDate(p.createdAt)}
                  </small>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePost(p.id, p.title)}
                    style={styles.deleteBtn}
                    title="Eliminar post"
                  >
                    🗑️
                  </button>
                )}
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
                    <div key={c.id} style={{ ...styles.comment, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <small style={{ color: "#9fb3c1" }}>
                          {c.author?.name || "Alguien"} · {formatDate(c.createdAt)}
                        </small>
                        <div>{c.text}</div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteComment(p.id, c.id)}
                          style={styles.deleteCommentBtn}
                          title="Eliminar comentario"
                        >
                          ✕
                        </button>
                      )}
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
  deleteBtn: {
    background: "#c1272d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 16,
    transition: "opacity 0.2s",
  },
  deleteCommentBtn: {
    background: "transparent",
    color: "#c1272d",
    border: "none",
    borderRadius: 4,
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
    transition: "background 0.2s",
  },
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}
