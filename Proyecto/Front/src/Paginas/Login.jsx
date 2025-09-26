import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/Login.css";
import { Navbar } from "./Componentes/NavbarFotter";

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

        // Redirigir
        redirect("/Home");
      } else if (respServer.data.msg === "NO") {
        alert("Usuario no encontrado (verifique sus datos)");
      }
    } catch (error) {
      console.log(error);
      alert("Error al procesar el Login");
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
