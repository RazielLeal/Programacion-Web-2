
import "./CSS/Perfil.css";
import { NavbarPerfil } from "./Componentes/NavbarPerfil";
import ArtworkModal from "./Componentes/ArtworkModal";

import Apl from "./CSS/Images/Perfil/Aplausos.png";
import Seg from "./CSS/Images/Perfil/Seguidores.png";
import Correo from "./CSS/Images/Perfil/Correo.png";
import axios from "axios"; 

import { useEffect } from "react"; 
import { useState } from "react";
import { useParams } from "react-router-dom"; 

export const PerfilArtista = () => {
  //funcion para obtener la informacion del usuario
  const [userInfo, setUserInfo] = useState([]); 
  const {idUsuario} = useParams(); 
  const miID = localStorage.getItem("userID");

  //estados para publicaciones
  const [imagenPublicaciones, setImagenPublicaciones] = useState([]); 
  const [idPostSeleccionado, setIdPostSeleccionado] = useState(null); 

  //estados para admiradores 
  const [isAdmirer, setIsAdmirer] = useState(false); //verificar si lo estoy admirando


  const getUser = async()=> {
      try{
        const resp = await axios.get(`http://localhost:3001/user/${idUsuario}`);
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
  }, [idUsuario]);
  
    //funcion solo para obtener las imagenes de las publicaciones propias del usuario
  const getImagenPublicaciones = async()=> {
      try{
        const resp = await axios.get(`http://localhost:3001/getImagenPublicaciones/${idUsuario}`);
          if(resp.data.msg === "Err BD"){
            alert("Error con base de datos"); 
          } else if (resp.data.msg === "No result"){
            console.log("No hay publicaciones registradas"); 
          } else {
            if(Array.isArray(resp.data)){
              setImagenPublicaciones(resp.data); 
              console.log(resp.data);  
            }
          }
      } catch (error){
        alert("Error al hacer la peticion"); 
      }
  }

  useEffect(()=>{
    if(idUsuario) {
      getImagenPublicaciones(); 
    }
  }, [idUsuario]); 
  
  // 1. VERIFICAR ESTADO INICIAL AL CARGAR
  useEffect(() => {
    const checkAdmiracion = async () => {
        if (!idUsuario) return;

        try {
            const resp = await axios.post("http://localhost:3001/checkAdmiracion", {
                idSeguidor: miID,
                idAdmirado: idUsuario // El dueño del perfil que estamos viendo
            });
            setIsAdmirer(resp.data.isAdmirer);
        } catch (error) {
            console.log(error);
        }
    };

    checkAdmiracion();
  }, [idUsuario, miID]); // Se ejecuta al entrar al perfil

  const handleAdmirarClick = async () => {
      if (!miID) {
          alert("Debes iniciar sesión para admirar");
          return;
      }

      // Optimistic UI: Cambiamos el color antes de que el servidor responda
      const estadoAnterior = isAdmirer;
      setIsAdmirer(!isAdmirer);

      try {
          const resp = await axios.post("http://localhost:3001/admirar", {
              idSeguidor: miID,
              idAdmirado: idUsuario
          });
          
          // Confirmamos el estado real con la respuesta del servidor
          setIsAdmirer(resp.data.siguiendo);
          
      } catch (error) {
          console.error("Error al admirar");
          // Si falla, regresamos al estado anterior
          setIsAdmirer(estadoAnterior); 
          alert("Hubo un error al intentar admirar.");
      }
  };
  return (
    <div className="perfilContainer">
      <NavbarPerfil />

      <main className="perfilContent">
        <section className="perfilHeader">
          <div className="perfilAvatar">
            <img
              src={"data:image/png;base64," + userInfo.Imagen}
              alt="Avatar"
            />
          </div>

          <div className="perfilInfo">
            <h1>{userInfo.Nombre}</h1>

            <div className="perfilStats">
              <div className="perfilDato">
                <img
                  src ={Apl}
                  alt="Aplausos"
                />
                <p>123.5 M</p>
              </div>
              <div className="perfilDato">
                <img
                  src ={Seg}
                  alt="Seguidores"
                />
                <p>{userInfo.totalSeguidores || 0}</p>
              </div>
              <div className="perfilDato">
                <img
                  src ={Correo}
                  alt="Correo"
                />
                <p>{userInfo.Correo}</p>
              </div>
            </div>
          </div>

          <button 
            className={`admButton ${isAdmirer ? 'activo' : ''}`} // Clase condicional para cambiar color
            onClick={handleAdmirarClick}
          >
            {isAdmirer ? "ADMIRANDO 🤩" : "ADMIRAR"}
        </button>
        </section>

        <section className="galeria">
          {imagenPublicaciones.length === 0 ? (
                  <p>Aún no hay publicaciones.</p>
              ) : (
                  imagenPublicaciones.map((imgPublicaciones) => (
                      <div className="obra" key={imgPublicaciones.id_publicacion}> 
                          <img
                              src={`${imgPublicaciones.imagen}`}
                              alt="Publicación del usuario"
                              onClick={() => {
                                console.log("Clic detectado, ID de la obra:", imgPublicaciones.id_publicacion);
                                setIdPostSeleccionado(imgPublicaciones.id_publicacion);
                              }}
                          />
                      </div>
                  ))
          )}
        </section>
      </main>

      {idPostSeleccionado && (
        <ArtworkModal 
          // 1. Pasamos TODA la lista (para saber cuál es anterior/siguiente)
          listaPublicaciones={imagenPublicaciones} 
          
          // 2. Pasamos el ID donde se hizo clic (para saber dónde empezar)
          initialId={idPostSeleccionado} 
          
          onClose={() => setIdPostSeleccionado(null)} 
        />
      )}
    </div>
  );
};

export default PerfilArtista;
