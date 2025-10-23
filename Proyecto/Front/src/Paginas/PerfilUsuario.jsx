import React, { useState } from "react";
import "./CSS/Perfil.css";
import { NavbarPerfil } from "./Componentes/NavbarPerfil";
import { useNavigate } from "react-router-dom";

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

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="perfilContainer">
      <NavbarPerfil />

      <main className="perfilContent">
        <section className="perfilHeader">
          <div className="perfilAvatar">
            <img
              src="https://static.wixstatic.com/media/4236a4_aa83eff30f804e98bf49d1092fdec04c~mv2.jpg/v1/fill/w_280,h_392,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Frida%20Kahlo.jpg"
              alt="Avatar"
            />
          </div>

          <div className="perfilInfo">
            <h1>Frida Kahlo</h1>

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
                <p>fridakahalo@gmail.com</p>
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

            <form className="book" >
              <div className="page left">
                <label htmlFor="username">NOMBRE DE USUARIO:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                />

                <label htmlFor="email">CORREO:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                />

                <label htmlFor="password">CONTRASEÑA:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Nueva contraseña"
                />

                <label htmlFor="about">CUÉNTANOS SOBRE TI:</label>
                <textarea
                  id="about"
                  name="about"
                  rows="4"
                  placeholder="Escribe algo sobre ti..."
                ></textarea>
              </div>

              <div className="page right">
                <p className="subtitle">IMAGEN DE USUARIO</p>
                <div className="user-img">
                  <img
                    src={preview || "https://static.wixstatic.com/media/4236a4_aa83eff30f804e98bf49d1092fdec04c~mv2.jpg/v1/fill/w_280,h_392,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Frida%20Kahlo.jpg"}
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

                <button type="button" className="btn">
                  Guardar
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
