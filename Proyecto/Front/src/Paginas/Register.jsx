import { useState } from "react";
import axios from "axios";
import "./CSS/Register.css"; // Usa el estilo que subiste
import { Navbar } from "./Componentes/NavbarFotter";


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
      alert("El nombre no puede tener más de 150 caracteres.");
      return; // Detiene la ejecución si la validación falla
    }

    //VALIDACION CORREO
    const emailRegex = /^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com)$/;
    if (!emailRegex.test(correo)) {
      alert("Por favor, introduce un correo electrónico válido.");
      return;
    }
    //VALIDACION CONTRASEÑA
    const passRegexMayuscula = /[A-Z]/;
    const passRegexNumero = /[0-9]/;
    const passRegexEspecial = /[.,;!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (contra.length < 8) { // Buena práctica: añadir una longitud mínima
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!passRegexMayuscula.test(contra)) {
      alert("La contraseña debe contener al menos una letra mayúscula.");
      return;
    }
    if (!passRegexNumero.test(contra)) {
      alert("La contraseña debe contener al menos un número.");
      return;
    }
    if (!passRegexEspecial.test(contra)) {
      alert("La contraseña debe contener al menos un caracter especial (ej. .,;!@#$).");
      return;
    }

    //VALIDACION IMAGEN
    if (archivo && !archivo.type.startsWith("image/")) {
      alert("El archivo seleccionado no es una imagen. Por favor, elige un archivo de imagen.");
      return;
    }
    if (!archivo) {
      alert("Por favor, selecciona una imagen. Es obligatorio.");
      return;
    }
    const tamanoMaximo = 5 * 1024 * 1024; // 5 MB en bytes
    if (archivo.size > tamanoMaximo) {
      alert("La imagen no puede pesar más de 5 MB.");
      return;
    }
    // --- FIN DE VALIDACIONES ---

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
        alert("Usuario registrado");
        // Limpiar el formulario
        setNombre("");
        setCorreo("");
        setContra("");
        setArchivo(null);
        setPreview("./Images/descarga (2).jpeg");
      } else if (respuesta.data.msg === "ErrorDB") {
        alert("Error al registrar usuario");
      }
      console.log(respuesta.data);
    } catch (error) {
      console.log(error);
      alert("Error en la petición");
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
