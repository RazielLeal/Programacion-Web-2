import React, {useState} from "react";
import "./NavbarPerfil.css";
import { useNavigate } from "react-router-dom";

import Busq from "./Imagenes/Busq.png";
import Home from "./Imagenes/Home.png";

export function NavbarPerfil() {
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const goHome = () => {
    navigate("/Home");
  };

  const toggleSearch = () =>{
    setIsSearchOpen(!isSearchOpen);
  }
  return (
    <header className="navbar-perfil">
      
      <div className="navbar-left" onClick={goHome}>
        <h1 className="logo">AC</h1>
      </div>


      {/* Icono derecha */}
      <div className="navbar-right">

        <div className="search-container">
          <button className="icon-btn" onClick={toggleSearch}>
              <img src={Busq} alt="Buscar" className="icon-img" />
          </button>

          <input 
            type="text"
            placeholder="Buscar..."
            className={isSearchOpen ? "search-input active" : "search-input"}
          />
        </div>

        <button className="icon-btn" onClick={goHome}>
            <img src={Home} alt="Home" className="icon-img" />
        </button>

        <div className="user-stamp">
          <img
            src ="https://static.wixstatic.com/media/4236a4_aa83eff30f804e98bf49d1092fdec04c~mv2.jpg/v1/fill/w_280,h_392,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Frida%20Kahlo.jpg"
            alt="Usuario"
          />
        </div>
      </div>
    </header>
  );
}

export default NavbarPerfil;
