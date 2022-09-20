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
    <p>API_URL: {window?._env_?.CATALOG_URL}</p>,
  </>
  );
}

export default App;
