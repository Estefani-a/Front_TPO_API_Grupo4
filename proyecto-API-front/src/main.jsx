import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";
import Login from "./pages/login";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    {/*<Login />*/}
  </BrowserRouter>
);

