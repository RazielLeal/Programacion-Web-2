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

import axios from "axios"; 
import { useEffect } from "react"; 

const ITEMS_PER_PAGE = 3;


function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);

  const userID = localStorage.getItem("userID");  
  const [publicaciones, setPublicaciones] = useState([]); //para guardar la informacion de cada una de las publicaciones 
  const [postIdSeleccionado, setIdPostSeleccionado] = useState(null); //flag para saber en que momento selecciona un post 

  const nextPage = () => { 
    const totalItems = publicaciones.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const maxNegativeOffset = -((totalPages - 1) *100); 
    if(trackOffset > maxNegativeOffset){
      setTrackOffset((prev) => prev - 100); 
    }
  };
  const prevPage = () => { 
    if(trackOffset < 0) {
      setTrackOffset((prev) => prev + 100); 
    }
  };

  //cada vez que se renderice el componente se cargaran las publicaciones 
  useEffect(()=>{
    const getFeed = async ()=>{
      try {
        const resp = await axios.get("http://localhost:3001/feed"); 
        setPublicaciones(resp.data); 
      } catch (error) {
        console.log("Error al cargar la feed:", error); 
      }
    }
    getFeed(); 
  }, [])

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
            {publicaciones.map((p) => (
              <ArtworkItem
                key={p.id_publicacion}
                artworkImage={p.imagenPost}
                artistImage={p.imagenUsuario}
                artistName={p.nombreUsuario}
                idUser = {p.idUsuario}
                onArtworkClick={() => {
                    console.log("2. Clic recibido en el PADRE (Home). ID:", p.id_publicacion);
                    setIdPostSeleccionado(p.id_publicacion);
                }}
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
      {postIdSeleccionado && (
        <ArtworkModal
          listaPublicaciones={publicaciones}
          initialId={postIdSeleccionado} 
          onClose={()=> setIdPostSeleccionado(null)}
        />
      )}
    </main>
  );
}

export default Home;