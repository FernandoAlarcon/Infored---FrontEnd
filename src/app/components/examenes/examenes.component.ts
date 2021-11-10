import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {HttpEventType, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { TokenService } from '../../shared/token.service';
import { AuthService } from 'src/app/shared/auth.service';
import { AuthStateService } from '../../shared/auth-state.service';
import { Permisos } from '../../services/services-data/user-permisos.service';

import { SeveralServices } from '../../services/services-data/several-services.service';
import { ExamenesServices } from '../../services/services-data/examenes.service';

import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'

import { GLOBAL } from '../../services/global';


//// PDF LIBRARIES
  
import { of, Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';

// import * as jsPDF from 'jspdf';
// import * as html2canvas from 'html2canvas';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


import { DomSanitizer } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';

//// END PDF LIBRARIES

export class User {
  id    : any = 0;
  name  : String = '';
  email : String = '';
}

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})

export class ExamenesComponent implements OnInit {

  isSignedIn   : boolean | undefined;
  UserProfile  : User    | undefined;
  PermisosData : any     = [];

  CharguerData : boolean | undefined;

  ////// DATA PDF

  //Lista de archivos seleccionados
  selectedFiles : any    = [];
  //Es el array que contiene los items para mostrar el progreso de subida de cada archivo
  progressInfo  : any    = []
  //Mensaje que almacena la respuesta de las Apis
  message       : string = '';
  //Nombre del archivo para usarlo posteriormente en la vista html
  fileName      : string = "";
  fileInfos     : Observable <any> | undefined;

  DataValue     : any    = { value    : 0,
                             fileName : '' }

  ////// END DATA PDF

  DataTipoExamen   : string = "";
  ExamenSelected   : string = "";
  idExamenSelected : string = "";
  SearchTecnicos   : string = "";
  SearchMedicos    : string = "";
  SearchPacientes  : string = "";

  SearchExamens    : string = "";
  IdAdjuntos       : string = "";

  myDateToday      : any = new Date();

  ///LISTAR

  pagination       : any = [];

  /// END LISTAR

  TipoExamenes     : any = [];
  DataExamen       : any = [];
  RollData         : any = [];
  Acciones         : any = [];

  Tecnicos         : any = [];
  Medicos          : any = [];
  Pacientes        : any = [];
  Clinicas         : any = [];

  ExamenesGet      : any = [];
  AdjuntosGet      : any = [];

  SelectedData     : any = {
      fecha_inicio   : '',
      fecha_fin      : '',
      medico_id      : '',
      tecnico_id     : '',
      paciente_id    : '',
      id_tipo_examen : '',
      id_clinica     : '',
      descripcion    : '',
      costo_examen   : '0'
  }

  @ViewChild("fileUpload", {static: false})
  fileUpload      : ElementRef | undefined; files = [];

  constructor(
                public  token          : TokenService,
                public  authService    : AuthService,
                private auth           : AuthStateService,
                private permisos       : Permisos,
                private rutaActiva     : ActivatedRoute,
                private services       : SeveralServices,
                private servicesExamen : ExamenesServices,
                private sanitizer      : DomSanitizer,
                private http           : HttpClient
             ) { }
 
  ngOnInit() { 

    this.auth.userAuthState.subscribe(val => {
        this.isSignedIn = val;
    });

    this.authService.profileUser().subscribe(
      ( data:any ) => {
      this.UserProfile = data;
      this.GetTipoExamenes();
      this.GetPermisos();
    });

  }/// FINISH ngOnInit


  /////// QUILL EVENTS

   blurred = false
  focused = false

