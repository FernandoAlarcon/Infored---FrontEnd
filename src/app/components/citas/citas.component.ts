import { AfterViewInit, Component, EventEmitter, Output, Renderer2, ViewChild, OnInit } from '@angular/core';
import { AuthStateService }  from '../../shared/auth-state.service';

import { TokenService }     from '../../shared/token.service';
import { AuthService }      from 'src/app/shared/auth.service'; 
import { Permisos }         from '../../services/services-data/user-permisos.service';
import { ExamenesServices } from 'src/app/services/services-data/examenes.service';
import { SeveralServices }  from 'src/app/services/services-data/several-services.service';
import { Citas }            from 'src/app/services/services-data/citas.services';

import * as moment from 'moment'; 
import { CalendarOptions } from '@fullcalendar/angular';  
import { async } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';

//import { MatCalendar } from '@angular/material';
 

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: { 
    primary: '#1e90ff',
    secondary: '#D1E8FF',   
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  }, 
};

export class User {
  id    : any = 0;
  name  : String = '';
  email : String = '';
}


@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  //AfterViewInit
  dtOptions: DataTables.Settings = {};
  /////////////////////////////////////////////////////////
 
   //calendar: MatCalendar<moment.Moment>;
 
  /////////////////////////////////////////////////////////


  
  isSignedIn   : boolean | undefined;
  UserProfile  : User    | undefined;
  PermisosData : any     = [];

  idExamenSelected : string = "";
  ExamenSelected   : string = "";
  
  SearchExamens    : string = "";
  DataTipoExamen   : string = "";
  SearchDelete     : string = "";
  SearchUpdate     : string = "";

  SearchMedicos    : string = "";
  SearchPacientes  : string = "";
  SearchTecnicos   : string = "";

  ListExamenes     : any  = [];
  AllCitas         : any  = [];
  AllCitasUpdate   : any  = [];

  //////// PAGINATION

  pagination1  : any  = [];   
  pagination2  : any  = [];   

  //////// END PAGINATION


  RollData     : any  = [];
  Acciones     : any  = [];
  ExamenesGet  : any  = [];

  Tecnicos      : any  = [];
  Medicos       : any  = [];
  Pacientes     : any  = [];
  Clinicas      : any  = [];
  pagination    : any  = [];
  
  myDateToday   : Date = new Date();
  SelectedData  : any = {
    mood           : '1',
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

  
  CharguerData  : boolean | undefined;

  constructor(
                public  token          : TokenService,
                private permisos       : Permisos,
                public  authService    : AuthService,
                private auth           : AuthStateService,
                private servicesExamen : ExamenesServices,
                private services       : SeveralServices,
                private renderer       : Renderer2,
                private CitasService   : Citas,
                private toastr         : ToastrService
              ) { }

  async ngOnInit(){

    await this.auth.userAuthState.subscribe(val => {
        this.isSignedIn = val;
    });

    await this.authService.profileUser().subscribe(
      async ( data:any ) => {
       this.UserProfile = data; 
       await this.GetPermisos();
    });
    
  }
  

  async GetPermisos(){

    await this.permisos.GetPermisos(this.UserProfile?.id).subscribe(
      (res:any) => {
         if(res.status == true) {
           this.PermisosData = res.permisos;
         }
      }
    )

    await this.permisos.GetOwnRoll(this.UserProfile?.id,'OwnRollData').subscribe(
      async (res : any) => {
        if(res.status == true){
          this.RollData = res.rollData;
          await this.GetActions();

        }
      }
    )

  }/// FINAL GetPermisos

  async GetActions() {
    ////  SEGUNDO PARAMETRO ES EL ID DEL ROLL
    await this.permisos.GetAcciones(this.RollData[0].IdRoll, '2').subscribe(
      async (res : any) => {
        
        if(res.status == true){
          this.Acciones = res.acciones;
          await this.MappingActionsEvents();
        }
      }
    )
  }/// FINAL GetActions

  async MappingActionsEvents(){

    for (let index = 0; index < this.Acciones.length; index++) {

      let elements = this.Acciones[index];

      if ( elements.status == true && elements.accion == "Crear" ) {
        await this.CreateCita();
        await this.ListTipoExamenes();
      }else if ( elements.status == true && elements.accion == "Listar" ){
        //await this.ListCitas();
      }else if ( elements.status == true && elements.accion == "Eliminar" ){
        await this.ListEliminar();
      }else if ( elements.status == true && elements.accion == "Actualizar" ){
        await this.ListUpdate();
      }


    }

  }//// FINAL MappingActionsEvents

  CreateCita():void{

    this.GetTecnicos('Tecnico');
    this.GetMedicos('Medico');
    this.GetPacientes('Paciente');
    this.GetClinicas();

  }//// FINISH CreateCita

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

  async ListTipoExamenes(){
    this.services.GetTipoExamenes('').subscribe(
      ( res : any ) => {
        this.ListExamenes                 = res.TipoExamenes;
        this.SelectedData.id_tipo_examen  = this.ListExamenes[0].id
      }
    )
  }

  async CrearCitas() {

    if (  

          this.SelectedData.fecha_inicio   != '' &&
          this.SelectedData.fecha_fin      != '' &&
          this.SelectedData.medico_id      != '' &&
          this.SelectedData.tecnico_id     != '' &&
          this.SelectedData.paciente_id    != '' &&
          this.SelectedData.id_tipo_examen != '' &&
          this.SelectedData.id_clinica     != '' 
      ) {

        await this.servicesExamen.CreateExamen(this.SelectedData).subscribe(
          ( res : any ) => {
            if(res.status == true){
 
              this.toastr.success('Registro Actualizado'); 


              this.SelectedData.fecha_inicio   = '';
              this.SelectedData.fecha_fin      = '';
              this.SelectedData.medico_id      = this.Medicos[0].user_id;
              this.SelectedData.tecnico_id     = this.Tecnicos[0].user_id;
              this.SelectedData.paciente_id    = this.Pacientes[0].user_id;
              this.SelectedData.id_tipo_examen = this.idExamenSelected;
              this.SelectedData.id_clinica     = ''; 
              this.SelectedData.costo_examen   = '0';

            
            }
          }
        )/// CreateCitas

    }else{

              this.toastr.warning(' Hay campos obligatorios ');        

    }///


  }//// FINISH CrearCitas

  async ListEliminar(){
     
    await this.CitasService.GetCitas( this.UserProfile?.id,  this.RollData[0].Roll, '2', this.SearchDelete, this.pagination1.current_page).subscribe(
      async ( res : any ) => {
        
        this.AllCitas    = res.citas.data;   
        this.pagination1 = res.pagination   

 
        if( this.AllCitas.length == 0 ){
          
        }else{
          //this.calendarOptions;
        }
      }
    )
    //this.ngAfterViewInit();
  }

  async DeleteCita( Data : any ){
    
    if( confirm('¿ Estas seguro que deseas eliminar este registro ?') ){
      await this.CitasService.DeleteCitas(Data.IdExamen).subscribe(
        ( res : any ) => {

          if( res.status == true ){
            this.ListEliminar();
            this.ListUpdate();  
            this.toastr.success('Registro Eliminado'); 
 
          }else{
            
            this.toastr.error('Hubo algunos problemas'); 

          }

        }
      )
    }


  }

  async UpdateCita( Data : any, Estado : any ){

    let DataSend = {
        'mood'   : '1',
        'estado' : Estado
    }

    await this.CitasService.UpdateStateCitas( Data.IdExamen, DataSend).subscribe(
      ( res : any ) => {
          
        if( res.status == true ){
          this.toastr.success('Cita Actualizada'); 
          this.ListUpdate()
        }else{
          
          this.toastr.success('Sucedio algo'); 

        }

      }
    )

  }

  async ListUpdate(){
     
    console.log('get Update');
    await this.CitasService.GetCitas( this.UserProfile?.id,  this.RollData[0].Roll, '2', this.SearchUpdate, this.pagination2.current_page).subscribe(
      async ( res : any ) => {
         
        this.AllCitasUpdate  = res.citas.data;   
        this.pagination2     = res.pagination   

        if( this.AllCitasUpdate.length == 0 ){
            await this.toastr.success('No hay citas con esas caractericas');  
        }else{
          //this.calendarOptions;
        }
      }
    )
    //this.ngAfterViewInit();
  }

  changePage1(page: number):void{
    this.pagination1.current_page = page;
    this.ListEliminar();
  }//// FINISH changePage1

  changePage2(page: number):void{
    this.pagination2.current_page = page;
    this.ListUpdate();
  }//// FINISH changePage1

}
