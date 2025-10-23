import React, { useState, useEffect } from 'react';
import './ArtworkModal.css'; 

export function ArtworkModal({ allArtworks, currentArtwork, onClose }) {
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Encuentra el índice del item clicado cuando el modal se abre
  useEffect(() => {
    const index = allArtworks.findIndex(item => item.id === currentArtwork.id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [currentArtwork, allArtworks]);

  // 2. Funciones de navegación (dentro del modal)
  const nextImage = (e) => {
    e.stopPropagation(); // Evita que el clic cierre el modal
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allArtworks.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allArtworks.length) % allArtworks.length);
  };

  // 3. Esta es la obra que se está mostrando AHORA
  const artwork = allArtworks[currentIndex];

  // 4. Evita que el clic en el contenido cierre el modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Fondo oscuro
    <div className="modal-backdrop" onClick={onClose}>
      
    
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        {/* Contenedor principal del modal */}
        <div className="modal-content" onClick={handleModalClick}>
        
        
            {/* 1. Contenedor del Arte (con flechas) */}
            <div className="modal-art-container">
                <button className="modal-nav-arrow left" onClick={prevImage}>&lt;</button>
                <img 
                    src={artwork.artworkUrl} 
                    alt={artwork.title} 
                    className="modal-artwork-image" 
                />
                <button className="modal-nav-arrow right" onClick={nextImage}>&gt;</button>
            </div>

            {/* 2. Contenedor de la Info (a la derecha, sin diseño) */}
            <div className="modal-info-container">
            
                <div className="info-part artist-info">
                    <img src={artwork.artistAvatar} alt={artwork.artistName} className="artist-avatar-small" />
                    <span className="artist-name-small">{artwork.artistName}</span>
                </div>
            
                <div className="info-part artwork-title-container">
                    <h3 className="artwork-title-modal">{artwork.title}</h3>
                </div>

                <div className="info-part artwork-actions">
                    <div className="like-section">
                    <button className="action-btn like-btn">
                        {/* <img src={iconLike} alt="Aplaudir" /> */}
                        <span>👏</span> {/* Placeholder si no tienes imagen */}
                    </button>
                    <span className="like-count">{artwork.likes}</span>
                    </div>
                    <button className="action-btn save-btn">
                    {/* <img src={iconSave} alt="Guardar" /> */}
                    <span>💾</span> {/* Placeholder si no tienes imagen */}
                    </button>
                </div>

                <div className="info-part comments-list">
                    {artwork.comments.length > 0 ? (
                    artwork.comments.map((comment, index) => (
                        <p key={index} className="comment-item">
                        <strong>{comment.user}:</strong> {comment.text}
                        </p>
                    ))
                    ) : (
                    <p className="comment-item none">No hay comentarios.</p>
                    )}
                </div>

                <div className="info-part comment-input-box">
                    <input type="text" placeholder="Escribe un comentario..." className="comment-input" />
                    <button className="action-btn send-btn">
                    {/* <img src={iconSend} alt="Enviar" /> */}
                    <span>➢</span> {/* Placeholder si no tienes imagen */}
                    </button>
                </div>

            </div>
        
        </div>
      
    </div>
  );
}