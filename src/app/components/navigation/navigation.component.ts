import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { TokenService } from '../../shared/token.service'; 
import { AuthService } from 'src/app/shared/auth.service';

import { Permisos } from '../../services/services-data/user-permisos.service';
import { Usuarios } from '../../services/services-data/usuarios.services';

import { AuthStateService } from '../../shared/auth-state.service';
import { ToastrService } from 'ngx-toastr';

export class User {
  id    : any = 0;
  name  : String = '';
  email : String = '';
}

@Component({
  //providers:[ClientesComponent],
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  
  isSignedIn   : boolean | undefined;
  UserProfile  : User    | undefined;
  PermisosData : any = []; 
  StateArrow   : any = false; 

  RollData     : any = [];

  DataSearchUsers : string = "";
 
  cliente = {
    id:'',
    nombre:'',
    documento:'',
    telefono:'',
    direccion:'',
    email:'',
    estado:''
  };
 
  busquedad = '';
  clientesService: any;
  ClientFunction: any;


  constructor( 
              public  token          : TokenService,
              public  authService    : AuthService,
              private auth           : AuthStateService, 
              private router         : Router,
              private permisos       : Permisos,
              private activatedRoute : ActivatedRoute,
              private userService    : Usuarios,
              private toastr         : ToastrService
              ) {}

  ngOnInit() {

    this.auth.userAuthState.subscribe( ( val : any ) => {
        this.isSignedIn = val;
        
        if(!this.isSignedIn || val.message == 'Unauthenticated.' || val.message == 'Unauthenticated' || val == false ){
          this.signOut();
        }
    },(error) => { 
      this.toastr.error('Tu session ah expirado'); 
      this.signOut();
    });

    this.authService.profileUser().subscribe((data:any) => {

       
      if ( data.id == undefined || data.id == '' || data.message == 'Unauthenticated.' || data.message == 'Unauthenticated' || data.status == "Unauthorized" ) {
        this.signOut();
      }else{

        this.UserProfile = data; 
        this.getPermisos();
        this.GetUsers();

      }

    },(error) => { 
      this.toastr.error('Tu session ah expirado'); 
      this.signOut();
    });

        
  } /// FINAL ngOnInit

  async getPermisos(){ 

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

  }
 
   // Signout
  signOut() {
    this.auth.setAuthState(false);
    this.token.removeToken();
    window.location.href = 'login';
    this.router.navigate(['login']);

  }

  GetUsers(){
    this.userService.GetUsuarios( this.DataSearchUsers, '2' ).subscribe(
      ( res : any ) => {

      }
    )
  }

  
}
