import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild, HostListener, AfterViewInit,ChangeDetectorRef } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CategoriasService } from '../../services/categorias.service';
//// Modulos 
import * as $ from 'jquery'
import * as bootstrap from "bootstrap";

//// MODELOS
import { Pagination } from 'src/app/models/pagination';
import { Products } from 'src/app/models/products';0
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'] 
})
export class ProductsComponent implements OnInit {

  
  data     : string = '';
  products : Products = {
    id: '',
    nombre:'',
    descripcion:'',
    cantidad:'',
    precio:'',
    categoria:''
  }
  NewProducts : Products = { 
    nombre:'',
    descripcion:'',
    cantidad:'',
    precio:'',
    categoria:''
  }
  categories: any = [];
  productos : any = [];
  pagination: any = [];
 
   
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(  private productsservice:ProductsService, 
                private activatedRoute: ActivatedRoute, 
                private categoriasservice:CategoriasService,
                private toastr           : ToastrService
               ) { }

  ngOnInit(): void {
    this.getProducts();
    this.GetCategories();
  }

  KeySearch(){
    this.pagination.current_page = 0;
    this.getProducts();
  }

  changePage(page: number):void{
    this.pagination.current_page = page;
    this.getProducts();
  }

  GetCategories():void {
    this.categoriasservice.getCategorias('',0).subscribe(
      (res:any) => {
        this.categories = res.categories.data
      }
    )
  } 

  

  getProducts():void{
    this.productsservice.getProducts(this.data, this.pagination.current_page).subscribe(
      ( res:any) => {
        this.productos  = res.productos.data,
        this.pagination = res.pagination
      },
      (err: any) => console.error(err)
    )
  }

  NuevosProductos(): void {

    this.productsservice.saveProductos(this.NewProducts)
    .subscribe(
      ( res:any) => {
 
        this.getProducts();
        this.NewProducts.id          = '';
        this.NewProducts.nombre      = '';
        this.NewProducts.descripcion = '';
        this.NewProducts.cantidad    = '';
        this.NewProducts.precio      = '';
        this.NewProducts.categoria   = ''; 
        //this.router.navigate(['/clientes']);
        this.toastr.success('Registro agregado'); 

        $('#NuevoProducto').modal('hide');
      },
      err => console.log(err)
    );

  } 

  DataChange(DataProducto: { id: string | undefined; nombre: string | undefined; descripcion: string | undefined; cantidad: string | undefined; precio: string | undefined; categoria: string | undefined; }): void {
   
    this.products.id          = DataProducto.id;
    this.products.nombre      = DataProducto.nombre;
    this.products.descripcion = DataProducto.descripcion;
    this.products.cantidad    = DataProducto.cantidad; 
    this.products.precio      = DataProducto.precio;
    this.products.categoria   = DataProducto.categoria; 
 
  }

  DeleteProducto(Product: { id: any; }): void {
    if(confirm('Seguro que deseas eliminar')){
      this.productsservice.deleteProducto(Product.id)
      .subscribe(
        ( res:any)  => {
           this.getProducts();
        }, (err: any) => console.error(err)
      );
    }
  }
 
  UpdateProducto(): void { 

    this.productsservice.updateProductos(this.products.id , this.products).subscribe(
      (res:any) => {

        if(res.succes == true){
          this.products.id          = '';
          this.products.nombre      = '';
          this.products.descripcion = '';
          this.products.cantidad    = '';
          this.products.precio      = '';
          this.products.categoria   = ''; 
  
          this.getProducts();
          this.toastr.success('Registro agregado'); 

          $('#EditarProducto').modal('hide'); 

        }else{
          this.toastr.error('No se pudo agregar'); 

        }    

     }, (err: any) => console.error(err)
    );
  }


}
function modal(modal: any) {
  throw new Error('Function not implemented.');
}

