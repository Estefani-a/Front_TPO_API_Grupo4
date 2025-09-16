import HeaderSteam from "./components/HeaderSteam";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Checkout from "./pages/checkout";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <>
      <HeaderSteam />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
}