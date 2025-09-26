import { Navbar } from "./Componentes/NavbarFotter";

function Home() {
  const nameUser = localStorage.getItem("user");

  return (
    <>
      <Navbar />
      <main className="container my-5">
        <h1 className="text-center">
          {nameUser ? `¡Bienvenido, ${nameUser}!` : "¡Bienvenido a MiApp!"}
        </h1>
        <p className="text-center">
          Esta es la página de inicio de tu aplicación React.
        </p>
      </main>
    </>
  );
}

export default Home;
