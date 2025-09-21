import HeaderSteam from "./components/HeaderSteam";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Checkout from "./pages/checkout";
import GameDetail from "./pages/GameDetail";
import AcercaDe from "./pages/AcercaDe";
import Soporte from "./pages/Soporte";


export default function App() {
  return (
    <>
      <HeaderSteam />
      <div style={{ height: 80 }} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/acerca-de" element={<AcercaDe />} />
        <Route path="/soporte" element={<Soporte />} />
      </Routes>
    </>
  );
}
