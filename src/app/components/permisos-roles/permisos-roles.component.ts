import { Component, OnInit } from '@angular/core';
//import { Roles } from '../../services/services-data/roles.services'
import { Permisos } from '../../services/services-data/user-permisos.service';


@Component({
  selector: 'app-permisos-roles',
  templateUrl: './permisos-roles.component.html',
  styleUrls: ['./permisos-roles.component.scss']
})

export class PermisosRolesComponent implements OnInit {
  // private ServicioRoles : RolesService
  constructor(private permisos:Permisos) { }

  Roles            : any = [];
  Permisos         : any = [];
  ModulosRoles     : any = [];
  AccionesPermisos : any = [];
  UsersRoles       : any = [];

  ModulosCome    : boolean = false; 
  AlertSucces    : boolean = false; 
  DangerSucces   : boolean = false; 
  CharguerAccion : boolean = false; 
  
  RollSelect        : string = '';
  RollSelectNameGet : string = '';
  ModuloSelected    : string = '';
  IdModuloSelected  : string = '';

  DataPermiso = {
    'IdRoll'   : '',
    'IdModulo' : ''
  }

  DataAcciones = {
    'IdRoll'   : '',
    'IdModulo' : ''
  }

  DataCreateAcciones = {
    'IdRoll'   : '',
    'IdModulo' : '',
    'IdAccion' : ''
  }

  ngOnInit(){
    this.GetRoles();
  } 

  GetRoles(): void{
      this.permisos.GetRoles('','').subscribe(
        (res:any) => {
          if(res.status == true){
            this.Roles = res.roles;
            console.log({roles: this.Roles})
          }
        }
      )
  }

  GetPermisosRoll(){
     
    this.CharguerAccion = true;
    this.AccionesPermisos = [];
    this.permisos.GetPermisosRoles('',this.RollSelect,'').subscribe(
       (res:any) => {
        if(res.status == true){
          this.ModulosRoles   = res.permisos; 
          this.CharguerAccion = false;
          this.ModulosCome    = true;
          this.UsersRoles     = res.usuarios_roll;
          this.RollSelectNameGet = res.rollName;
        }
       }
     )
  }


  CancelAlerts(){
    this.AlertSucces  = false;
    this.DangerSucces = false;
  }

  CreateAccion(idAccion:any){

    /// DATA-ACCIONES
    this.DataCreateAcciones.IdModulo  = this.IdModuloSelected
    this.DataCreateAcciones.IdRoll    = this.RollSelect
    this.DataCreateAcciones.IdAccion  = idAccion.toString();

    this.permisos.CreatePermisosAcciones(this.DataCreateAcciones).subscribe(
      (res : any) => {

        let status = res.status;

        if (status == true) {
          this.AlertSucces   = true; 
        }else{  
          this.DangerSucces  = true;
        }

      }
    )

  }

  ChoseModulo(IdModulo:any, NombreModulo: string){
    IdModulo = IdModulo.toString();

    ///TRAE LA ACCIONES
    this.CharguerAccion   = true;
    this.AccionesPermisos = [];
    this.ModuloSelected   = NombreModulo;
    this.IdModuloSelected = IdModulo

    this.RollSelect;

    this.permisos.GetAcciones(this.RollSelect, IdModulo).subscribe(
      (res : any) => {
        if(res.status == true){
          this.AccionesPermisos = res.acciones;
          this.CharguerAccion   = false;

        }
      }
    )
  }

  async CreatePermiso (IdModulo:any, NombreModulo: string){
    IdModulo = IdModulo.toString();
    

    this.CharguerAccion       = true;
    this.DataPermiso.IdModulo = IdModulo;
    this.DataPermiso.IdRoll   = this.RollSelect;
    this.IdModuloSelected     = IdModulo;


    await this.permisos.CreatePermisosRol(this.DataPermiso).subscribe(
      (res : any) => {
        if(res.status == true){ 
          this.AlertSucces      = true;
          this.CharguerAccion   = false;
          this.ChoseModulo(IdModulo, NombreModulo);

        }else {
            this.GetPermisosRoll();
            this.DangerSucces = true;
        }
      }
    )

  }

}
