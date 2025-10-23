
import "./CSS/Perfil.css";
import { NavbarPerfil } from "./Componentes/NavbarPerfil";

import Apl from "./CSS/Images/Perfil/Aplausos.png";
import Seg from "./CSS/Images/Perfil/Seguidores.png";
import Correo from "./CSS/Images/Perfil/Correo.png";

export const PerfilArtista = () => {
  return (
    <div className="perfilContainer">
      <NavbarPerfil />

      <main className="perfilContent">
        <section className="perfilHeader">
          <div className="perfilAvatar">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/250px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg"
              alt="Avatar"
            />
          </div>

          <div className="perfilInfo">
            <h1>VAN GOGH</h1>

            <div className="perfilStats">
              <div className="perfilDato">
                <img
                  src ={Apl}
                  alt="Aplausos"
                />
                <p>123.5 M</p>
              </div>
              <div className="perfilDato">
                <img
                  src ={Seg}
                  alt="Seguidores"
                />
                <p>10 M</p>
              </div>
              <div className="perfilDato">
                <img
                  src ={Correo}
                  alt="Correo"
                />
                <p>correo@gmail.com</p>
              </div>
            </div>
          </div>

          <button className="admButton">ADMIRAR</button>
        </section>

        <section className="galeria">
          <div className="obra">
            <img
              src="https://beyondvangogh.com/wp-content/uploads/2024/04/Van-Gogh-Home-775x520.jpg"
              alt="La noche estrellada"
            />
          </div>
          <div className="obra">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
              alt="Fotografía artística"
            />
          </div>
          <div className="obra">
            <img
              src="https://media.newyorker.com/photos/647a15fec91efd6c449e2964/1:1/w_2030,h_2030,c_limit/Arn-Van-Gogh-Secondary-1.jpg"
              alt="Arte moderno"
            />
          </div>
          <div className="obra" >
            <img
              src="https://artprojectsforkids.org/wp-content/uploads/2024/05/Draw-a-Van-Gogh-Wheatfield.jpg"
              alt="Obra repetida"
            />
          </div>
          <div className="obra">
            <img
              src="https://cdn.britannica.com/78/69678-050-491A5ED8/Bedroom-oil-canvas-Vincent-van-Gogh-Art-1889.jpg"
              alt="Fotografía 2"
            />
          </div>
          <div className="obra">
            <img
              src="https://files.ocula.com/ri/94/9428b9b7-b463-48f1-804e-089fe21ebc9d/1510/850/vincent-van-gogh-contemporary-artist.jpg"
              alt="Arte 2"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PerfilArtista;
