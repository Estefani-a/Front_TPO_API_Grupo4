
import React, { useState, useEffect, useMemo } from "react";
import HeaderSteam from "./components/HeaderSteam";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Checkout from "./pages/checkout";
import GameDetail from "./pages/GameDetail";
import AcercaDe from "./pages/AcercaDe";
import Soporte from "./pages/Soporte";
import Comunidad from "./pages/Comunidad"; 

export default function App() {
  // Estado y lógica del carrito (subido desde Home)
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      setCart(raw ? JSON.parse(raw) : []);
    } catch {
      setCart([]);
    }
  }, []);
  useEffect(() => {
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

  useEffect(() => {
    if (location.state?.openCart) {
      setShowCart(true);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const addToCart = (game) => {
    try {
      const raw = localStorage.getItem("cart");
      const current = raw ? JSON.parse(raw) : [];
      const i = current.findIndex((x) => x.id === game.id);
      const image = game.image || game.mainImage;
      if (i >= 0) {
        current[i] = { ...current[i], qty: (current[i].qty || 1) + 1 };
      } else {
        current.push({
          id: game.id,
          title: game.title,
          price: game.price,
          image,
          qty: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(current));
      setCart(current);
      window.dispatchEvent(new CustomEvent("cart-updated"));
      setToast(`✅ ${game.title} agregado al carrito`);
      setTimeout(() => setToast(""), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const removeFromCart = (id) => {
    try {
      const updated = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      setCart(updated);
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1), 0),
    [cart]
  );

  return (
    <>
      <HeaderSteam
        cart={cart}
        showCart={showCart}
        setShowCart={setShowCart}
        removeFromCart={removeFromCart}
        total={total}
      />
      <div style={{ height: 80 }} />

      {/* Toast (sin alert y sin "localhost dice") */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#1b2838",
            color: "#66c0f4",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} cart={cart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/acerca-de" element={<AcercaDe />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/comunidad" element={<Comunidad />} />
      </Routes>
    </>
  );
}
