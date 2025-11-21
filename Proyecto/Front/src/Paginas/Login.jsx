import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/Login.css";
import { Navbar } from "./Componentes/NavbarFotter";
import Swal from "sweetalert2";


function Login() {
  const [correo, setCorre] = useState("");
  const [contra, setContra] = useState("");

  const redirect = useNavigate();

  useEffect(() => {
    // Limpiar la sesión al entrar al login
    localStorage.removeItem("user");
  }, []);

  const login = async (e) => {
    e.preventDefault();

    try {
      const respServer = await axios.post("http://localhost:3001/login", {
        mail: correo,
        pass: contra,
      });

      if (respServer.data.msg === "SI") {
        // Guardar la sesión del usuario
        localStorage.setItem("user", respServer.data.user);
        localStorage.setItem("userID", respServer.data.id); 

        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: "Inicio de sesión exitoso.",
          confirmButtonColor: "#a47d5e",
          timer: 1500,
          showConfirmButton: false,
        });
        // Redirigir
        redirect("/Home");
      } else if (respServer.data.msg === "NO") {
        Swal.fire({
          icon: "error",
          title: "Datos incorrectos",
          text: "Usuario no encontrado. Verifica tus datos 🥲",
          confirmButtonColor: "#a47d5e",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al procesar el login.",
        confirmButtonColor: "#a47d5e",
      });
    }
  };

  return (
    <div className="conteinerLogin">
      <Navbar />
      <main className="login-wrapper">
        <div className="ticket">
          <form onSubmit={login}>
            <input
              type="email"
              id="usuario"
              name="usuario"
              placeholder="Correo:"
              value={correo}
              onChange={(e) => setCorre(e.target.value)}
              required
            />

            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Contraseña:"
              value={contra}
              onChange={(e) => setContra(e.target.value)}
              required
            />

            <button type="submit">Entrar</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
