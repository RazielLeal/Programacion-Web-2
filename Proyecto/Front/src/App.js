// import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './Paginas/Register';
import Login from './Paginas/Login';
import Landing from './Paginas/Landing';
import PerfilArtista from './Paginas/PerfilArtista';
import PerfilUsuario from './Paginas/PerfilUsuario';
import { PublicarObra } from './Paginas/PublicarObra';
import { Guardados } from './Paginas/Guardados';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Login" element={<Login />}></Route>        
        <Route path='/Landing' element={<Landing />}></Route>'
        <Route path="/PerfilArtista" element={<PerfilArtista />}></Route>
        <Route path="/PerfilUsuario" element={<PerfilUsuario />}></Route>
        <Route path="/PublicarObra" element={<PublicarObra />}></Route>
        <Route path="/Guardados" element={<Guardados />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
