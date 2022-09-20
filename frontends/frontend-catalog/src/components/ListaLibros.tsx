import axios from "axios";
import React, { useEffect, useState } from "react";

//direccion del servidor
//const host = "http://164.92.73.70:8081";
const host = "http://localhost:8081";
// const host = "http://backend-catalog-cont:8081";

interface library {
  titulo: string;
  isbn: string;
  autor: string;
  descripcion: string;
  valor: string;
  unidades: number;
}
const InitialStateLibrary: library = {
  titulo: "",
  isbn: "",
  autor: "",
  descripcion: "",
  valor: "",
  unidades: 0,
};
export default function ListaLibros() {
  const [libros, setlibros] = useState<library[]>([]);
  const [libraryData, setlibraryData] = useState(InitialStateLibrary);
  useEffect(() => {
    axios.get(host + "/api/getlibros").then((res) => {
      setlibros(res.data);
    });
  }, []);

  function EnviarDatos() {
    axios
      .post(
        host +
          `/api/agregarlibro?titulo=${libraryData.titulo}&ISBN=${libraryData.isbn}&autor=${libraryData.autor}&resena=${libraryData.descripcion}&valor=${libraryData.valor}&unidades=${libraryData.unidades}`
      )
      .then((res) => {
        var datoslibros = JSON.parse(JSON.stringify(libros));
        var index = datoslibros.findIndex(
          (e: library) => e.isbn === libraryData.isbn
        );
        if (index === -1) {
          datoslibros.push(libraryData);
          alert("nuevo libro agregada");
        } else {
          datoslibros[index] = libraryData;
          alert("libro actulizado");
        }
        setlibros(datoslibros);
      });
  }
  function editar(libro: library) {
    setlibraryData(libro);
  }
  function deleteitem(libro: library) {
    axios.delete(host + `/api/deletelibro?ISBN=${libro.isbn}`).then((res) => {
      setlibros(libros.filter((e) => e !== libro));
    });
  }
  function ChangesValues(property: string, value: any) {
    var data = JSON.parse(JSON.stringify(libraryData));
    data[property] = value;
    setlibraryData(data);
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@300&family=Roboto+Slab&display=swap"
        rel="stylesheet"
      />
      <div className="container">
        {libros.map((libro, index) => {
          return (
            <div className="card-container" key={index}>
              <div className="card-title">
                <h1>{libro.titulo}</h1>
              </div>
              <div className="name-container">
                <h4>Autor:</h4>
                <p>{libro.autor}</p>
              </div>
              <div className="Isbn">
                <h4>ISBN:</h4>
                <p>{libro.isbn}</p>
              </div>
              <div className="card-content">
                <h4>Descripción</h4>
                <p>{libro.descripcion}</p>
              </div>
              <div className="info">
                <div className="Pecant">
                  <div className="precio">
                    <h4>Precio:</h4>
                    <p>{libro.valor}</p>
                  </div>
                  <div className="cantidad">
                    <h4>Cantidad:</h4>
                    <p>{libro.unidades}</p>
                  </div>
                </div>

                <div className="botones">
                  <button
                    className="eliminar"
                    onClick={() => deleteitem(libro)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="editar"
                    onClick={() => {
                      editar(libro);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="agregar-container">
        <div className="c1">
          <label>ISBN</label>
          <input
            type="text"
            value={libraryData.isbn}
            onChange={(evt) => {
              ChangesValues("isbn", evt.target.value);
            }}
          />
          <label>Descripcion </label>
          <input
            type="text"
            value={libraryData.descripcion}
            onChange={(evt) => {
              ChangesValues("descripcion", evt.target.value);
            }}
          />
        </div>
        <div className="c2">
          <label>Titulo </label>
          <input
            type="text"
            value={libraryData.titulo}
            onChange={(evt) => {
              ChangesValues("titulo", evt.target.value);
            }}
          />
          <label>Autor </label>
          <input
            type="text"
            value={libraryData.autor}
            onChange={(evt) => {
              ChangesValues("autor", evt.target.value);
            }}
          />
        </div>
        <div className="c3">
          <label>Valor </label>
          <input
            type="number"
            value={libraryData.valor}
            onChange={(evt) => {
              ChangesValues("valor", evt.target.value);
            }}
          />
          <label>Unidades </label>
          <input
            type="number"
            value={libraryData.unidades}
            onChange={(evt) => {
              ChangesValues("unidades", evt.target.value);
            }}
          />
        </div>

        <div className="c4">
          <button className="boton" onClick={() => EnviarDatos()}>
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
