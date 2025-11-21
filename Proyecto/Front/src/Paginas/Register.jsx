import { useState } from "react";
import axios from "axios";
import "./CSS/Register.css"; // Usa el estilo que subiste
import { Navbar } from "./Componentes/NavbarFotter";
import Swal from "sweetalert2";


export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contra, setContra] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState("./Images/descarga (2).jpeg");

  const sendDatos = async (e) => {
    e.preventDefault();


    // VALIDACIONES
    //VALIDACION NOMBRE
    if (nombre.length > 150) {
      Swal.fire({
        icon: "info",
        title: "Nombre demasiado largo",
        text: "El nombre no puede tener más de 150 caracteres.",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }

    //VALIDACION CORREO
    const emailRegex = /^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com)$/;
    if (!emailRegex.test(correo)) {
      Swal.fire({
        icon: "warning",
        title: "Correo no válido",
        text: "Por favor, introduce un correo electrónico válido (gmail, outlook o hotmail).",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }
    //VALIDACION CONTRASEÑA
    const passRegexMayuscula = /[A-Z]/;
    const passRegexNumero = /[0-9]/;
    const passRegexEspecial = /[.,;!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (contra.length < 8) { 
      Swal.fire({
        icon: "info",
        title: "Contraseña muy corta",
        text: "La contraseña debe tener al menos 8 caracteres.",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }
    if (!passRegexMayuscula.test(contra)) {
      Swal.fire({
        icon: "info",
        title: "Falta una mayúscula",
        text: "La contraseña debe contener al menos una letra mayúscula.",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }
    if (!passRegexNumero.test(contra)) {
      Swal.fire({
        icon: "info",
        title: "Falta un número",
        text: "La contraseña debe contener al menos un número.",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }
    if (!passRegexEspecial.test(contra)) {
       Swal.fire({
        icon: "info",
        title: "Falta un carácter especial",
        text: "La contraseña debe contener al menos un carácter especial (ej. .,;!@#$).",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }

    //VALIDACION IMAGEN
    if (archivo && !archivo.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Archivo no válido",
        text: "El archivo seleccionado no es una imagen. Elige un archivo de imagen.",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }
    if (!archivo) {
      Swal.fire({
        icon: "info",
        title: "Imagen requerida",
        text: "Por favor, selecciona una imagen. Es obligatorio.",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }
    const tamanoMaximo = 5 * 1024 * 1024; // 5 MB en bytes
    if (archivo.size > tamanoMaximo) {
      Swal.fire({
        icon: "warning",
        title: "Imagen demasiado pesada",
        text: "La imagen no puede pesar más de 5 MB.",
        confirmButtonColor: "#a47d5e",
      });
      return;
    }

    const frmData = new FormData();
    frmData.append("name", nombre);
    frmData.append("mail", correo);
    frmData.append("pass", contra);
    frmData.append("file", archivo);
    

    try {
      const respuesta = await axios.post(
        "http://localhost:3001/register",
        frmData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (respuesta.data.msg === "Registrado") {
        Swal.fire({
          icon: "success",
          title: "Usuario registrado 🌟",
          text: "Tu cuenta se ha creado correctamente.",
          confirmButtonColor: "#a47d5e",
          timer: 1800,
          showConfirmButton: false,
        });
        // Limpiar el formulario
        setNombre("");
        setCorreo("");
        setContra("");
        setArchivo(null);
        setPreview("./Images/descarga (2).jpeg");
      } else if (respuesta.data.msg === "ErrorDB") {
        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: "Ocurrió un error al registrar al usuario.",
          confirmButtonColor: "#a47d5e",
        });
      }
      console.log(respuesta.data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "Hubo un problema al procesar la petición.",
        confirmButtonColor: "#a47d5e",
     });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setArchivo(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="conteinerRegister">
      <Navbar />

      <main className="container">
        <h2 className="title">REGÍSTRATE AQUÍ</h2>

        <form onSubmit={sendDatos} noValidate >
          <div className="book">
            <div className="page left">
            <label htmlFor="username">NOMBRE DE USUARIO:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label htmlFor="email">CORREO:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <label htmlFor="password">CONTRASEÑA:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={contra}
              onChange={(e) => setContra(e.target.value)}
            />
          </div>
          
          <div className="page right">
            <p className="subtitle">IMAGEN DE USUARIO</p>
            <div className="user-img">
              <img src={preview} alt="Imagen de usuario" />
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

            <button type="submit" className="btn"></button>
          </div>

          </div>
          
        </form>
      </main>
    </div>
  );
}