  created(event: Quill) {
    // tslint:disable-next-line:no-console
    console.log('editor-created', event)
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event)
  }

  focus($event: any) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event)
    this.focused = true
    this.blurred = false
  }

  blur($event: any) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event)
    this.focused = false
    this.blurred = true
  }

  /////// END QUILL EVENTS


  ///// PDF EVENTS
 
  selectFiles( event : any ) {

    this.progressInfo = [];
    event.target.files.length == 1 ? this.fileName = event.target.files[0].name : this.fileName = event.target.files.length + " archivos";
    this.selectedFiles = event.target.files;

  }///// selectFiles

  uploadFiles() {

    let i        = 0;
    this.message = '';
    console.log({ names  : this.selectedFiles} );
    for ( i = 0; i < this.selectedFiles.length; i++) {
      this.upload( i, this.selectedFiles[i] );
    }

  }///// uploadFiles

  upload( index : any , file : any ) {

    this.DataValue.value     =  0;
    this.DataValue.fileName  = file.name;
    this.progressInfo[index] = this.DataValue;

    this.servicesExamen.upload( file, this.IdAdjuntos, this.ExamenSelected ).subscribe(
      ( event : any ) => {
        if ( event.type === HttpEventType.UploadProgress ) {
            //for (let i = 0; i < this.selectedFiles.length; i++) {
              this.progressInfo[index].value = Math.round(100 * event.loaded / event.total );
            //}
        }
      },
      ( err : any ): void => {
        this.progressInfo[index].value = 0;
        this.message                   = 'No se puede subir el archivo ' + file.name;
    });

    $('#fileInput').val('');
    if (this.progressInfo[index].value == 100) {
      this.progressInfo = [];
    }
  }///// FINISH upload

  deleteFile(filename: string) {
    this.servicesExamen.deleteFile(filename).subscribe( ( res : any ) => {
      this.message = res['message'];
      //this.fileInfos = this.servicesExamen.getFiles();
    });
  }////  FINISH deleteFile

  ///// END PDF EVENTS

  async GetPermisos(){

    await this.permisos.GetPermisos(this.UserProfile?.id).subscribe(
      (res:any) => {
         if(res.status == true) {
           this.PermisosData = res.permisos;
         }
      }
    )

    await this.permisos.GetOwnRoll(this.UserProfile?.id,'OwnRollData').subscribe(
      (res : any) => {
        if(res.status == true){
          this.RollData = res.rollData;
        }
      }
    )

  }/// FINAL GetPermisos

  async GetActions() {
    await this.permisos.GetAcciones(this.RollData[0].IdRoll, '1').subscribe(
      (res : any) => {
        console.log({data : res})
        if(res.status == true){
          this.Acciones = res.acciones;

          this.MappingActionsEvents();
        }
      }
    )
  }/// FINAL GetActions

  async GetTipoExamenes() {
    await this.services.GetTipoExamenes(this.DataTipoExamen).subscribe(
      (res : any) => {
        this.TipoExamenes = res.TipoExamenes;
      }
    )
  }/// FINAL GetTipoExamenes

  async ListExamenes(){
    await this.SearcExamenes();
  }//// FINISH ListExamenes

  CreateAccion():void{

    this.GetTecnicos('57');
    this.GetMedicos('58');
    this.GetPacientes('62');
    this.GetClinicas();

  }

  async MappingActionsEvents(){

    for (let index = 0; index < this.Acciones.length; index++) {

      let elements = this.Acciones[index];

      if ( elements.id == 1 && elements.status == true && elements.accion == "Crear" ) {
        await this.CreateAccion();
      }else if ( elements.id == 2 && elements.status == true && elements.accion == "Listar" ){
        await this.ListExamenes();
      }else if ( elements.id == 3 && elements.status == true && elements.accion == "Eliminar" ){

      }

    }

  }//// FINAL MappingActionsEvents

  async GetExamenes(IdExamen : any, Examen:string) {

    this.DataTipoExamen   = '';
    this.ExamenSelected   = Examen;
    this.idExamenSelected = IdExamen;
    this.SelectedData.id_tipo_examen = this.idExamenSelected;

    await this.GetActions();
    await this.MappingActionsEvents();

  }//// FINAL GetExamenes

  async GetTecnicos( IdRoll : any ) {

      await this.servicesExamen.GetPersonalRoll(IdRoll, this.SearchTecnicos).subscribe(
        ( res : any ) => {
          this.Tecnicos = res.personas;
          this.SelectedData.tecnico_id = this.Tecnicos[0].user_id;
        }
      )//// FINISH GET-TECNICOS
  }//// FINISH GetTecnicos

  async GetMedicos( IdRoll : any ) {

    await this.servicesExamen.GetPersonalRoll(IdRoll, this.SearchMedicos).subscribe(
      ( res : any ) => {
        this.Medicos = res.personas;
        this.SelectedData.medico_id = this.Medicos[0].user_id;

      }
    ) //// FINISH GET-MEDICOS

  }//// FINISH GetMedicos

  async GetPacientes( IdRoll : any )  {

    await this.servicesExamen.GetPersonalRoll(IdRoll, this.SearchPacientes).subscribe(
      ( res : any ) => {
        this.Pacientes                = res.personas;
        this.SelectedData.paciente_id = this.Pacientes[0].user_id;

      }
    ) ///// FINISH GET-PACIENTES

  }//// FINISH GetPacientes

  async GetClinicas(){

    await this.services.GetClinicas().subscribe(
      (res : any) => {
        this.Clinicas                = res.clinicas;
        this.SelectedData.id_clinica = this.Clinicas[0].id_clinica;
      }
    )

  }//// FINISH GetClinicas

  async SearcExamenes() {

    this.ExamenesGet  = [];
    this.CharguerData = false;

      await this.servicesExamen.ListExamenes(this.idExamenSelected, this.SearchExamens, this.pagination.current_page).subscribe(
        ( res : any ) => {

            this.ExamenesGet  = res.examenes.data;
            this.pagination   = res.pagination;
            this.CharguerData = true;

        }
      )
  }//// FINISH SearcExamenes

  changePage(page: number):void{
    this.pagination.current_page = page;
    this.SearcExamenes();
  }//// FINISH changePage

  async CrearExamen() {

    if (
          this.SelectedData.fecha_inicio   != '' &&
          this.SelectedData.fecha_fin      != '' &&
          this.SelectedData.medico_id      != '' &&
          this.SelectedData.tecnico_id     != '' &&
          this.SelectedData.paciente_id    != '' &&
          this.SelectedData.id_tipo_examen != '' &&
          this.SelectedData.id_clinica     != '' &&
          this.SelectedData.descripcion    != ''
      ) {

        await this.servicesExamen.CreateExamen(this.SelectedData).subscribe(
          ( res : any ) => {
            if(res.status == true){

              this.SelectedData.fecha_inicio   = '';
              this.SelectedData.fecha_fin      = '';
              this.SelectedData.medico_id      = '';
              this.SelectedData.tecnico_id     = '';
              this.SelectedData.paciente_id    = '';
              this.SelectedData.id_tipo_examen = this.idExamenSelected;
              this.SelectedData.id_clinica     = '';
              this.SelectedData.descripcion    = '';
              this.SelectedData.costo_examen   = '0';

              this.IdAdjuntos                  = res.IdEstados; 
              this.uploadFiles();
            }
          }
        )/// CreateExamen

    }else{
 
      alert(' Hay campos obligatorios ');

    }///


  }//// FINISH CrearExamen

  async DownloadExam( Data : any ){

    await this.servicesExamen.getFiles(Data.IdExamen).subscribe(
      async ( res : any ) => {

        this.AdjuntosGet = res.adjuntos;
        let NameExamen   = this.ExamenSelected + '_' + Data.paciente
        var c            = 0;

        var doc          = new jsPDF('p', 'pt', 'a4');
        var Adjunto      = this.AdjuntosGet;

        var pageSize     = doc.internal.pageSize;
        var pageHeight   = pageSize.height ? pageSize.height : pageSize.getHeight();
        var pageWidth    = 7; //pageSize.width ? pageSize.width : pageSize.getWidth();

        doc.setFontSize(11);
        doc.setTextColor(134,142,150);
        doc.text(this.ExamenSelected + ' ' + Data.paciente,  50,90);

            var Examen    = this.ExamenSelected.replace(/ /g, "_");
            await Adjunto.forEach(( element : any ) => {

                
                var foto          = element.adjunto;
                var Terminacion   = foto.split(".");
                var pathe         = GLOBAL.UrlLocalTest + "/adjuntos/examenes/" + element.adjunto;
                var Nombre        = Examen + '_' + c;

                const reader   = new FileReader();
                reader.onload  = (e: any) => {
                const image    = new Image();
                image.src      = pathe;
                image.onload   = rs => {
        
                  // Return Base64 Data URL
                  let imgBase64Path = pathe;
                  doc.addPage();
                  doc.addImage( imgBase64Path, Terminacion[1], pageWidth - 50, 30, 14, 14, Nombre );

                  };
                };

                /////
                // async (pathe : any, callback : any) => {

                //       var URL_IMAGE = new Image();

                //       URL_IMAGE.onerror = await function() {
                //           console.log('Cannot load image: "'+pathe+'"');
                //       };

                //       URL_IMAGE.onload  = await function() {
                //           URL_IMAGE.src = pathe;
                //           doc.addPage();
                //           doc.addImage( URL_IMAGE, Terminacion[1], pageWidth - 50, 30, 14, 14, Nombre );
                //       };
                //       c++;

                // }/// FINISH DATA
          });

        doc.save( NameExamen + '.pdf');

      }
    )

  }///// FINISH DownloadExam

}
