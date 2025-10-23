// import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './Paginas/Register';
import Login from './Paginas/Login';
import Landing from './Paginas/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Login" element={<Login />}></Route>        
        <Route path='/Landing' element={<Landing />}></Route>'

      </Routes>
    </BrowserRouter>
  );
}

export default App;
