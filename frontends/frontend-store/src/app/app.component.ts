import { Component, EventEmitter } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatSelectChange } from '@angular/material/select';
import { environment } from './../environments/environment';

export interface Review {
  usuario: string,
  isbn: string,
  estrellas: number,
  comentario: string
}
export interface library {
  titulo: string, isbn: string, autor: string, descripcion: string, valor: string;
  unidades: number;
}
interface Cart { id: string, isbn: string, cantidad: number }
interface CartRelation { [id: string]: CartDataAngular }
interface CartDataAngular { libro: library, cant: number }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /*
  hostreviews = "http://localhost:3000"//direccion del servidor de review (Express)
  hostlibros = "http://localhost:8081"//direccion del servidor de libros (spring)
  hoststore = "http://localhost:8082"//direccion del servidor de la tienda (spring)
*/
  hostreviews = environment.reviewsUrl; //direccion del servidor de review (Express)
  hostlibros = environment.catalogUrl; //direccion del servidor de libros (spring)
  hoststore = environment.storeUrl; //direccion del servidor de la tienda (spring)


  libros: library[] = [];
  reviews: Review[] = [];
  usuario = "student";
  carrito: CartRelation = {};
  sendDataCarrito: boolean = false;

  detailsData: Review[] = [];
  currentLibro: any = {};
  get ShowDetails() { return this.state == "detalles" }

  state: "inicio" | "carrito" | "detalles" = "inicio";

  SetState(value: "inicio" | "carrito" | "detalles") { this.state = value; }

  GetTotal() {
    var keys = Object.keys(this.carrito);
    let total = 0;
    for (let name of keys) {
      total += this.carrito[name].cant;
    }
    return total;
  }
  KeysObjet = Object.keys;
  round = Math.round;

  GetMeanStars(isbn: string) {
    var mean = 0;
    var lista = this.reviews.filter(value => value.isbn == isbn)
    lista.forEach(element => { 
      mean += element.estrellas;
    })
    if (lista.length != 0)
      mean = mean / lista.length;
    return Number(mean.toFixed(2));
  }
  CountReviews(isbn: string) {
    return this.reviews.filter(value => value.isbn == isbn).length;
  }

  constructor(private http: HttpClient) {
    this.init(http)
  }
  init(http: HttpClient) {
    http.get(this.hostlibros + "/api/getlibros").subscribe((res) => {
      this.libros = res as library[];
    })

    this.GetCartShopUser();

    http.get(this.hostreviews + "/reviews").subscribe(res => {
      console.log("get reviews", res);
      this.reviews = res as Review[];
    });
  }

  GetCartShopUser() {
    this.http.get(this.hoststore + `/api/getcart?usuario=${this.usuario}`).subscribe((res) => {
      console.log("getCart", res);
      this.carrito = {};
      for (const item of res as Cart[]) {
        var libro = this.libros.find((e) => e.isbn == item.isbn)
        if (libro)
          this.carrito[item.isbn] = { libro: libro, cant: item.cantidad };
      }
    })
  }

  onclickAddCart(isbn: string) {
    console.log("call onclick")
    var cart = this.carrito[isbn]
    if (cart) {
      if (cart.cant + 1 < cart.libro.unidades)
        this.addcart(isbn, cart.cant + 1)
    } else
      this.addcart(isbn, 1);
  }

  addcart(isbn: string, cant: number) {

    //var index = this.storeCard.findIndex((item) => item == isbn)
    if (!this.carrito[isbn]/*index == -1*/) {
      //this.storeCard.push(isbn);
      var libro = this.libros.find((e) => e.isbn == isbn)
      if (libro)
        this.carrito[isbn] = { libro: libro, cant: cant };
    } else {
      this.carrito[isbn].cant = cant;
    }

    this.http.post(this.hoststore + `/api/addcart?usuario=${this.usuario}&isbn=${isbn}&cantidad=${cant}`, null)
      .subscribe((res) => {
        console.log("addcart", res)
      })
  }
  onCantChange(evt: MatSelectChange, isbn: string) {
    this.addcart(isbn, evt.value);
  }

  deletecart(isbn: string) {
    delete this.carrito[isbn];
    this.http.delete(this.hoststore + `/api/deletecart?usuario=${this.usuario}&isbn=${isbn}`).subscribe((res) => {
      console.log(res)
    })
  }

  ChangeUser() {
    console.log(this.usuario)
    this.carrito = {};
    this.init(this.http)
  }

  detalle(item: library) {
    this.currentLibro = item;
    this.detailsData = this.reviews.filter(value => value.isbn == item.isbn).sort((a, b) => b.estrellas - a.estrellas);
    this.SetState("detalles")
  }

  Comprar() {
    console.log(this.carrito);
    this.sendDataCarrito = true;
    this.http.post(this.hoststore + `/api/buycart?usuario=${this.usuario}`, null)
      .subscribe((res: any) => {
        console.log(res);
        this.sendDataCarrito = false;
        if (res.status == "ERROR")
          window.alert("En este momento no podemos procesar su compra, intente mas tarde");
        else
          this.GetCartShopUser();
      })
  }

}
