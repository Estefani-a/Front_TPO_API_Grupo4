import React, { useState, useEffect } from 'react';
// Flecha SVG personalizada
const ArrowIcon = ({ direction = 'right' }) => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={direction === 'right' ? 'M12 8L26 19L12 30' : 'M26 8L12 19L26 30'} stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Juegos por defecto en caso de que la API falle
const defaultGames = [
  {
    id: 1,
    title: "Counter-Strike 2",
    price: 499.99,
    tags: ["Shooter", "Multiplayer", "Táctico"],
    mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
    color: "linear-gradient(90deg, #ff9800 60%, #f44336 100%)",
    description: "Shooter competitivo 5v5 con enfoque en precisión y trabajo en equipo. Counter-Strike 2 es la evolución del clásico FPS, con físicas mejoradas, nuevos mapas y una comunidad activa. Domina el arte de la puntería y la estrategia en partidas intensas y torneos mundiales."
  },
  {
    id: 2,
    title: "Grand Theft Auto V",
    price: 899.99,
    tags: ["Acción", "Mundo Abierto", "Crimen"],
    mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
    color: "linear-gradient(90deg, #00bcd4 60%, #9c27b0 100%)",
    description: "Mundo abierto con historia cinematográfica y online inmenso. Grand Theft Auto V te lleva a Los Santos, una ciudad vibrante llena de posibilidades, misiones, y caos. Vive la historia de tres protagonistas y explora el modo online con amigos en actividades ilimitadas."
  },
  {
    id: 3,
    title: "Red Dead Redemption 2",
    price: 1199.99,
    tags: ["Aventura", "Mundo Abierto", "Western"],
    mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
    color: "linear-gradient(90deg, #ffc107 60%, #ff9800 100%)",
    description: "Aventura épica en el Lejano Oeste con un mundo vivo y detallado. Red Dead Redemption 2 te sumerge en la vida de Arthur Morgan, enfrentando decisiones morales, paisajes impresionantes y una narrativa profunda. Caza, explora y sobrevive en el salvaje oeste."
  },
  {
    id: 4,
    title: "Cyberpunk 2077",
    price: 999.99,
    tags: ["RPG", "Futurista", "Acción"],
    mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    color: "linear-gradient(90deg, #9c27b0 60%, #3f51b5 100%)",
    description: "RPG futurista en Night City con decisiones que importan. Cyberpunk 2077 ofrece una ciudad vibrante, personajes complejos y una historia ramificada. Personaliza tu personaje, hackea sistemas y descubre secretos en un mundo de alta tecnología y peligro."
  },
  {
    id: 5,
    title: "HELLDIVERS™ 2",
    price: 1299.99,
    tags: ["Cooperativo", "Acción", "Shooter"],
    mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg",
    color: "linear-gradient(90deg, #f44336 60%, #607d8b 100%)",
    description: "Acción cooperativa frenética con fuego amigo siempre activo. HELLDIVERS™ 2 te desafía a trabajar en equipo para salvar la galaxia, enfrentando hordas alienígenas y peligros constantes. Coordina estrategias y sobrevive en misiones intensas."
  },
  {
    id: 6,
    title: "Palworld",
    price: 799.99,
    tags: ["Criaturas", "Supervivencia", "Multijugador"],
    mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
    color: "linear-gradient(90deg, #f44336 60%, #2196f3 100%)",
    description: "Captura, cría y combate con criaturas en mundo abierto. Palworld combina exploración, supervivencia y gestión de criaturas únicas llamadas Pals. Construye, lucha y descubre secretos en un universo lleno de aventuras y desafíos."
  }
];

