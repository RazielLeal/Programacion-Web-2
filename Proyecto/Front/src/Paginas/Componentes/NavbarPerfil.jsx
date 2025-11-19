import React, { useState, useEffect, useRef } from "react"; // 1. IMPORTA useEffect y useRef
import "./NavbarPerfil.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

import Busq from "./Imagenes/Busq.png";
import Home from "./Imagenes/Home.png";
import axios from "axios"; 

export function NavbarPerfil() {
  const navigate = useNavigate();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();

  // 2. CREA LOS REFS
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const goHome = () => {
    navigate("/Home");
  };

  const goProfile = () => {
    navigate("/PerfilUsuario");
  }

   const goPublish = () => {
    navigate("/PublicarObra");
  }

  const goLogin = () => {
    navigate("/Login");
  }


  //datos del usuario que inicio sesion
  const [userInfo, setUserInfo] = useState([]); 
  const userID = localStorage.getItem("userID");  
 
  const toggleSearch = () => {
    // setIsSearchOpen(!isSearchOpen);
    // setIsProfileOpen(false);

    if (location.pathname !== "/Home") {
      // Si está en cualquier otra página, redirige a /Home
      navigate("/Home");
    } else {
      // Si YA está en /Home, solo abre/cierra la búsqueda
      setIsSearchOpen(!isSearchOpen);
      setIsProfileOpen(false);
    }
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
  
    const getUser = async()=> {

    try{
      const resp = await axios.get(`http://localhost:3001/user/${userID}`);
        if(resp.data.msg === "Err BD"){
          alert("Error con base de datos"); 
        } else if (resp.data.msg === "No result"){
          console.log("Error al obtener la info del usuario"); 
        } else {
          setUserInfo(resp.data); 
          // console.log(resp.data);  
        }
    } catch (error){
      alert("Error al hacer la peticion"); 
    }
  }
   useEffect(()=>{
     getUser(); 
   }, [userID]);

  if(userInfo && userID){
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
              {userID && (
                <img
                  src={"data:image/png;base64," + userInfo.Imagen}
                  alt="Usuario"
                />
              )}
            </div>

            <div className={isProfileOpen ? "profile-modal active" : "profile-modal"}>
              <button className="profile-modal-btn" onClick={goProfile}>Ver Perfil</button>
              <button className="profile-modal-btn" onClick={goPublish}>Publicar obra</button>
              <div className="modal-divider"></div>
              <button className="profile-modal-btn logout" onClick={goLogin}>Cerrar Sesión</button>
            </div>
          </div>
          
        </div>
      </header>
    );
  }

}

export default NavbarPerfil;