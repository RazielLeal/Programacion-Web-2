// import "./CSS/Home.css";
// import { NavbarPerfil } from "./Componentes/NavbarPerfil";
// import { FooterSuelo } from "./Componentes/footer-suelo";
// import { useState } from "react";
// import { ArtworkItem } from "./Componentes/ArtworkItem";

// // AQUI VAN LAS IMPORTACIONES DE LAS OBRAS Y AVATARES CON LA BASE DE DATOS 
// import obra1 from './CSS/Images/images-home/cuadro3.png';
// import obra2 from './CSS/Images/images-home/cuadro4.png';
// import obra3 from './CSS/Images/images-home/mujer2.png';
// import avatarGenerico from './CSS/Images/serpiente.jpeg';

// const allArtworks = [
//   { id: 1, artworkUrl: obra1, artistName: 'Artista 1', artistAvatar: avatarGenerico },
//   { id: 2, artworkUrl: obra2, artistName: 'Artista 2', artistAvatar: avatarGenerico },
//   { id: 3, artworkUrl: obra3, artistName: 'Artista 3', artistAvatar: avatarGenerico },
//   { id: 4, artworkUrl: obra1, artistName: 'Artista 4', artistAvatar: avatarGenerico },
//   { id: 5, artworkUrl: obra2, artistName: 'Artista 5', artistAvatar: avatarGenerico },
//   { id: 6, artworkUrl: obra3, artistName: 'Artista 6', artistAvatar: avatarGenerico },
// ];

// const ITEMS_PER_PAGE = 3;

// function Home() {

//   const [currentPage, setCurrentPage] = useState(0);
//   const totalPages = Math.ceil(allArtworks.length / ITEMS_PER_PAGE);

//   const nextPage = () => {
//     setCurrentPage((currentPage + 1) % totalPages);
//   };

//   const prevPage = () => {
//     setCurrentPage((currentPage - 1 + totalPages) % totalPages);
//   };

//   const startIndex = currentPage * ITEMS_PER_PAGE;
//   const currentItems = allArtworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const trackOffset = currentPage * -100;

//   return (
//     <main className="main-home">
//       <NavbarPerfil />

//       {/* Este div ahora es el CONTENEDOR del carrusel */}
//       <div className="flex-home">
        
//         {/* --- Flecha Izquierda --- */}
//         <button onClick={prevPage} className="carousel-arrow left-arrow">
//           &lt;
//         </button>

//         <div className="carousel-content-window">
          
//           {/* 2. Esta es la "tira" que se moverá */}
//           <div 
//             className="carousel-track"
//             // 3. Aplicamos el desplazamiento aquí
//             style={{ transform: `translateX(${trackOffset}%)` }}
//           >
//             {/* 4. Renderizamos TODOS los items */}
//             {allArtworks.map((item) => (
//               <ArtworkItem
//                 key={item.id}
//                 artworkImage={item.artworkUrl}
//                 artistImage={item.artistAvatar}
//                 artistName={item.artistName}
//               />
//             ))}
//           </div>
//         </div>
//         {/* --- FIN DEL JSX MODIFICADO --- */}
//         {/* --- Flecha Derecha --- */}
//         <button onClick={nextPage} className="carousel-arrow right-arrow">
//           &gt;
//         </button>

//       </div>
      
//       <FooterSuelo />
//     </main>
//   );
// }

// export default Home;

import "./CSS/Home.css";
import { NavbarPerfil } from "./Componentes/NavbarPerfil";
import { FooterSuelo } from "./Componentes/footer-suelo";
import { useState } from "react";
import { ArtworkItem } from "./Componentes/ArtworkItem";
// 1. IMPORTA EL NUEVO COMPONENTE MODAL (que crearemos en el paso 3)
import { ArtworkModal } from "./Componentes/ArtworkModal";

// (Tus imports de imágenes y el array 'allArtworks' se quedan igual)
import obra1 from './CSS/Images/images-home/cuadro3.png';
import obra2 from './CSS/Images/images-home/cuadro4.png';
import obra3 from './CSS/Images/images-home/mujer2.png';
import avatarGenerico from './CSS/Images/serpiente.jpeg';

// ... (al inicio de Home.jsx)
const allArtworks = [
  { id: 1, artworkUrl: obra1, title: 'La Noche Estrellada', artistName: 'Van Gogh', artistAvatar: avatarGenerico, likes: '123.5M', comments: [{user: 'Usuario1', text: 'Comentario 1'}, {user: 'Usuario2', text: 'Comentario 2'}, {user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 3'},{user: 'Usuario3', text: 'Comentario 1000'}] },
  { id: 2, artworkUrl: obra2, title: 'Obra 2', artistName: 'Artista 2', artistAvatar: avatarGenerico, likes: '2.5M', comments: [] },
  { id: 3, artworkUrl: obra3, title: 'La Dama', artistName: 'Artista 3', artistAvatar: avatarGenerico, likes: '500k', comments: [{user: 'Critico', text: 'Interesante.'}] },
  { id: 4, artworkUrl: obra1, title: 'Obra 4', artistName: 'Artista 4', artistAvatar: avatarGenerico, likes: '10M', comments: [] },
  { id: 5, artworkUrl: obra2, title: 'Obra 5', artistName: 'Artista 5', artistAvatar: avatarGenerico, likes: '1k', comments: [] },
  { id: 6, artworkUrl: obra3, title: 'Obra 6', artistName: 'Artista 6', artistAvatar: avatarGenerico, likes: '3.3M', comments: [] },
];

const ITEMS_PER_PAGE = 3;


function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  
  // 2. AÑADE EL ESTADO PARA EL MODAL
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const totalPages = Math.ceil(allArtworks.length / ITEMS_PER_PAGE);

  const nextPage = () => { /* ... (tu función) ... */ };
  const prevPage = () => { /* ... (tu función) ... */ };
  const trackOffset = currentPage * -100;

  // 3. AÑADE FUNCIONES PARA ABRIR Y CERRAR
  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <main className="main-home">
      <NavbarPerfil />

      <div className="flex-home">
        <button onClick={prevPage} className="carousel-arrow left-arrow">
          &lt;
        </button>

        <div className="carousel-content-window">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(${trackOffset}%)` }}
          >
            {allArtworks.map((item) => (
              <ArtworkItem
                key={item.id}
                // 4. PASA LA FUNCIÓN AL HIJO
                onArtworkClick={() => handleArtworkClick(item)}
                // (Pasamos los props de siempre)
                artworkImage={item.artworkUrl}
                artistImage={item.artistAvatar}
                artistName={item.artistName}
              />
            ))}
          </div>
        </div>
        
        <button onClick={nextPage} className="carousel-arrow right-arrow">
          &gt;
        </button>
      </div>
      
      <FooterSuelo />

      {/* 5. RENDERIZA EL MODAL (si hay una obra seleccionada) */}
      {selectedArtwork && (
        <ArtworkModal
          allArtworks={allArtworks}          // <-- Pasa la lista completa
          currentArtwork={selectedArtwork}   // <-- Pasa el item clicado
          onClose={closeModal}
        />
      )}
    </main>
  );
}

export default Home;