const SteamCarousel = ({ addToCart, cart, navigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredGames, setFeaturedGames] = useState(defaultGames);
  const [loading, setLoading] = useState(true);

  // Cargar juegos desde la API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log('🎮 Intentando cargar juegos desde la API...');
        const response = await fetch('http://localhost:8080/api/games');
        console.log('📡 Respuesta recibida:', response.status);
        
        if (response.ok) {
          const games = await response.json();
          console.log('✅ Juegos cargados desde API:', games.length, 'juegos');
          
          // Transformar los datos de la API al formato del carrusel
          const transformedGames = games.map(game => ({
            id: game.id,
            title: game.name,
            price: game.cost,
            tags: game.types?.map(type => type.type) || ["Juego", "Acción"],
            mainImage: game.images && game.images.length > 0 
              ? game.images[0] 
              : "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
            color: "linear-gradient(90deg, #ff9800 60%, #f44336 100%)",
            description: game.description || "Un increíble juego que no te puedes perder"
          }));
          
          // Limitar a máximo 6 juegos
          const limitedGames = transformedGames.slice(0, 6);
          console.log('🎯 Juegos transformados (máximo 6):', limitedGames.length);
          setFeaturedGames(limitedGames);
        } else {
          console.warn('⚠️ API respondió con error:', response.status);
        }
      } catch (error) {
        console.error('❌ Error cargando juegos:', error);
        console.log('🔄 Usando juegos por defecto');
        // Mantener los juegos por defecto si falla la API
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentGame = featuredGames[currentSlide];

  // Recibe navigate como prop
  // navigate ya viene como prop

  const handleNavigateDetail = () => {
    if (navigate) {
      if (typeof navigate === 'function') {
        // Enviar todos los datos necesarios
        navigate(`/game/${currentGame.id}`, {
          state: {
            game: {
              id: currentGame.id,
              title: currentGame.title,
              price: currentGame.price,
              image: currentGame.mainImage,
              description: currentGame.description || '',
              tags: currentGame.tags,
              images: [currentGame.mainImage],
              // Si hay más campos, agregarlos aquí
            }
          }
        });
      }
    }
  };

  // Mostrar indicador de carga
  if (loading) {
    return (
      <div style={{ width: '100%', maxWidth: '1200px', margin: '32px auto', textAlign: 'center', color: '#66c0f4', padding: '100px 0' }}>
        <h2>Cargando juegos destacados...</h2>
      </div>
    );
  }

  return (
    <>
      <div
        className="carousel-root"
        style={{ width: '100%', maxWidth: '1200px', margin: '32px auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
      >
        <div
          style={{ position: 'relative', display: 'flex', background: '#23262e', cursor: 'pointer' }}
          onClick={handleNavigateDetail}
        >
          {/* Main Image & Arrows */}
          <div style={{ flex: 1, position: 'relative', minHeight: 400 }}>
            <img src={currentGame.mainImage} alt={currentGame.title} style={{ width: '100%', height: 400, objectFit: 'cover', filter: 'brightness(0.85)' }} />
            <button
              onClick={e => { e.stopPropagation(); prevSlide(); }}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: 0,
                width: 38,
                height: 38,
                color: '#fff',
                cursor: 'pointer',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); nextSlide(); }}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: 0,
                width: 38,
                height: 38,
                color: '#fff',
                cursor: 'pointer',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
          {/* Sidebar */}
          <div style={{ width: 340, background: '#23262e', padding: '32px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ color: '#66c0f4', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{currentGame.title}</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'nowrap', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {currentGame.tags.map((tag, idx) => (
                <span key={idx} style={{ background: '#2a475e', color: '#c7d5e0', borderRadius: 12, padding: '4px 12px', fontSize: 13, whiteSpace: 'nowrap' }}>{tag}</span>
              ))}
            </div>
            {/* La descripción solo se muestra en GameDetail, no aquí */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              {currentGame.discount && <span style={{ background: '#66c0f4', color: '#171a21', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>{currentGame.discount}</span>}
              {currentGame.originalPrice && <span style={{ color: '#acb4bd', textDecoration: 'line-through', fontSize: 15 }}>{currentGame.originalPrice}</span>}
              <span style={{ color: '#66c0f4', fontWeight: 700, fontSize: 20 }}>$ {currentGame.price}</span>
            </div>
            <button
              onClick={e => { e.stopPropagation(); addToCart(currentGame); }}
              disabled={cart && cart.find((item) => item.id === currentGame.id)}
              style={{
                background: cart && cart.find((item) => item.id === currentGame.id)
                  ? '#4b6479'
                  : 'linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)',
                color: cart && cart.find((item) => item.id === currentGame.id)
                  ? '#acb4bd'
                  : '#171a21',
                border: 'none',
                borderRadius: 6,
                padding: '10px 0',
                fontWeight: 700,
                fontSize: 16,
                cursor: cart && cart.find((item) => item.id === currentGame.id) ? 'not-allowed' : 'pointer',
                marginBottom: 8,
              }}
            >
              {cart && cart.find((item) => item.id === currentGame.id) ? 'Agregado' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
      {/* Indicadores debajo del carrusel */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
        {featuredGames.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            style={{
              width: 32,
              height: 14,
              borderRadius: 4,
              background: idx === currentSlide ? '#6e6e6eff' : '#2f333dff',
              opacity: idx === currentSlide ? 1 : 0.7,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
    </>
  );

}
export default SteamCarousel;
