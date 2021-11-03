import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { TokenService } from '../../shared/token.service'; 
import { AuthService } from 'src/app/shared/auth.service';
import { Permisos } from '../../services/services-data/user-permisos.service';
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
              // private ClientFunction: ClientesComponent,
              // private clientesService: ClientesService,
              public  token          : TokenService,
              public  authService    : AuthService,
              private auth           : AuthStateService, 
              private router         : Router,
              private permisos       : Permisos,
              private activatedRoute : ActivatedRoute ) {}

  ngOnInit() {

    this.auth.userAuthState.subscribe(val => {
        this.isSignedIn = val;

    });

    this.authService.profileUser().subscribe((data:any) => {
      this.UserProfile = data; 
      this.getPermisos();
    })

        
  } /// FINAL ngOnInit

  getPermisos():void{ 

    this.permisos.GetPermisos(this.UserProfile?.id).subscribe(
      (res:any) => {
         if(res.status == true) {
           this.PermisosData = res.permisos;
           console.log({ DataPermisos : this.PermisosData})
         }
      }
    )

  }


   // Signout
  signOut() {
    this.auth.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['login']);
  }

  
}
