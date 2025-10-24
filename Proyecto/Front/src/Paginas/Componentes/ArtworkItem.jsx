import React from 'react';
// Importa el CSS para este componente (lo creamos en el paso 3)
import './ArtworkItem.css'; 

// Importa el pedestal (es estático, así que lo importamos aquí)
import pedestalImg from '../CSS/Images/pedestal.png';
import { useNavigate } from "react-router-dom";

export function ArtworkItem({ artworkImage, artistImage, artistName, onArtworkClick }) {

  const navigate = useNavigate();

  const goArtistProfile = () => {
    navigate("/PerfilArtista");
  }

  return (
    <div className="gallery-item-wrapper">
      
      {/* 1. La obra de arte */}
        <div className="artwork-frame" onClick={onArtworkClick}> 
        <img src={artworkImage} alt={`Obra de ${artistName}`} />
        </div>      
        
      {/* 2. La info del artista */}
      <div className="artist-info" onClick={goArtistProfile}>
        <img src={artistImage} alt={artistName} className="artist-avatar" />
        <img src={pedestalImg} alt="Pedestal" className="pedestal-image" />
        <p className="artist-name">{artistName}</p>
      </div>

    </div>
  );
}