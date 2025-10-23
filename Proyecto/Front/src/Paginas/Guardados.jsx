import React, { useState } from "react";
import "./CSS/Guardados.css";

export function Guardados() {
  // 🔹 Ejemplo de imágenes guardadas (puedes reemplazar por datos del backend después)
  const [guardados] = useState([
    { id: 1, img: "https://www.ttamayo.com/wp-content/uploads/2020/07/starry_night_full-1024x811.jpg", titulo: "La noche estrellada" },
    { id: 2, img: "https://images.unsplash.com/photo-1519681393784-d120267933ba", titulo: "Reflejos urbanos" },
    { id: 3, img: "https://arthive.com/res/media/img/oy1000/work/3ff/299075.webp", titulo: "El Arte de vivir" },
    { id: 4, img: "https://www.ttamayo.com/wp-content/uploads/2020/07/leonardo_da_vinci_-_mona_lisa_louvre_paris.jpg", titulo: "La Mona Lisa" },
    { id: 5, img: "https://www.ttamayo.com/wp-content/uploads/2020/07/825px-the_scream_by_edvard_munch_1893_-_nasjonalgalleriet.png.webp", titulo: "El Grito" },
    { id: 6, img: "https://www.ttamayo.com/wp-content/uploads/2020/07/1021px-the_kiss_-_gustav_klimt_-_google_cultural_institute.jpg", titulo: "El Beso" },
  ]);

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
            <div key={obra.id} className="card-obra">
              <img src={obra.img} alt={obra.titulo} className="img-obra" />
              <div className="overlay">
                <p className="titulo-obra">{obra.titulo}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
