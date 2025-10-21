// Importaciones necesarias de React y React Router
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Importación de estilos específicos para este componente
import "./GameDetail.css";

// Exportación por defecto del componente funcional GameDetail
export default function GameDetail() {
  // HOOKS DE REACT ROUTER
  // useLocation: obtiene la información de navegación, incluyendo el estado pasado
  const { state } = useLocation();
  // useNavigate: función para navegar programáticamente a otras rutas
  const navigate = useNavigate();
  // Extraer el juego del estado de navegación, o null si no existe
  const game = state?.game || null;

  // EFECTO PARA MODIFICAR ESTILOS DEL BODY
  useEffect(() => {
    // Obtener referencia al elemento body
    const body = document.body;
    // Guardar el estilo previo para restaurarlo después
    const prevStyle = body.getAttribute("style") || "";
    // Aplicar estilos específicos: fondo transparente y sin animaciones
    body.setAttribute("style", "background: transparent !important; animation: none !important;");
    
    // CLEANUP: restaurar estilos originales al desmontar componente
    return () => {
      body.setAttribute("style", prevStyle);
    };
  }, []); // Se ejecuta solo una vez al montar

  // MEMOIZACIÓN DE IMÁGENES
  // useMemo optimiza el cálculo de imágenes solo cuando 'game' cambia
  const imgs = useMemo(() => {
    // Si no hay juego, retornar array vacío
    if (!game) return [];
    
    // Array para almacenar todas las imágenes sin duplicados
    const allImages = [];
    
    // AGREGAR IMAGEN PRINCIPAL PRIMERO
    if (game.image) {
      allImages.push(game.image);
    }
    
    // AGREGAR IMÁGENES ADICIONALES SI EXISTEN Y NO ESTÁN DUPLICADAS
    if (Array.isArray(game.images) && game.images.length) {
      game.images.forEach(img => {
        // Solo agregar si la imagen existe y no está ya en el array
        if (img && !allImages.includes(img)) {
          allImages.push(img);
        }
      });
    }
    
    // Retornar array de imágenes o array vacío
    return allImages.length > 0 ? allImages : [];
  }, [game]); // Dependencia: recalcular solo cuando game cambie

  // ESTADOS DEL COMPONENTE
  const [activeTab, setActiveTab] = useState("desc"); // Tab activa: "desc" o "reviews"
  const [cart, setCart] = useState([]); // Estado del carrito de compras
  const [activeImageIndex, setActiveImageIndex] = useState(0); // Índice de imagen activa en carrusel
  const [comments, setComments] = useState([]); // Comentarios desde la API
  const [stats, setStats] = useState({ totalComments: 0, averageRating: 0 }); // Estadísticas
  const [showCommentForm, setShowCommentForm] = useState(false); // Mostrar formulario
  const [newComment, setNewComment] = useState({ userName: '', content: '', rating: 5 }); // Nuevo comentario

  // FUNCIONES PARA EL CARRUSEL DE IMÁGENES
  
  // Navegar a la siguiente imagen (circular)
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % imgs.length);
  };

  // Navegar a la imagen anterior (circular)
  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

  // Ir directamente a una imagen específica
  const goToImage = (index) => {
    setActiveImageIndex(index);
  };

  // CARGAR COMENTARIOS DESDE LA API
  useEffect(() => {
    if (!game?.id) return;

    // Obtener comentarios del juego
    fetch(`http://localhost:8080/comments/game/${game.id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error('Error al cargar comentarios:', err));

    // Obtener estadísticas
    fetch(`http://localhost:8080/comments/game/${game.id}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error al cargar estadísticas:', err));
  }, [game?.id]);

  // FUNCIÓN PARA ENVIAR COMENTARIO
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.userName || !newComment.content) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/comments/game/${game.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });

      if (response.ok) {
        const created = await response.json();
        setComments([...comments, created]);
        setNewComment({ userName: '', content: '', rating: 5 });
        setShowCommentForm(false);
        
        // Recargar estadísticas
        const statsRes = await fetch(`http://localhost:8080/comments/game/${game.id}/stats`);
        const newStats = await statsRes.json();
        setStats(newStats);
        
        alert('¡Comentario agregado exitosamente!');
      } else {
        alert('Error al agregar comentario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  // EFECTO PARA GESTIONAR EL CARRITO
  useEffect(() => {
    // INICIALIZAR CARRITO DESDE LOCALSTORAGE
    try {
      const raw = localStorage.getItem("cart");
      setCart(raw ? JSON.parse(raw) : []);
    } catch {
      // Si hay error al parsear, usar array vacío
      setCart([]);
    }

    // FUNCIÓN PARA RECARGAR EL CARRITO
    const reloadCart = () => {
      try {
        const raw = localStorage.getItem("cart");
        setCart(raw ? JSON.parse(raw) : []);
      } catch {}
    };

    // EVENTOS PARA SINCRONIZAR EL CARRITO
    // Escuchar evento personalizado cuando se actualiza el carrito
    window.addEventListener("cart-updated", reloadCart);
    // Escuchar cuando la ventana obtiene foco (sincronizar con otras pestañas)
    window.addEventListener("focus", reloadCart);
    
    // CLEANUP: remover event listeners
    return () => {
      window.removeEventListener("cart-updated", reloadCart);
      window.removeEventListener("focus", reloadCart);
    };
  }, []); // Se ejecuta solo una vez al montar

  // COMPONENTE PARA MOSTRAR ESTRELLAS DE CALIFICACIÓN EN RESEÑAS
  const ReviewStars = ({ rating }) => {
    return (
      <div className="review-stars">
        {/* Generar 5 estrellas */}
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            // Clase condicional: llena si el número de estrella <= rating
            className={`review-star ${star <= rating ? 'review-star-filled' : 'review-star-empty'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // FUNCIÓN PARA AGREGAR JUEGO AL CARRITO
  const addToCart = () => {
    if (!game) return; // No hacer nada si no hay juego
    
    try {
      // OBTENER CARRITO ACTUAL DEL LOCALSTORAGE
      const raw = localStorage.getItem("cart");
      const current = raw ? JSON.parse(raw) : [];
      
      // BUSCAR SI EL JUEGO YA ESTÁ EN EL CARRITO
      const i = current.findIndex((x) => x.id === game.id);
      
      if (i >= 0) {
        // SI YA EXISTE: incrementar cantidad
        current[i] = { ...current[i], qty: (current[i].qty || 1) + 1 };
      } else {
        // SI NO EXISTE: agregar nuevo item con cantidad 1
        current.push({
          id: game.id,
          title: game.title,
          price: game.price,
          image: game.image,
          qty: 1,
        });
      }
      
      // GUARDAR CARRITO ACTUALIZADO
      localStorage.setItem("cart", JSON.stringify(current));
      // DISPARAR EVENTO PERSONALIZADO PARA NOTIFICAR CAMBIOS
      window.dispatchEvent(new CustomEvent("cart-updated"));
      // MOSTRAR CONFIRMACIÓN AL USUARIO
      alert(`Agregado al carrito: ${game.title}`);
    } catch (e) {
      // MANEJAR ERRORES
      console.error(e);
      alert("No se pudo agregar al carrito.");
    }
  };

  // COMPONENTE PARA MOSTRAR CALIFICACIÓN GENERAL DEL JUEGO
  const OverallRating = ({ rating = 4.5 }) => {
    // Calcular estrellas completas
    const fullStars = Math.floor(rating);
    return (
      <div className="overall-rating">
        <div className="star-rating">
          {/* Generar 5 estrellas para calificación general */}
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= fullStars ? 'star-filled' : 'star-empty'}`}
            >
              ★
            </span>
          ))}
          {/* Mostrar calificación numérica */}
          <span className="rating-text">({rating}/5)</span>
        </div>
        <p className="rating-subtitle">Calificación general</p>
      </div>
    );
  };

  // RENDERIZADO CONDICIONAL: SI NO HAY JUEGO
  if (!game) {
    return (
      <div className="container no-game">
        <div className="form-card">
          <h2>No se encontró el juego</h2>
          <p>Entrá desde el Home para ver el detalle.</p>
          {/* Botón para volver al home */}
          <button className="btn" onClick={() => navigate("/")}>
            Volver al Home
          </button>
        </div>
      </div>
    );
  }

  // PROCESAR PRECIO DEL JUEGO
  const price = Number(game.price || 0);

  // RENDERIZADO PRINCIPAL DEL COMPONENTE
  return (
    <>
      {/* Fondo animado para la página */}
      <div className="gd-bg-animated" />
      
      <div className="container game-detail">
        <div className="form-card">
          
          {/* SECCIÓN DEL TÍTULO */}
          <div className="logo">
            <div className="logo-placeholder">{game.title}</div>
          </div>

          {/* SECCIÓN DEL CARRUSEL DE IMÁGENES */}
          <div className="image-carousel">
            <div className="main-image-container">
              {imgs.length > 0 ? (
                <>
                  {/* IMAGEN PRINCIPAL */}
                  <img 
                    src={imgs[activeImageIndex]} 
                    alt={`${game.title} - Imagen ${activeImageIndex + 1}`}
                    className="main-image"
                  />
                  
                  {/* BOTONES DE NAVEGACIÓN (solo si hay múltiples imágenes) */}
                  {imgs.length > 1 && (
                    <>
                      <button 
                        className="carousel-btn carousel-btn-prev" 
                        onClick={prevImage}
                        aria-label="Imagen anterior"
                      >
                        ‹
                      </button>
                      <button 
                        className="carousel-btn carousel-btn-next" 
                        onClick={nextImage}
                        aria-label="Imagen siguiente"
                      >
                        ›
                      </button>
                    </>
                  )}
                </>
              ) : (
                // Placeholder si no hay imágenes
                <div className="no-image">Sin imagen</div>
              )}
            </div>
            
            {/* THUMBNAILS (miniaturas) */}
            {imgs.length > 1 && (
              <div className="thumbnails-container">
                {imgs.map((img, index) => (
                  <button
                    key={index}
                    // Clase condicional para thumbnail activa
                    className={`thumbnail ${index === activeImageIndex ? 'thumbnail-active' : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
            
            {/* INDICADOR DE POSICIÓN */}
            {imgs.length > 1 && (
              <div className="carousel-indicator">
                {activeImageIndex + 1} / {imgs.length}
              </div>
            )}
          </div>

          {/* SECCIÓN DE CALIFICACIÓN GENERAL */}
          <div className="rating-section">
            <OverallRating rating={stats.averageRating || 0} />
            <p style={{ textAlign: 'center', color: '#8f98a0', fontSize: '14px', marginTop: '8px' }}>
              {stats.totalComments} {stats.totalComments === 1 ? 'comentario' : 'comentarios'}
            </p>
          </div>

          {/* SECCIÓN DE PRECIO Y BOTONES */}
          <section className="price-section">
            <div className="price-row">
              <span className="price">${price.toFixed(2)}</span>
            </div>

            <div className="button-row">
              {/* BOTÓN AGREGAR AL CARRITO */}
              <button
                className="btn"
                onClick={addToCart}
                // Deshabilitar si el juego ya está en el carrito
                disabled={cart.find((item) => item.id === game.id)}
              >
                {/* Texto condicional basado en si ya está en carrito */}
                {cart.find((item) => item.id === game.id) ? "Agregado" : "Agregar al carrito"}
              </button>
              
              {/* BOTÓN IR AL CARRITO */}
              <button
                className="btn"
                // Navegar al home con estado para abrir carrito
                onClick={() => navigate("/", { state: { openCart: true } })}
              >
                Ir al carrito
              </button>
            </div>
          </section>

          {/* SISTEMA DE TABS */}
          <div className="tab-bar">
            {/* TAB DESCRIPCIÓN */}
            <button
              className={`gd-tab ${activeTab === "desc" ? "gd-tab--active" : ""}`}
              onClick={() => setActiveTab("desc")}
            >
              Descripción
            </button>
            
            {/* TAB RESEÑAS */}
            <button
              className={`gd-tab ${activeTab === "reviews" ? "gd-tab--active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reseñas ({comments.length})
            </button>
          </div>

          {/* CONTENIDO DE TABS */}
          {activeTab === "desc" ? (
            // CONTENIDO DE DESCRIPCIÓN
            <div className="game-description">
              {game.description || "Sin descripción disponible."}
              
              {/* TAGS DEL JUEGO */}
              <div className="tags">
                {game.tags?.map((tag, idx) => (
                  <span key={idx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            // CONTENIDO DE RESEÑAS
            <div className="game-reviews">
              {/* Botón para agregar comentario */}
              {!showCommentForm && (
                <button 
                  onClick={() => setShowCommentForm(true)}
                  style={{
                    background: 'linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)',
                    color: '#171a21',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginBottom: '20px',
                    width: '100%'
                  }}
                >
                  ✏️ Escribir un comentario
                </button>
              )}

              {/* Formulario para nuevo comentario */}
              {showCommentForm && (
                <form onSubmit={handleSubmitComment} style={{
                  background: '#2a475e',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ color: '#66c0f4', marginBottom: '15px' }}>Nuevo Comentario</h3>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', color: '#c7d5e0', marginBottom: '5px' }}>
                      Tu nombre
                    </label>
                    <input
                      type="text"
                      value={newComment.userName}
                      onChange={(e) => setNewComment({...newComment, userName: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#171a21',
                        border: '1px solid #3a4d5c',
                        borderRadius: '4px',
                        color: '#fff'
                      }}
                      placeholder="Ingresa tu nombre"
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', color: '#c7d5e0', marginBottom: '5px' }}>
                      Calificación
                    </label>
                    <select
                      value={newComment.rating}
                      onChange={(e) => setNewComment({...newComment, rating: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#171a21',
                        border: '1px solid #3a4d5c',
                        borderRadius: '4px',
                        color: '#fff'
                      }}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 estrellas)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 estrellas)</option>
                      <option value={3}>⭐⭐⭐ (3 estrellas)</option>
                      <option value={2}>⭐⭐ (2 estrellas)</option>
                      <option value={1}>⭐ (1 estrella)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', color: '#c7d5e0', marginBottom: '5px' }}>
                      Tu comentario
                    </label>
                    <textarea
                      value={newComment.content}
                      onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                      required
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#171a21',
                        border: '1px solid #3a4d5c',
                        borderRadius: '4px',
                        color: '#fff',
                        resize: 'vertical'
                      }}
                      placeholder="Escribe tu opinión sobre el juego..."
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="submit"
                      style={{
                        flex: 1,
                        background: '#66c0f4',
                        color: '#171a21',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '10px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Enviar Comentario
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowCommentForm(false);
                        setNewComment({ userName: '', content: '', rating: 5 });
                      }}
                      style={{
                        flex: 1,
                        background: '#c1272d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '10px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de comentarios */}
              {comments.length === 0 ? (
                <p style={{ color: '#8f98a0', textAlign: 'center', padding: '20px' }}>
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </p>
              ) : (
                comments.map((review) => (
                  <div key={review.id} className="review">
                    {/* HEADER DE LA RESEÑA */}
                    <div className="review-header">
                      <strong className="review-user">{review.userName}</strong>
                      {/* Componente de estrellas para esta reseña */}
                      <ReviewStars rating={review.rating} />
                    </div>
                    {/* COMENTARIO DE LA RESEÑA */}
                    <p className="review-comment">{review.content}</p>
                    <p style={{ fontSize: '12px', color: '#8f98a0', marginTop: '8px' }}>
                      {new Date(review.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}