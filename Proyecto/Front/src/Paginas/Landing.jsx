// import { useEffect, useState } from "react";
// import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./CSS/Landing.css";



function Landing() {
  // const nameUser = localStorage.getItem("user");

  const navigate = useNavigate();
  
  const LoginredLanding = () => {    
    navigate("/login");
  };

  return (
    <>
      {/* <Navbar /> */}
      <main className="main-home">
        <div className="centered-container">
          <div className="title-home">ARTCONNECT</div>
          <button onClick={LoginredLanding} className="login-red-home" >COMIENZA TU EXPERIENCIA</button>
        </div>

        <div className="mujer-izq"></div>
        <div className="mujer2"></div>
        <div className="cuadro3"></div>
        <div className="cuadro4"></div>
        <div className="monito"></div>
        <div className="rope"></div>
        <div className="estatua"></div>
        <footer className="footer-home"></footer>
      </main>
    </>
  );
}

export default Landing;
