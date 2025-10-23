import React from "react";
import "./NavbarPerfil.css";
import { useNavigate } from "react-router-dom";

import Busq from "./Imagenes/Busq.png";
import Home from "./Imagenes/Home.png";

export function NavbarPerfil() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home");
  };

  return (
    <header className="navbar-perfil">
      {/* Logo tipo AC */}
      <div className="navbar-left" onClick={goHome}>
        <h1 className="logo">AC</h1>
      </div>


      {/* Icono derecha */}
      <div className="navbar-right">
        <button className="icon-btn">
            <img src={Busq} alt="Buscar" onClick={goHome} className="icon-img" />
        </button>
        <button className="icon-btn">
            <img src={Home} alt="Home" onClick={goHome} className="icon-img" />
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
