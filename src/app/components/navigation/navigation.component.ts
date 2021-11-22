import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { TokenService } from '../../shared/token.service'; 
import { AuthService } from 'src/app/shared/auth.service';

import { Permisos } from '../../services/services-data/user-permisos.service';
import { Usuarios } from '../../services/services-data/usuarios.services';

import { AuthStateService } from '../../shared/auth-state.service';

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
              private userService    : Usuarios  ) {}

  ngOnInit() {

    this.auth.userAuthState.subscribe( ( val : any ) => {
        this.isSignedIn = val;

        if(!this.isSignedIn || val.message == 'Unauthenticated.' || val.message == 'Unauthenticated'  ){
          this.signOut();
        }
    });

    this.authService.profileUser().subscribe((data:any) => {

      if ( data.message == 'Unauthenticated.' || data.message == 'Unauthenticated' || data.status == "Unauthorized" ) {
        this.signOut();
      }else{

        this.UserProfile = data; 
        this.getPermisos();
        this.GetUsers();

      }

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
 
   // Signout
  signOut() {
    this.auth.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['home']);
    window.location.href = 'home-index';

  }

  GetUsers(){
    this.userService.GetUsuarios( this.DataSearchUsers, '2' ).subscribe(
      ( res : any ) => {

      }
    )
  }

  
}
