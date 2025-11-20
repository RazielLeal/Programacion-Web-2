
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

  //estados para publicaciones
  const [imagenPublicaciones, setImagenPublicaciones] = useState([]); 
  const [idPostSeleccionado, setIdPostSeleccionado] = useState(null); 

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
                <p>10 M</p>
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

          <button className="admButton">ADMIRAR</button>
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
