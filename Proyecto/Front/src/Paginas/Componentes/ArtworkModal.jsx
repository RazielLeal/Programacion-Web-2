import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ArtworkModal.css'; 

import Save from "../CSS/Images/Perfil/Guardado.png";
import Apl from "../CSS/Images/Perfil/Aplausos.png";

export function ArtworkModal({ listaPublicaciones, initialId, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return listaPublicaciones.findIndex(pub => pub.id_publicacion === initialId);
  });

  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);

  // estados para interacción
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSaved, setIsSaved] = useState(false); // si quieres luego preguntar a BD si está guardado

  const currentPost = listaPublicaciones[currentIndex];
  const currentId = currentPost ? currentPost.id_publicacion : null;

  const userID = localStorage.getItem("userID");

  const [saveMessage, setSaveMessage] = useState("");


  useEffect(() => {
    const getDetalle = async () => {
      if (!currentId) return;
      setCargando(true);
      try {
        const resp = await axios.get(`http://localhost:3001/getPublicaciones/${currentId}`);
        const data = resp.data;
        setDetalle(data);
        setLikesCount(data.likesCount || 0);
        setComments(data.comments || []);
        setCargando(false);
      } catch (error) {
        console.log(error);
        setCargando(false);
      }
    };

    getDetalle();
    setCommentText("");
  }, [currentId]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % listaPublicaciones.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + listaPublicaciones.length) % listaPublicaciones.length);
  };

  const handleModalClick = (e) => e.stopPropagation();

  const handleLike = async () => {
    try {
      const resp = await axios.post("http://localhost:3001/likePublicacion", {
        idUsuario: userID,
        idPublicacion: currentId
      });

      if (resp.data && typeof resp.data.likesCount !== "undefined") {
        setLikesCount(resp.data.likesCount);
      }
      // si quieres podrías tener estado isLiked en el futuro
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
        const resp = await axios.post("http://localhost:3001/guardarPublicacion", {
            idUsuario: userID,
            idPublicacion: currentId
        });

        if (resp.data && typeof resp.data.saved !== "undefined") {
            setIsSaved(resp.data.saved);
        }
        if (resp.data && resp.data.msg) {
            setSaveMessage(resp.data.msg);

            setTimeout(() => {
                setSaveMessage("");
            }, 2000);
        }
    } catch (err) {
        console.log(err);
        setSaveMessage("Ocurrió un error al guardar 😵");
        setTimeout(() => setSaveMessage(""), 2000);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      const resp = await axios.post("http://localhost:3001/comentarPublicacion", {
        idUsuario: userID,
        idPublicacion: currentId,
        texto: commentText.trim()
      });

      if (resp.data && resp.data.comentario) {
        setComments((prev) => [...prev, resp.data.comentario]);
        setCommentText("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!currentId) return null;

  return (
    <div className="modal-art-backdrop" onClick={onClose}>
      <button className="modal-close-btn" onClick={onClose}>&times;</button>

      <div className="modal-art-content" onClick={handleModalClick}>
        {/* CONTENEDOR ARTE */}
        <div className="modal-art-container">
          <button className="modal-nav-arrow left" onClick={prevImage}>&lt;</button>

          {cargando ? (
            <div style={{ color: 'white' }}>Cargando...</div>
          ) : (
            <img
              src={detalle ? detalle.imagenPost : ''}
              alt="Obra"
              className="modal-artwork-image"
            />
          )}

          <button className="modal-nav-arrow right" onClick={nextImage}>&gt;</button>
        </div>

        {/* CONTENEDOR INFO */}
        <div className="modal-info-container">
          {!cargando && detalle && (
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
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    {new Date(detalle.fechaPublicacion).toLocaleDateString()}
                  </p>
                </div>

                <div className="info-part artwork-actions">
                    <div className="like-section">
                      <button className="action-btn like-btn" onClick={handleLike}>
                        <img src={Apl} alt="Likes" />
                      </button>
                      <span className="like-count">{likesCount}</span>
                    </div>

                    <button
                      className={`action-btn save-btn ${isSaved ? "saved" : ""}`}
                      onClick={handleSave}
                    >
                      <img src={Save} alt="Guardar" />
                    </button>
                </div>

                {saveMessage && (
                    <p className="save-feedback">
                        {saveMessage}
                    </p>
                )}

                <div className="info-part comments-list">
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <p key={comment.id_comentario} className="comment-item">
                        <strong>{comment.nombreUsuario}:</strong> {comment.texto}
                      </p>
                    ))
                  ) : (
                    <p className="comment-item none">No hay comentarios.</p>
                  )}
                </div>

                <div className="info-part comment-input-box">
                  <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    className="comment-input"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button className="action-btn send-btn" onClick={handleSendComment}>
                    <span>➢</span>
                  </button>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtworkModal;
