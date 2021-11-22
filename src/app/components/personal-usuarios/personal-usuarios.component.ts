import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//// SERVICES

import { TokenService } from '../../shared/token.service'; 
import { AuthService } from 'src/app/shared/auth.service';
import { Permisos } from '../../services/services-data/user-permisos.service';
import { AuthStateService } from '../../shared/auth-state.service';
import { SeveralServices } from '../../services/services-data/several-services.service'
import { Personas } from '../../services/services-data/personas.services'
import { Ubicaciones } from '../../services/services-data/ubicaciones.services'
import { RollServices } from '../../services/services-data/roles-permisos.service';
import { isThisQuarter } from 'date-fns';




export class User {
  id    : any = 0;
  name  : String = '';
  email : String = '';
}

@Component({
  selector: 'app-personal-usuarios',
  templateUrl: './personal-usuarios.component.html',
  styleUrls: ['./personal-usuarios.component.css']
})
export class PersonalUsuariosComponent implements OnInit {

  isSignedIn   : boolean | undefined;
  UserProfile  : User    | undefined;
  
  SelectRoll    : string = '';
  
  PermisosData  : any = []; 
  StateArrow    : any = false; 

  PersonasUsers : any = [];
  Personas      : any = [];

  RollSearch    : any = [];
  RollData      : any = [];
  Roles         : any = [];
  TiposDoc      : any = [];

  Departamentos : any = [];
  Ciudades      : any = [];

  DataSend = {
    mood       : '1',
    Nombre     : '',
    Apellido   : '',
    TipoDoc    : '',
    documento  : '',
    fechaNacimiento : '',
    email      : '',
    telefono   : '',
    direccion  : '',

    Dep        : '701',
    Ciudad     : '',
    TipoSangre : 'A+',
    Password   : '',
    roll       : ''
  }

  constructor( 
    public  token            : TokenService,
    public  authService      : AuthService,
    private auth             : AuthStateService, 
    private router           : Router,
    private permisos         : Permisos,
    private activatedRoute   : ActivatedRoute,
    private servicesSeveral  : SeveralServices,
    private servicePersonas  : Personas,
    private serviceUbicacion : Ubicaciones,
    private serviceRoles     : RollServices
    ) {}

    async ngOnInit() {

      await this.auth.userAuthState.subscribe(val => {
          this.isSignedIn = val;   
      });
  
      await this.authService.profileUser().subscribe((data:any) => {
        this.UserProfile = data; 
        this.getPermisos();
        this.GetRoles();
        this.GetUsuarios(); 
        this.GetTiposDoc();
        this.GetDepartamentos();
        this.GetCiudades();
      })
  
    } /// FINAL ngOnInit

    async getPermisos(){ 

      await this.permisos.GetPermisos(this.UserProfile?.id).subscribe(
        (res:any) => {
           if(res.status == true) {
             this.PermisosData = res.permisos;
             console.log({ DataPermisos : this.PermisosData})
           }
        }
      )
  
      await this.permisos.GetOwnRoll(this.UserProfile?.id,'OwnRollData').subscribe(
        (res : any) => {
          if(res.status == true){
            this.RollData = res.rollData;
            console.log(this.RollData[0].Roll);
          }
        }
      )
  
    }

    async GetUsuarios(){

      await this.servicePersonas.GetPersonas( this.RollSearch, '2').subscribe(
        ( res : any ) => {
          this.PersonasUsers = res.personas
        }
      )

      await this.servicePersonas.GetPersonas( '', '3').subscribe(
        ( res : any ) => {
          this.Personas = res.personas
        }
      )

    }

    async GetRoles(){
      await this.servicesSeveral.GetRoles().subscribe(
        ( res : any ) =>{
          this.Roles = res.roles;
          this.DataSend.roll = this.Roles[0].id 
        }
      )
    }

    async GetTiposDoc(){
      this.servicesSeveral.GetTipoDocs().subscribe(
        ( res : any ) => { 
          this.TiposDoc = res.tipos
          this.DataSend.TipoDoc = this.TiposDoc[0].id 
        }
      )
    }

    async GetDepartamentos(){
      this.serviceUbicacion.GetDepartamentos('44').subscribe(
        ( res : any ) => {
          this.Departamentos = res.departamentos
        }
      )
    }

    async GetCiudades(){

      //alert('data :'+ this.DataSend.Dep)
      this.serviceUbicacion.GetCiudad(this.DataSend.Dep).subscribe(
        ( res : any ) => {
          this.Ciudades = res.ciudades

          this.DataSend.Ciudad = this.Ciudades[0].id 
        }
      )
    }

    async ChangueRoll( event : any,  roll : any, id_user : string ){

      event.stopPropagation();
      console.log(roll.id)
      if(confirm('Deseas cambiar de roll a '+roll.name + ' ?..')){

        let Data = { 'id_user' : id_user,
                      };
        console.log(Data)

        this.serviceRoles.UpdateRoll(roll.id, Data).subscribe(
          ( res : any ) => {
            if( res.status == true ){
              alert('Registro Actualizado');
              this.GetUsuarios();
            }
          }
        )
      }

    }

    async AgregarPersona(){

      if(
        this.DataSend.Nombre    == '' ||
        this.DataSend.Apellido  == '' ||
        this.DataSend.TipoDoc   == '' ||
        this.DataSend.documento == '' ||
        this.DataSend.fechaNacimiento == '' ||
        this.DataSend.email      == '' ||
        this.DataSend.direccion  == '' ||
        this.DataSend.Dep        == '' ||
        this.DataSend.Ciudad     == '' ||
        this.DataSend.TipoSangre == '' ||
        this.DataSend.Password   == ''         
      ){
        alert('Debe llenar todos los campos')
      }else{

        this.servicePersonas.CrearPersonas(this.DataSend).subscribe(
          ( res : any ) => {

            if( res.trouble_status == true ){
              alert( res.trouble );
            }

            if( res.status == true ){

              alert('Usuario creado')

              this.DataSend.Nombre    = ''; 
              this.DataSend.Apellido  = '';
              this.DataSend.documento = '';
              this.DataSend.fechaNacimiento = ''; 
              this.DataSend.email      = '';
              this.DataSend.telefono   = '';
              this.DataSend.direccion  = ''; 
              this.DataSend.Dep        = '701';
              this.DataSend.TipoSangre = 'A+'; 
              this.DataSend.Password   = '';   

            }
            //else{ alert( 'Hubo un problema con la consulta' ); }
          }
        )

      }


    }

}
