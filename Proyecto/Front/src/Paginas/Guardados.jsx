import React, { useState, useEffect } from "react";
import "./CSS/Guardados.css";
import axios from "axios";

export function Guardados() {
  const [guardados, setGuardados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const userID = localStorage.getItem("userID");

  useEffect(() => {
    const fetchGuardados = async () => {
      try {
        const resp = await axios.get(`http://localhost:3001/guardados/${userID}`);
        setGuardados(resp.data);
        setCargando(false);
      } catch (err) {
        console.log(err);
        setCargando(false);
      }
    };

    fetchGuardados();
  }, [userID]);

  if (cargando) {
    return <div className="guardados-container"><p>Cargando...</p></div>;
  }

  return (
    <div className="guardados-container">
      <header className="guardados-header">
        <h1 className="titulo-guardados">OBRAS GUARDADAS</h1>
        <button 
          className="cerrar-btn" onClick={() => window.history.back()}
        >
          ✖
        </button>
      </header>

      {guardados.length === 0 ? (
        <p className="mensaje-vacio">Aún no has guardado ninguna obra 🖼️</p>
      ) : (
        <div className="galeria-guardados">
          {guardados.map((obra) => (
            <div key={obra.id_guardado} className="card-obra">
              <img src={obra.imagenPost} alt={obra.titulo} className="img-obra" />
              <div className="overlay">
                <p className="titulo-obra">
                  {obra.titulo} <br />
                  <span className="autor-obra">por {obra.nombreAutor}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Guardados;
