import React, { useState } from "react";
import "./CSS/Perfil.css";
import { NavbarPerfil } from "./Componentes/NavbarPerfil";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; 
import axios from "axios"; 

import Apl from "./CSS/Images/Perfil/Aplausos.png";
import Seg from "./CSS/Images/Perfil/Seguidores.png";
import Correo from "./CSS/Images/Perfil/Correo.png";
import Save from "./CSS/Images/Perfil/Guardado.png";
import Upload from "./CSS/Images/Perfil/Upload.png";

export const PerfilUsuario = () => {
  const [mostrarLibro, setMostrarLibro] = useState(false);  
  const navigate = useNavigate();

  const UploadPage = () => {
    navigate("/PublicarObra");
  };

  const Guardados = () => {
    navigate("/Guardados");
  };

  const handleEditarClick = () => {
    setMostrarLibro(true);
  };

  const handleCerrarLibro = (e) => {
    if (e.target.classList.contains("overlay")) {
      setMostrarLibro(false);
    }
  };

  const [preview, setPreview] = useState(null);

  //funcion para manejar la info de cada input 
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo, 
      [name]: value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setPreview(null);
      setNuevaImagen(null); 
      return;
    }

    setNuevaImagen(file); 
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  //datos del usuario que inicio sesion
  const [userInfo, setUserInfo] = useState([]); 
  const userID = localStorage.getItem("userID");  

  const [contraActual, setContraActual] = useState("");
  const [contraNueva, setContraNueva] = useState(""); 

  const [isContraVerified, setIsContraVerified] = useState(false); //dependiendo del estado muestra u oculta el campo de nueva contraseña
  const [errorMsg, setErrorMsg] = useState(""); 

  const [nuevaImagen, setNuevaImagen] = useState(null);

  //funcion para ejecutar cuando el usuario haga clic fuera del input 
  const verificarContra = async()=> {
      if(!contraActual){
        setIsContraVerified(false);
        return;
      }
    
      try {
        const resp = await axios.post("http://localhost:3001/verifyPassword", {
          userId: userID, 
          passwordToCheck: contraActual
        });

        if(resp.data.valid){
          setIsContraVerified(true);
          setErrorMsg(""); 
        } else {
          setIsContraVerified(false); 
          setErrorMsg("La contraseña actual no es correcta"); 
        }
      } catch (error) {

      }
  }

  //funcion para obtener la informacion del usuario
  const getUser = async()=> {
      try{
        const resp = await axios.get(`http://localhost:3001/user/${userID}`);
          if(resp.data.msg === "Err BD"){
            alert("Error con base de datos"); 
          } else if (resp.data.msg === "No result"){
            alert("Error al obtener la info del usuario"); 
          } else {
            setUserInfo(resp.data); 
            console.log(resp.data);  
          }
      } catch (error){
        alert("Error al hacer la peticion"); 
      }
    }
  useEffect(()=>{
    getUser(); 
  }, [userID]);

 //maneja los cambios en el campo de la contraseña actual
  const handleTyping = (e) =>{
    setContraActual(e.target.value); 
    setIsContraVerified(false); 
    setErrorMsg(""); 
  }

  //peticion para modificar la informacion del usuario 
  const updateUser = async(e)=> {
    e.preventDefault(); 
      const frmUpdateData = new FormData();
      frmUpdateData.append("name", userInfo.Nombre);
      frmUpdateData.append("email", userInfo.Correo);
      frmUpdateData.append("description", userInfo.descripcion); 

      if(contraNueva && contraNueva.trim() !== ""){
        frmUpdateData.append("password", contraNueva); 
      }

      if(nuevaImagen){
        frmUpdateData.append("image", nuevaImagen); 
      }

    try{
      const resp = await axios.put(`http://localhost:3001/updateUser/${userID}`,
        frmUpdateData
      );

      if(resp.data.msg === "Usuario modificado"){
        alert("Usuario modificado con exito"); 
        setNuevaImagen(null); 
        setContraActual("");
        setIsContraVerified(false);  
        getUser(); 
      } else if(resp.data.msg === "Err BD"){
        alert("Error al modificar el usuario");
      } 
      console.log(resp.data); 
    } catch (error) {
      console.log(error); 
      alert("Error al hacer la peticion"); 
    }
  }

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
                <img src={Apl} alt="Aplausos" />
                <p>115.5 M</p>
              </div>
              <div className="perfilDato">
                <img src={Seg} alt="Seguidores" />
                <p>20 M</p>
              </div>
              <div className="perfilDato">
                <img src={Correo} alt="Correo" />
                <p>{userInfo.Correo}</p>
              </div>

              <div className="perfilStatsRight">
                <div className="perfilDato">
                  <img src={Save} alt="guardardo" onClick={Guardados}/>
                </div>

                <div className="perfilDato">
                  <img src={Upload} alt="Upload" onClick={UploadPage}/>
                </div>

                <button className="admButton" onClick={handleEditarClick}>
                  EDITAR PERFIL
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="galeria">
          <div className="obra">
            <img
              src="https://www.dailyartmagazine.com/wp-content/uploads/2022/10/the-wounded-deer-768x574.jpg"
              alt="La noche estrellada"
            />
          </div>
          <div className="obra">
            <img
              src="https://www.moas.org/zupload/library/27171/-47039-2048x1070-0.jpg?ztv=20200501145353"
              alt="Fotografía artística"
            />
          </div>
          <div className="obra">
            <img
              src="https://www.singulart.com/blog/wp-content/uploads/2023/10/The-Broken-Column-Frida-Kahlo-848x530-1.jpg"
              alt="Arte moderno"
            />
          </div>
          <div className="obra">
            <img
              src="https://arthive.com/res/media/img/oy1000/work/478/291935@2x.jpeg"
              alt="Obra repetida"
            />
          </div>
          <div className="obra">
            <img
              src="https://shop.fatcatart.com/wp-content/uploads/2017/11/Kahlo_Two_fridas_one-cat-print-w.jpg"
              alt="Fotografía 2"
            />
          </div>
          <div className="obra">
            <img
              src="https://sonyawinner.com/wp-content/uploads/2025/01/Frida-Kahlo-Tree-of-Hope-Remain-Strong-.jpg"
              alt="Arte 2"
            />
          </div>
        </section>
      </main>

      {/* ⬇️ Modal del libro */}
      {mostrarLibro && (
        <div className="overlay" onClick={handleCerrarLibro}>
          <div className="conteinerMod">
            {/* Botón de cerrar */}
            <button
              className="cerrarModal"
              onClick={() => setMostrarLibro(false)}
              type="button"
            >
              ✕
            </button>

            <form onSubmit={updateUser} className="book" noValidate>
              <div className="page left">
                <label htmlFor="username">NOMBRE DE USUARIO:</label>
                <input
                  type="text"
                  id="username"
                  name="Nombre"
                  value={userInfo.Nombre}
                  onChange={handleChange}
                />

                <label htmlFor="email">CORREO:</label>
                <input
                  type="email"
                  id="email"
                  name="Correo"
                  value={userInfo.Correo}
                  onChange={handleChange}
                />

                <label htmlFor="password">CONTRASEÑA:</label>
                <input
                  type="password"
                  id="password"
                  name="Contra"
                  value = {contraActual}
                  onChange={handleTyping}
                  onBlur = {verificarContra} //este evento detecta cuando el usuario hace clic fuera del input 
                  className={errorMsg ? "input-error" : ""}
                  placeholder="Ingrese contraseña actual"
                />

                {errorMsg && <span className="error-text">{errorMsg}</span>}
                
                {isContraVerified && (
                  <input
                    type="password"
                    id="password"
                    name="Contra"
                    value= {contraNueva}
                    onChange={(e)=> setContraNueva(e.target.value)}
                    placeholder="Nueva contraseña"
                  />
                )}
  
                <label htmlFor="about">CUÉNTANOS SOBRE TI:</label>
                <textarea
                  id="about"
                  name="descripcion"
                  rows="4"
                  placeholder="Escribe algo sobre ti..."
                  value = {userInfo.descripcion}
                  onChange = {handleChange}
                ></textarea>
              </div>

              <div className="page right">
                <p className="subtitle">IMAGEN DE USUARIO</p>
                <div className="user-img">
                  <img
                    src={preview || "data:image/png;base64," + userInfo.Imagen}
                    alt="Imagen de usuario"
                  />
                </div>
                <div className="upload">
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/jpeg, image/png"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="profileImage" className="upload-btn">
                    Seleccionar imagen
                  </label>
                </div>  

                <button type="submit" className="btn-save">
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;
