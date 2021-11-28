import { Component, OnInit } from '@angular/core';

///SERVICES

import { CategoriasService } from '../../services/categorias.service';
import { ToastrService } from 'ngx-toastr';


/// MODELS  
import { Categories } from 'src/app/models/category';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
  data              : string = '';
  GetCategoriesData : any    = [];
  categories    : Categories = {
    id: '',
    nombre:'', 
    descripcion:''
  }

  NewCategories : Categories = { 
    nombre:'', 
    descripcion:''
  }

  pagination: any = [];

  constructor(
              private categoriasservice : CategoriasService, 
              private toastr            : ToastrService
    ) { }

  ngOnInit(): void {
    this.GetCategories()
  } 
  changePage(page: number):void{
    this.pagination.current_page = page;
    this.GetCategories();
  }

  KeySearch(){
    this.pagination.current_page = 0;
    this.GetCategories();
  }

  GetCategories():void {
    this.categoriasservice.getCategorias(this.data, this.pagination.current_page).subscribe(
      (res:any) => {
        this.GetCategoriesData = res.categories.data
        this.pagination        = res.pagination
      }
    )
  }

  DataChange(DataCat: { id: string | undefined; nombre: string | undefined; descripcion: string | undefined; }){
    this.categories.id              = DataCat.id;
    this.categories.nombre          = DataCat.nombre;
    this.categories.descripcion     = DataCat.descripcion;
  }

  UpdateCat(): void { 

    this.categoriasservice.updateCategory
    (this.categories.id , this.categories).subscribe(
      (res:any) => {

        if(res.succes == true){
          this.categories.id          = '';
          this.categories.nombre      = '';
          this.categories.descripcion = ''; 
  
          this.GetCategories();
          $('#EditarProducto').modal('hide'); 

        }else{ 
          this.toastr.error('Hubo un error'); 

        }    

     }, (err: any) => console.error(err)
    );
  }

  SaveNewCategory(){
    this.categoriasservice.saveCategorias(this.NewCategories).subscribe(
      (res:any) => {
        this.GetCategories();
        this.NewCategories.nombre      = '';
        this.NewCategories.descripcion = '';
        $('#NewCategory').modal('hide');

      }, err => console.log(err)
    );
  }

  DeleteCat(Cat: { id: any; }): void {
    if(confirm('Seguro que deseas eliminar')){
      this.categoriasservice.deleteCategory(Cat.id)
      .subscribe(
        ( res:any)  => {
           this.GetCategories();
        }, (err: any) => console.error(err)
      );
    }
  }
}
