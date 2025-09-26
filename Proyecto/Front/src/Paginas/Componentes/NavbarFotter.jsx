import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // nuevo archivo de estilos solo para el navbar

export function Navbar() {
  const nameUser = localStorage.getItem("user");
  const navigate = useNavigate();
  const location = useLocation();

  const Logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="navbar-custom">
      <h1 className="logo">ARTCONNECT</h1>

      <div className="links">
        {nameUser ? (
          <button className="logout-btn" onClick={Logout}>
            Cerrar sesión
          </button>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <Link to="/login" className="nav-link">
                Iniciar sesión
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register" className="nav-link">
                Registrarse
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer-custom">
      <p>
        Creado por <b>Angeles</b>
      </p>
    </footer>
  );
}
