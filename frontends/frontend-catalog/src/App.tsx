import React from 'react';
import logo from './logo.svg';
import './App.css';
import ListaLibros from './components/ListaLibros';

function App() {
  return (<>
    <div className="toolbar">
      <img width="40" src={logo} />
      <span>Catalogo</span>
      <div className="spacer"></div>
    </div>
    <div className="content">
      <ListaLibros />
    </div>
<<<<<<< HEAD
=======
    <p>API_URL: {window?._env_?.CATALOG_URL}</p>,
>>>>>>> 2c6ea4df2fe631283df8d00d962a1bf39fe9066a
  </>
  );
}

export default App;
