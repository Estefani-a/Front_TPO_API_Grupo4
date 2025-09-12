import { Routes, Route, useParams } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import GameDetail from "./pages/GameDetail";

function GameDetailWrapper() {
  const { id } = useParams();
  return <GameDetail gameId={id} apiBase="http://localhost:3000" />;
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Home = Home con carrito */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} /> {/* Puedes agregar esta ruta */}
      <Route path="/game/:id" element={<GameDetail apiBase="http://localhost:3000" />} />
    </Routes>
  );
}




