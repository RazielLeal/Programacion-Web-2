import React, { use, useState } from 'react';
// Importa el CSS para este componente (lo creamos en el paso 3)
import './ArtworkItem.css'; 

// Importa el pedestal (es estático, así que lo importamos aquí)
import pedestalImg from '../CSS/Images/pedestal.png';
import { useNavigate } from "react-router-dom";
import PerfilArtista from '../PerfilArtista';


export function ArtworkItem({ artworkImage, artistImage, artistName, idUser, onArtworkClick }) {
  let userID = localStorage.getItem("userID"); 
  const navigate = useNavigate();
  const [idPostSeleccionado, setIdPostSeleccionado] = useState(null);
  const [imagenPublicaciones, setImagenPublicaciones] = useState([]); 

  const goArtistProfile = (idUser) => {
    if(String(idUser) === String(userID)){
      idUser = userID; 
      navigate(`/PerfilUsuario/${idUser}`);
    } else {
      navigate(`/PerfilArtista/${idUser}`);
    }
  }

  return (
    <div className="gallery-item-wrapper">
      
      {/* 1. La obra de arte */}
      <div className="artwork-frame"> 
        <img src={artworkImage} alt={`Obra de ${artistName}`} onClick={()=>{
          console.log("Clic detectado en el hijo ArtworkItem"); 

          if(onArtworkClick) {
            onArtworkClick(); 
          } else {
            console.error("ERROR: la funcion onArtworkClick es undefined")
          }
          
          }} 
          style={{cursor: 'pointer'}}/>
      </div>      

      {/* 2. La info del artista */}
      <div className="artist-item-info " onClick= {()=> goArtistProfile(idUser)}>
        <img src={"data:image/png;base64," + artistImage} alt={artistName} className="artist-avatar" />
        <img src={pedestalImg} alt="Pedestal" className="pedestal-image" />
        <p className="artist-name">{artistName}</p>
      </div>
    </div>
  );
}