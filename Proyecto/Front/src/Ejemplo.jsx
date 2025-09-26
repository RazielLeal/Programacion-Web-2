import 'bootstrap/dist/css/bootstrap.css';

function Ejemplo() {
     const usuario = {
            nombre: 'Maria',
            edad: 25,
            login: false,
            foto: "https://png.pngtree.com/thumb_back/fh260/background/20220809/pngtree-round-button-in-cobalt-and-cyan-colors-for-user-profile-photo-image_19439274.jpg"
        }
    return ( 
        <div class="card" style={{ width: "18rem" }}>
            <img src={usuario.foto} class="card-img-top" alt="..."/>
            <div class="card-body">
                <h5 class="card-title">Bienvenido {usuario.nombre}</h5>
                <p class="card-text">
                    {usuario.nombre} tu tienes {usuario.edad} y
                    {usuario.login ? " eres usuario" : " no eres usuario"}
                </p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
     );
}

export default Ejemplo;