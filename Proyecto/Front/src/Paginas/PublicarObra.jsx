import React, { useState } from "react";
import "./CSS/PublicarObra.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; 

import Upload from "./CSS/Images/Perfil/Upload.png";
import axios from "axios";
import Swal from "sweetalert2";

export function PublicarObra() {
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null); 
  const [titulo, setTitulo] = useState("");
  const userID = localStorage.getItem("userID");  

  const navigate = useNavigate();
  const Publicar = () => {
    navigate("/Home");
  };

  const Cancelar = () => {
    navigate("/PerfilUsuario");
  };

  const handleImagen = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024; 

      if(selectedFile.size > maxSize) {
        Swal.fire({
          icon: "warning",
          title: "Imagen demasiado pesada",
          text: "El límite es de 5MB 📛",
          confirmButtonColor: "#a47d5e",
        });
        e.target.value = null; 
        return; 
      }
      setImagen(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCancelar = () => {
    setImagen(null);
    setTitulo("");
  };

  const sendDataPublicacion = async (e)=>{
    e.preventDefault();

    // === VALIDACIÓN FRONT ===
    if (!titulo.trim()) {
      Swal.fire({
        icon: "info",
        title: "Falta el título",
        text: "Tu obra debe tener un título🪶",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }

    if (!imagen) {
      Swal.fire({
        icon: "info",
        title: "Selecciona una imagen",
        text: "Necesitas subir una imagen para publicar tu obra 🖼️",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }

    const formDataPublicacion = new FormData(); 
    formDataPublicacion.append("titlePost", titulo); 
    formDataPublicacion.append("imagePost", imagen); 

    //para comprobar que los datos se esten mandando como deberia 
    console.log("Enviando estos datos:", {
      userID: userID, 
      titulo: titulo, 
      imagen: imagen
    });
    try{
      const resp = await axios.post(
        `http://localhost:3001/registerPublicacion/${userID}`,
        formDataPublicacion
      );

      if(resp.data.msg === "Registrado"){
        Swal.fire({
          icon: "success",
          title: "¡Obra publicada! 🎨",
          text: "Tu publicación se registró correctamente.",
          confirmButtonColor: "#a47d5e",
          timer: 1500,
          showConfirmButton: false,
        });
        
        //Limpiamos los campos
        setTitulo(""); 
        setImagen(null); 
        setPreview(null);

        //redirigimos después de publicar
        navigate("/Home");
      } else if (resp.data.msg === "ErrorDB"){
        Swal.fire({
          icon: "error",
          title: "Error al publicar",
          text: "No se pudo registrar la obra.",
          confirmButtonColor: "#a47d5e",
        }); 
      }
      console.log(resp.data); 
    } catch(error) {
      console.log(error); 
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo procesar la petición.",
        confirmButtonColor: "#a47d5e",
      });
    }
  }
  return (
    <form onSubmit={sendDataPublicacion} className="publicar-container" noValidate>
        <div className="marco">
            {imagen ? (
            <img src={preview} alt="Obra seleccionada" className="imagen-preview" />
            ) : (
            <p className="texto-seleccion">SELECCIONA UNA O MÁS IMÁGENES</p>
            )}
            <label className="input-imagen">
            <input type="file"  accept="image/*" onChange={handleImagen} hidden />
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
          <button type = "submit" className="btn-publicar">PUBLICAR</button>
        </div>
    </form>
  );
}
export default PublicarObra;