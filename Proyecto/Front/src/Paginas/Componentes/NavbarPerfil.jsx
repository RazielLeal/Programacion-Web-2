import React, { useState, useEffect, useRef } from "react"; // 1. IMPORTA useEffect y useRef
import "./NavbarPerfil.css";
import { useNavigate } from "react-router-dom";

import Busq from "./Imagenes/Busq.png";
import Home from "./Imagenes/Home.png";

export function NavbarPerfil() {
  const navigate = useNavigate();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 2. CREA LOS REFS
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const goHome = () => {
    navigate("/Home");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsProfileOpen(false);
  };

  const handleFilterClick = (filterType) => {
    if (activeFilter === filterType) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterType);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsSearchOpen(false);
  };

  // 3. AÑADE EL useEffect PARA DETECTAR CLICS FUERA
  useEffect(() => {
    // Esta función se ejecutará cada vez que haya un clic
    const handleClickOutside = (event) => {
      // Comprueba si el clic fue FUERA del contenedor de búsqueda
      const isOutsideSearch = searchRef.current && !searchRef.current.contains(event.target);
      // Comprueba si el clic fue FUERA del contenedor de perfil
      const isOutsideProfile = profileRef.current && !profileRef.current.contains(event.target);

      // Si el clic fue fuera de AMBOS...
      if (isOutsideSearch && isOutsideProfile) {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    };

    // Añade el "oyente" de clics al documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpia el "oyente" cuando el componente se desmonte (importante)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // El array vacío [] significa que esto solo se ejecuta al montar y desmontar

  return (
    <header className="navbar-perfil">
      <div className="navbar-left" onClick={goHome}>
        <h1 className="logo">AC</h1>
      </div>

      <div className="navbar-right">
        {/* 4. ASIGNA EL REF al contenedor de búsqueda */}
        <div className="search-container" ref={searchRef}>
          <button className="icon-btn" onClick={toggleSearch}>
            <img src={Busq} alt="Buscar" className="icon-img" />
          </button>
          
          <input
            type="text"
            placeholder="Buscar..."
            className={isSearchOpen ? "search-input active" : "search-input"}
          />
          <div className={isSearchOpen ? "search-modal active" : "search-modal"}>
            <button
              className={`modal-btn ${activeFilter === 'artistas' ? 'active-filter' : ''}`}
              onClick={() => handleFilterClick('artistas')}
            >
              Artistas
            </button>
            <button
              className={`modal-btn ${activeFilter === 'obras' ? 'active-filter' : ''}`}
              onClick={() => handleFilterClick('obras')}
            >
              Obras
            </button>
          </div>
        </div>

        {/* Botón de Home */}
        <button className="icon-btn" onClick={goHome}>
          <img src={Home} alt="Home" className="icon-img" />
        </button>

        {/* 4. ASIGNA EL REF al contenedor de perfil */}
        <div className="profile-container" ref={profileRef}>
          <div className="user-stamp" onClick={toggleProfile}>
            <img
              src="https://static.wixstatic.com/media/4236a4_aa83eff30f804e98bf49d1092fdec04c~mv2.jpg/v1/fill/w_280,h_392,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Frida%20Kahlo.jpg"
              alt="Usuario"
            />
          </div>

          <div className={isProfileOpen ? "profile-modal active" : "profile-modal"}>
            <button className="profile-modal-btn">Ver Perfil</button>
            <button className="profile-modal-btn">Editar Perfil</button>
            <button className="profile-modal-btn">Publicar obra</button>
            <div className="modal-divider"></div>
            <button className="profile-modal-btn logout">Cerrar Sesión</button>
          </div>
        </div>
        
      </div>
    </header>
  );
}

export default NavbarPerfil;