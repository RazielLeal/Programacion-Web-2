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

  const [searchTerm, setSearchTerm] = useState("");
  const [artistResults, setArtistResults] = useState([]);
  const [artworkResults, setArtworkResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");


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
 
  //BUSQUEDA  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
  
  useEffect(() => {
    // si el buscador está cerrado o no hay texto, reseteamos resultados
    if (!isSearchOpen || searchTerm.trim() === "") {
      setArtistResults([]);
      setArtworkResults([]);
      setSearchError("");
      return;
    }

    const fetchSearch = async () => {
      try {
        setIsSearching(true);
        setSearchError("");

        const resp = await axios.get("http://localhost:3001/search", {
          params: {
            q: searchTerm,
            filter: activeFilter ? activeFilter : "all"
          }
        });

        setArtistResults(resp.data.artists || []);
        setArtworkResults(resp.data.obras || []);
      } catch (error) {
        console.error("Error buscando:", error);
        setSearchError("Error al buscar, intenta de nuevo.");
        setArtistResults([]);
        setArtworkResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearch, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeFilter, isSearchOpen]);

  const goToArtistPublicProfile = (idArtista) => {
    navigate(`/PerfilArtista/${idArtista}`);
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const goToArtworkOwner = (idArtista) => {
    navigate(`/PerfilArtista/${idArtista}`);
    setIsSearchOpen(false);
    setSearchTerm("");
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
  }, []);
  
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className={isSearchOpen ? "search-modal active" : "search-modal"}>
              {/* Filtros */}
              <div className="search-filters">
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
                
              {/* Resultados */}
              <div className="search-results">
                {isSearching && <p className="search-hint">Buscando...</p>}
                
                {searchError && <p className="search-error">{searchError}</p>}
                
                {!isSearching && !searchError && searchTerm.trim() !== "" && 
                  artistResults.length === 0 && 
                  artworkResults.length === 0 && (
                    <p className="search-hint">No se encontraron resultados.</p>
                )}
            
                {/* Artistas */}
                {(activeFilter === "artistas" || !activeFilter || activeFilter === "all") &&
                  artistResults.length > 0 && (
                    <div className="search-section">
                      <h4 className="search-section-title">Artistas</h4>
                      <ul className="search-list">
                        {artistResults.map((a) => (
                          <li
                            key={a.id}
                            className="search-item"
                            onClick={() => goToArtistPublicProfile(a.id)}
                          >
                            <img
                              src={"data:image/png;base64," + a.imagen}
                              alt={a.nombre}
                              className="search-avatar"
                            />
                            <div className="search-text">
                              <span className="search-main">{a.nombre}</span>
                              {a.descripcion && (
                                <span className="search-sub">{a.descripcion}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                )}
            
                {/* Obras */}
                {(activeFilter === "obras" || !activeFilter || activeFilter === "all") &&
                  artworkResults.length > 0 && (
                    <div className="search-section">
                      <h4 className="search-section-title">Obras</h4>
                      <ul className="search-list">
                        {artworkResults.map((o) => (
                          <li
                            key={o.id_publicacion}
                            className="search-item"
                            onClick={() => goToArtworkOwner(o.idUsuario)}
                          >
                            <img
                              src={o.imagenPost}
                              alt={o.titulo}
                              className="search-thumb"
                            />
                            <div className="search-text">
                              <span className="search-main">{o.titulo}</span>
                              <span className="search-sub">
                                {o.nombreUsuario}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                )}
              </div>
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