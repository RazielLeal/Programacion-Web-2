import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ArtworkModal.css'; 

export function ArtworkModal({ listaPublicaciones, initialId, onClose }) {
  console.log("--- DEBUG MODAL ---");
  console.log("Lista recibida (tamaño):", listaPublicaciones?.length);
  console.log("ID buscado:", initialId);
  // 1. Estado para el índice actual (0, 1, 2...)
  // Buscamos en qué posición de la lista está el ID inicial
  const [currentIndex, setCurrentIndex] = useState(() => {
     return listaPublicaciones.findIndex(pub => pub.id_publicacion === initialId);
  });

  // Estado para los detalles que vienen del servidor
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 2. Calculamos el ID actual basado en el índice
  // Si el índice cambia (al dar next), el ID cambia automáticamente
  const currentPost = listaPublicaciones[currentIndex];
  const currentId = currentPost ? currentPost.id_publicacion : null;

  // 3. EFECTO: Cargar detalles cada vez que cambia el ID actual
  useEffect(() => {
    const getDetalle = async () => {
        if (!currentId) return;
        
        setCargando(true); // Ponemos cargando al cambiar de foto
        try {
            const resp = await axios.get(`http://localhost:3001/getPublicaciones/${currentId}`);
            setDetalle(resp.data);
            setCargando(false);
        } catch (error) {
            console.log(error);
            setCargando(false);
        }
    };

    getDetalle();
  }, [currentId]); // <--- Se ejecuta cuando cambias de foto

  // 4. Funciones de Navegación (Tu lógica original)
  const nextImage = (e) => {
    e.stopPropagation();
    // Usamos módulo (%) para que al llegar al final vuelva al principio
    setCurrentIndex((prev) => (prev + 1) % listaPublicaciones.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    // Lógica para que al ir atrás desde el 0 vaya al último
    setCurrentIndex((prev) => (prev - 1 + listaPublicaciones.length) % listaPublicaciones.length);
  };

  const handleModalClick = (e) => e.stopPropagation();

  if (!currentId) return null;

  return (
    <div className="modal-art-backdrop" onClick={onClose}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        <div className="modal-art-content" onClick={handleModalClick}>
            
            {/* CONTENEDOR ARTE (Con flechas recuperadas) */}
            <div className="modal-art-container">
                {/* Botón Anterior */}
                <button className="modal-nav-arrow left" onClick={prevImage}>&lt;</button>
                
                {cargando ? (
                    <div style={{color:'white'}}>Cargando...</div>
                ) : (
                   <img 
                        src={`${detalle ? detalle.imagenPost : ''}`} 
                        alt="Obra" 
                        className="modal-artwork-image" 
                   />
                )}

                {/* Botón Siguiente */}
                <button className="modal-nav-arrow right" onClick={nextImage}>&gt;</button>
            </div>

            {/* CONTENEDOR INFO */}
            <div className="modal-info-container">
               {/* Aquí va la misma estructura de info que hicimos en la respuesta anterior */}
               {/* Usando 'detalle.nombreUsuario', 'detalle.titulo', etc. */}
               {/* Solo asegúrate de verificar "detalle &&" antes de pintar */}
               
               {!cargando && detalle ? (
                   <>
                       <div className="info-part artist-info">
                            <img 
                                src={`data:image/png;base64,${detalle.imagenUsuario}`} 
                                alt={detalle.nombreUsuario} 
                                className="artist-avatar-small" 
                            />
                            <span className="artist-name-small">{detalle.nombreUsuario}</span>
                       </div>

                       <div className="info-part artwork-title-container">
                            <h3 className="artwork-title-modal">{detalle.titulo}</h3>
                            <p style={{fontSize: '0.8rem', color: '#666'}}>
                                {new Date(detalle.fechaPublicacion).toLocaleDateString()}
                            </p>
                       </div>
                       
                       {/* ... Resto de botones y comentarios ... */}
                       
                   </>
               ) : null}
            </div>
        </div>
    </div>
  );
}

export default ArtworkModal;