import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


import { HttpHeaders ,HttpEventType, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 
//import  domtoimage from 'dom-to-image';

import { TokenService } from '../../shared/token.service';
import { AuthService } from 'src/app/shared/auth.service';
import { AuthStateService } from '../../shared/auth-state.service';
import { Permisos } from '../../services/services-data/user-permisos.service';

import { SeveralServices } from '../../services/services-data/several-services.service';
import { ExamenesServices } from '../../services/services-data/examenes.service';

import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'

import { GLOBAL } from '../../services/global';

//// MODAL
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

//// PDF LIBRARIES
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import * as jsPDF from 'jspdf';
// import * as html2canvas from 'html2canvas';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


import { DomSanitizer } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';

//// END PDF LIBRARIES

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

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

  selectedFile : ImageSnippet | undefined;

  global : any = GLOBAL;
  isSignedIn   : boolean | undefined;
  UserProfile  : User    | undefined;
  PermisosData : any     = [];

  CharguerData       : boolean | undefined;
  CharguerDataDelete : boolean | undefined;

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
  
  SearchTecnicos      : string = "";
  SearchMedicos       : string = "";
  SearchPacientes     : string = "";
  SearchDataExamen    : string = "";
  SearchExamens       : string = "";
  SearchExamensDelete : string = "";
  IdAdjuntos          : string = "";

  myDateToday      : any = new Date();

  ///LISTAR

  pagination        : any = [];
  pagination1       : any = [];
  pagination2       : any = [];

  /// END LISTAR
  
  ExamenesGetData  : any = [];
  DataInfoExamenes : any = [];
  ExamenesGetView  : any = [];
  TipoExamenes     : any = [];
  DataExamen       : any = [];
  RollData         : any = [];
  Acciones         : any = [];
  DataListDelete   : any = [];
  
  GetPictures      : any = [];
  Tecnicos         : any = [];
  Medicos          : any = [];
  Pacientes        : any = [];
  Clinicas         : any = [];
  
  ExamenesGet      : any = [];
  AdjuntosGet      : any = [];
  
  DataExamenAdjuntos : any = [];
  SelectedData       : any = {
      
      idExamen         : '',
      mood             : '2',
      fecha_inicio     : '',
      fecha_fin        : '',
      medico_id        : '',
      tecnico_id       : '',
      paciente_id      : '',
      id_tipo_examen   : '',
      id_clinica       : '',
      descripcion      : '',
      costo_examen     : '0',
      id_estado_examen : ''
  }

  WeSeeData     : any = {
      
    idExamen         : '',
    mood             : '2',
    fecha_inicio     : '',
    fecha_fin        : '',

    medico_id        : '',
    medico           : '',

    tecnico_id       : '',
    tecnico          : '',
    
    paciente_id      : '',
    paciente         : '',
    
    id_tipo_examen   : '',
    id_clinica       : '',
    descripcion      : '',
    costo_examen     : '0',
    id_estado_examen : '',

    examen           : '',
    clinica          : '',
    estado           : ''
}

  @ViewChild("fileUpload", {static: false}) 
  fileUpload      : ElementRef | undefined; files = [];

  title = 'appBootstrap';
  closeResult: string = '';
  

  constructor(
                public  token          : TokenService,
                public  authService    : AuthService,
                private auth           : AuthStateService,
                private permisos       : Permisos,
                private rutaActiva     : ActivatedRoute,
                private services       : SeveralServices,
                private servicesExamen : ExamenesServices,
                private sanitizer      : DomSanitizer,
                private http           : HttpClient,
                private modalService   : NgbModal, 
                private toastr         : ToastrService

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
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console 
  }

  focus($event: any) {
    // tslint:disable-next-line:no-console 
    this.focused = true
    this.blurred = false
  }

  blur($event: any) {
    // tslint:disable-next-line:no-console 
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

    for ( i = 0; i < this.selectedFiles.length; i++) {
      this.upload( i, this.selectedFiles[i] );
      this.processFile( this.selectedFiles[i] );
    }

  }///// uploadFiles

  processFile(imageInput: any) {
    
    
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.servicesExamen.uploadImage(this.selectedFile.file).subscribe(
        (res : any) => {
        
        },
        (err : any ) => {
        
        })
    });

    reader.readAsDataURL(file);
  }

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
        this.message                   = 'No se puede subir el archivo ' + file.name + ', no cumple las caracteristicas';
        this.selectedFiles             = [];
    });

    $('#fileInput').val('');
    if (this.progressInfo[index].value == 100) {
      this.progressInfo = [];
    }
    this.message        = "";
    this.selectedFiles  = [];

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

  async InfoListExamenes(){
    await this.SearcExamenes();
  }//// FINISH ListExamenes

  CreateAccion():void{

    this.GetTecnicos('Tecnico');
    this.GetMedicos('Medico');
    this.GetPacientes('Paciente');
    this.GetClinicas();
    this.GetDataExamen();

  }

  async MappingActionsEvents(){

    for (let index = 0; index < this.Acciones.length; index++) {

      let elements = this.Acciones[index];

      if (  elements.status == true && elements.accion == "Crear" ) {
        await this.CreateAccion();
      }else if (  elements.status == true && elements.accion == "Listar" ){
        //await this.ListExamenes();
        this.DataListExamen();
      }else if (  elements.status == true && elements.accion == "Eliminar" ){
        this.GetDelete();
      }

    }

  }//// FINAL MappingActionsEvents

  async SearchExam(){
 
    this.ExamenesGetView  = [];
    this.CharguerData     = false;

      await this.servicesExamen.ListExamenes(this.idExamenSelected, this.SearchExamens, this.pagination.current_page).subscribe(
        ( res : any ) => {

            this.ExamenesGet  = res.examenes.data;
            this.pagination   = res.pagination;
            this.CharguerData = true;

        }
      )
  }

  async GetExamenes(IdExamen : any, Examen:string) {

    this.DataTipoExamen   = '';
    this.ExamenSelected   = Examen;
    this.idExamenSelected = IdExamen;
    this.SelectedData.id_tipo_examen = this.idExamenSelected;

    await this.GetActions();
    await this.MappingActionsEvents();
    await this.GetDataExamen();

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

  changePage1(page: number):void{
    this.pagination1.current_page = page;
    this.DataListExamen();
  }//// FINISH changePage1

  changePage2(page: number):void{
    this.pagination2.current_page = page;
    this.GetDelete();
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
          async ( res : any ) => {
            if(res.status == true){
              
              this.toastr.success('Informacion Actualizada'); 

              this.SelectedData.fecha_inicio   = '';
              this.SelectedData.fecha_fin      = '';
              this.SelectedData.medico_id      = this.Medicos[0].user_id;
              this.SelectedData.tecnico_id     = this.Tecnicos[0].user_id;
              this.SelectedData.paciente_id    = this.Pacientes[0].user_id;
              this.SelectedData.id_tipo_examen = this.idExamenSelected;
              this.SelectedData.id_clinica     = '';
              this.SelectedData.descripcion    = '';
              this.SelectedData.costo_examen   = '0';

              this.IdAdjuntos    = res.IdEstados; 
              await this.uploadFiles();
              await this.GetDataExamen();
              
              this.selectedFiles = [];
              this.message = '';

            }
          }
        )/// CreateExamen

    }else{
 
      this.toastr.warning('Debe llenar todos los campos'); 

    }///


  }//// FINISH CrearExamen

  async addImageProcess(src: string) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  async DownloadExam( Data : any ){


    await this.servicesExamen.getFiles(Data.IdExamen).subscribe(
      async ( res : any ) => {
 
        this.AdjuntosGet        = res.adjuntos;
        this.DataExamenAdjuntos = res.examen;
 

        let NameExamen   = this.ExamenSelected + '_' + Data.paciente
        var c            = 0;

        var doc          = new jsPDF('p', 'pt', 'a4', true);
        var Adjunto      = this.AdjuntosGet;

        var pageSize     = doc.internal.pageSize;
        var pageHeight   = pageSize.height ? pageSize.height : pageSize.getHeight();
        var pageWidth    = 7; //pageSize.width ? pageSize.width : pageSize.getWidth();

        let costo        = String(this.DataExamenAdjuntos.costo_examen);
        let documento    = String(this.DataExamenAdjuntos.dni_paciente)

        doc.setFontSize(11);
        doc.setTextColor(134,142,150);
        doc.text( this.ExamenSelected + ' ' + Data.paciente,  50,70);
       
        doc.text( ' Tipo Examen : ',   50,90);
        doc.text( this.ExamenSelected,  140,90);

        doc.text( ' Fecha Inicio : ' ,  50,110);
        doc.text( this.DataExamenAdjuntos.fecha_inicio,  140,110);

        doc.text( ' Fecha Fin : '    ,  50,130);
        doc.text( this.DataExamenAdjuntos.fecha_fin,  140,130);

        doc.text( ' Clinica : ' ,  50,150);
        doc.text( this.DataExamenAdjuntos.clinica,  140,150);
        
        doc.text( ' Costo   : ',  50,170);
        doc.text( costo,  140,170);

        doc.text( ' Medico  : ',  50,190);
        doc.text( this.DataExamenAdjuntos.medico,  140,190);

        doc.text( ' Tecnico   : ' ,  50,210);
        doc.text( this.DataExamenAdjuntos.tecnico,  140,210);

        doc.text( ' Paciente   : ',  50,230);
        doc.text( this.DataExamenAdjuntos.paciente,  140,230);

        doc.text( ' Correo Paciente   : ',  50,250);
        doc.text( this.DataExamenAdjuntos.correo_paciente,  150,250);

        doc.text( ' Documento Paciente   : ',  50,270);
        doc.text( documento,  180, 270);
        doc.setPage(1)

 

            var Examen    = this.ExamenSelected.replace(/ /g, "_");
            await Adjunto.forEach( async ( element : any, key : any ) => {

                
                var foto          = element.adjunto;
                var Terminacion   = foto.split(".");
                var Nombre        = key+Terminacion[0];
                let terminacion   = String(Terminacion[1]);

                var pathe         = this.global.UrlLocalTest + "/adjuntos/examenes/" + element.adjunto;

                //var imgData = 'data:image/jpeg;base64,'+ this.sanitizer.bypassSecurityTrustResourceUrl(pathe);
                

                let image = new Promise((resolve, reject) => {

                  const headers = new HttpHeaders();
                  headers.append('Content-Type', 'multipart/form-data');
                  headers.append('Accept', 'application/json');
                  
                  var img = new Image(),
                  canvas = document.createElement("canvas"),
                  ctx    = canvas.getContext("2d"),
                  src    = pathe;
                  img.onload = () => resolve(img);
                  img.src = pathe; 
                  
                  img.onerror = reject;
                  let imgData = `<img [src]="${pathe}"/>`;
                  
                  doc.addImage(img, terminacion, 15, 40, 180, 160);
                  doc.addPage();
                  doc.setPage(key)

                  // //doc.addImage(image, terminacion, 5, 5, 0, 0);
                  //doc.addImage( img, , pageWidth - 50, 30, 14, 14, Nombre );
                  doc.addImage( pathe, 'jpg', 10, 78, 12, 15);
                });
 

                // }/// FINISH DATA
          });

        doc.save( NameExamen + '.pdf');

      }
    )

  }///// FINISH DownloadExam

  async GetDataExamen(){
    
      this.ExamenesGetData = [];   
      this.CharguerData    = false;

      await this.servicesExamen.ListDataExamen(this.UserProfile?.id, this.RollData[0].Roll, '1', this.SearchDataExamen, this.idExamenSelected).subscribe(
          ( res : any ) => {

            this.CharguerData     = true;
            this.ExamenesGetData  = res.examenes;  

          }
      )

      // await this.servicesExamen.GetExamenes(this.UserProfile?.id, this.RollData[0].Roll, '2', this.SearchExamens, this.idExamenSelected, this.pagination1.current_page).subscribe(
      //   ( res : any ) => {

      //       this.DataInfoExamenes  = res.examenes.data;  
      //       this.pagination1       = res.pagination;
      //   }
      // )
  }

  async DataListExamen(){
    
    this.DataInfoExamenes = []; 

    await this.servicesExamen.GetExamenes(this.UserProfile?.id, this.RollData[0].Roll, '2', this.SearchExamens, this.idExamenSelected, this.pagination1.current_page).subscribe(
        ( res : any ) => {

            this.DataInfoExamenes  = res.examenes.data;  
            this.pagination1       = res.pagination;
        }
    )
    
  }

  async GetDelete(){
    
    this.DataListDelete      = []; 
    this.CharguerDataDelete  = false;
    await this.servicesExamen.GetExamenes(this.UserProfile?.id, this.RollData[0].Roll, '2', this.SearchExamensDelete, this.idExamenSelected, this.pagination2.current_page).subscribe(
        ( res : any ) => {

            this.DataListDelete      = res.examenes.data;   
            this.pagination2         = res.pagination;

            this.CharguerDataDelete  = true;

        }
    )
    
  }

  async ShowDataExam( Data : any ){

    this.SelectedData.idExamen         = Data.IdExamen;
    this.SelectedData.fecha_inicio     = Data.fecha_inicio;
    this.SelectedData.fecha_fin        = Data.fecha_fin;
    this.SelectedData.medico_id        = Data.medico_id;
    this.SelectedData.tecnico_id       = Data.tecnico_id;
    this.SelectedData.paciente_id      = Data.paciente_id;
    this.SelectedData.id_tipo_examen   = Data.tipo_examen;
    this.SelectedData.id_clinica       = Data.id_clinica;
    this.SelectedData.descripcion      = Data.descripcion;
    this.SelectedData.costo_examen     = Data.costo_examen;
    this.SelectedData.id_estado_examen = Data.id_estado_examen;
    
    window.scroll({
      top: 100,
      left: 100,
      behavior: 'smooth'
    });

    //window.scrollTo('quilEditor');
    // let el = document.getElementById('quilEditor');
    // el.scrollIntoView();

    let elementReference = document.querySelector('quilEditor');
    if (elementReference instanceof HTMLElement) {
        elementReference.focus();
    }
  }

  async openData(content: any, DataExamen : any) {  

    await this.servicesExamen.getFiles(DataExamen.IdExamen).subscribe(
      ( res : any ) => {
        this.GetPictures = res.adjuntos;
      }
    )

    this.WeSeeData.idExamen         = DataExamen.IdExamen;
    this.WeSeeData.fecha_inicio     = DataExamen.fecha_inicio;
    this.WeSeeData.fecha_fin        = DataExamen.fecha_fin;

    this.WeSeeData.medico           = DataExamen.medico;
    this.WeSeeData.tecnico          = DataExamen.tecnico;
    this.WeSeeData.paciente         = DataExamen.paciente;

    this.WeSeeData.examen           = DataExamen.examen;
    this.WeSeeData.clinica          = DataExamen.clinica;
    this.WeSeeData.estado           = DataExamen.estado;

    this.WeSeeData.descripcion      = DataExamen.descripcion;
    this.WeSeeData.costo_examen     = DataExamen.costo_examen;
    this.WeSeeData.id_estado_examen = DataExamen.id_estado_examen;



    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', windowClass: 'my-class'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    


  }/// END openData()
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  async DeleteData( Data : any ){
    
    if(confirm('Esta seguro que desea eliminar este registro ?..')){
      this.servicesExamen.DeleteExamen(Data.IdExamen).subscribe(
        ( res : any ) => {
           if( res.status == true ){

              this.toastr.success('Registro eliminado'); 
              this.GetDelete()
           }   
        }
      )/// END SERVICE
    }/// END CONFIRM

  }

}
