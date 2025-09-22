import React, { useState } from "react";
import "./auth.css";

const initialCart = [
  {
    id: 1,
    title: "Counter-Strike 2",
    price: 499.99,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
    tags: ["FPS", "Disparos", "Multijugador", "Competitivo"],
    platform: "win"
  },
];

export default function Cart() {
  const [cart, setCart] = useState(initialCart);

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="auth-container" style={{ maxWidth: 940, margin: '0 auto' }}>
      <h2 style={{ color: "#66c0f4", marginBottom: 24 }}>Tu carrito</h2>
      <div className="tab_content_items">
        {cart.length === 0 ? (
          <div style={{ color: "#fff" }}>Tu carrito está vacío.</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="tab_item">
              <div className="tab_item_cap">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="tab_item_content">
                <div className="tab_item_name">{item.title}</div>
                <div className="tab_item_details">
                  <span className={`platform_img ${item.platform}`}></span>
                  <div className="tab_item_top_tags">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="top_tag">
                        {index === 0 ? tag : `, ${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="discount_block">
                  <div className="discount_prices">
                    <div className="discount_final_price">${item.price.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: "#c1272d",
                      color: "#fff",
                      border: "none",
                      borderRadius: 2,
                      padding: "4px 10px",
                      marginLeft: "auto",
                      marginRight: "12px", // separa el botón del borde derecho
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Quitar
                  </button>
                </div>
              </div>
              <div style={{ clear: "both" }}></div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            textAlign: "right",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 12
          }}>
            Total: ${total.toFixed(2)}
          </div>
          <button style={{
            width: "100%",
            background: "linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)",
            color: "#171a21",
            border: "none",
            borderRadius: 2,
            padding: "12px 0",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer"
          }}>
            Comprar
          </button>
        </div>
      )}
    </div>
  );
}