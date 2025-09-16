import React, { useState } from "react";
import "./NavBar.css";

const NavBar = ({ handleChange, input }) => {

  return (
    <nav className="steam-navbar">
      <div className="steam-search">
        <input
          type="text"
          placeholder="Buscar juegos..."
          value={input}
          onChange={handleChange}
        />
        <button type="button">
          <svg width="20" height="20" fill="white">
            <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" fill="none"/>
            <line x1="15" y1="15" x2="19" y2="19" stroke="white" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;