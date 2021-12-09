import { Component, OnInit } from '@angular/core';
import { SeveralServices } from '../../services/services-data/several-services.service';


@Component({
  selector: 'app-index-home',
  templateUrl: './index-home.component.html',
  styleUrls: ['./index-home.component.css']
})
export class IndexHomeComponent implements OnInit {

  //// LISTAS

  TipoExamenes     : any = [];
  fecha            = new Date();
  mesActual        = this.fecha.getMonth() + 1;
  SumaTotal        : number = 0;
  Estadisticas     : any = [];

  //// END LISTAS


  constructor( 
        private services       : SeveralServices
   ) { }

  ngOnInit(): void {
    this.GetExamenes();
  }

  async GetExamenes(){
    await this.services.GetExamenesEstadisticas('1').subscribe(
      async ( res : any )  => {
        this.TipoExamenes = await res.TipoExamenes;
        this.ExplainData();
      }
    )
  }

  ExplainData(){
    let suma = 0;
    for (let index = 0; index < this.TipoExamenes.length; index++) {
      let element = this.TipoExamenes[index];
      this.SumaTotal = this.SumaTotal + element.total; 
      console.log('Total Times : '+ this.SumaTotal);

    }

    for (let index = 0; index < this.TipoExamenes.length; index++) {
      let element = this.TipoExamenes[index];
      
      let data = {
        porcentaje : ( element.total / this.SumaTotal )*100,
        examen     :  element.examen,
        valor      :  element.total
      }
      console.log({'Data Came : ': data});
      this.Estadisticas.push(data);
    }

    console.log( {'data sale : ': this.Estadisticas});

  }

}
