import React, { useState } from "react";
import "./CSS/PublicarObra.css";
import { useNavigate } from "react-router-dom";

import Upload from "./CSS/Images/Perfil/Upload.png";

export function PublicarObra() {
  const [imagen, setImagen] = useState(null);
  const [titulo, setTitulo] = useState("");
  const navigate = useNavigate();

  const Publicar = () => {
    navigate("/Home");
  };

  const Cancelar = () => {
    navigate("/PerfilUsuario");
  };

  

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(URL.createObjectURL(file));
    }
  };

  const handleCancelar = () => {
    setImagen(null);
    setTitulo("");
  };

  return (
    <div className="publicar-container">
        <div className="marco">
            {imagen ? (
            <img src={imagen} alt="Obra seleccionada" className="imagen-preview" />
            ) : (
            <p className="texto-seleccion">SELECCIONA UNA O MÁS IMÁGENES</p>
            )}
            <label className="input-imagen">
            <input type="file" accept="image/*" onChange={handleImagen} hidden />
            </label>
            <span className="flecha izquierda">❮</span>
            <span className="flecha derecha">❯</span>
            <span className="cerrar" onClick={handleCancelar}>
            ✕
            </span>
        </div>

        <label className="icono-subir">
            <img src={Upload} alt="Icono de subir"/>
            <input type="file" accept="image/*" onChange={handleImagen} hidden />
        </label>

      <div className="info-obra">
        <h2 className="titulo">NOMBRE DE TU OBRA</h2>
        <div className="placa">
          <input
            type="text"
            placeholder=""
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-titulo"
          />
        </div>
      </div>

    

      <div className="botones">
        <button className="btn-cancelar" onClick={Cancelar}>
          CANCELAR
        </button>
        <button className="btn-publicar" onClick={Publicar}>PUBLICAR</button>
      </div>
    </div>
  );
}
