// import { useEffect, useState } from "react";
// import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./CSS/Landing.css";
import { FooterSuelo } from "./Componentes/footer-suelo";



function Landing() {
  // const nameUser = localStorage.getItem("user");

  const navigate = useNavigate();
  
  const LoginredLanding = () => {    
    navigate("/login");
  };

  return (
    <>
      <main className="main-landing">

        <div className="grid-landing">
          <div className="centered-container">
          <div className="title-landing">ARTCONNECT</div>
          <button onClick={LoginredLanding} className="login-red-landing" >COMIENZA TU EXPERIENCIA</button>
          </div>

          <div className="mujer-izq"></div>
          <div className="mujer2"></div>
          <div className="cuadro3"></div>
          <div className="cuadro4"></div>
          <div className="monito"></div>
          <div className="rope"></div>
          <div className="estatua"></div>

        </div>

        
        <FooterSuelo />
      </main>
    </>
  );
}

export default Landing;
