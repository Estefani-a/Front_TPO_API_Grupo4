import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Home = Home con carrito */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} /> {/* Puedes agregar esta ruta */}
    </Routes>
  );
}
