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

  // DATOS DE EJEMPLO PARA RESEÑAS
  // Array estático con reseñas simuladas con diferentes calificaciones
  const sampleReviews = [
    { user: "GamerPro2024", comment: "Me divertí jugándolo, muy bueno", rating: 5 },
    { user: "SteamUser", comment: "Excelente juego, lo recomiendo totalmente", rating: 5 },
    { user: "PlayerOne", comment: "Está bueno pero le falta contenido", rating: 4 },
    { user: "Juan123", comment: "Entretenido, aunque esperaba más", rating: 3},
    { user: "user_pro", comment: "No puedo parar de jugar", rating: 5 }
  ];

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
            <OverallRating rating={4.5} />
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
              Reseñas ({sampleReviews.length})
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
              {sampleReviews.map((review, idx) => (
                <div key={idx} className="review">
                  {/* HEADER DE LA RESEÑA */}
                  <div className="review-header">
                    <strong className="review-user">{review.user}</strong>
                    {/* Componente de estrellas para esta reseña */}
                    <ReviewStars rating={review.rating} />
                  </div>
                  {/* COMENTARIO DE LA RESEÑA */}
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}