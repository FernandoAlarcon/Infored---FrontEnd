import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Permisos } from '../../services/services-data/user-permisos.service';
import { AuthStateService } from '../../shared/auth-state.service';

export class User {
  id    : any = 0;
  name  : String = '';
  email : String = '';
}

@Component({
  selector: 'app-vertical-nav-bar',
  templateUrl: './vertical-nav-bar.component.html',
  styleUrls: ['./vertical-nav-bar.component.css']
})
export class VerticalNavBarComponent implements OnInit {
  isSignedIn   : boolean | undefined;
  UserProfile  : User    | undefined;
  PermisosData : any = []; 
  StateArrow   : any = false; 

  constructor(
              private auth        : AuthStateService,
              public authService  : AuthService,
              private permisos    : Permisos
  ){
    
  }

  ngOnInit() {

    this.authService.profileUser().subscribe((data:any) => {
      this.UserProfile = data;
      this.getPermisos();
    })

    //#content
    $('#sidebar ').toggleClass('active');

    this.auth.userAuthState.subscribe(val => {
        this.isSignedIn = val;
    });
        
  }

  getPermisos():void{ 

    this.permisos.GetPermisos(this.UserProfile?.id).subscribe(
      (res:any) => {
         if(res.status == true) {
           this.PermisosData = res.permisos;
           console.log(this.PermisosData)
         }
      }
    )

  }

  changeState(){
    $('#sidebar, #content, #active-button').toggleClass('active');
 
    if(this.PermisosData.length == 0){
      this.getPermisos();
    }

    if(this.StateArrow == true){
      this.StateArrow = false;
    }else{
      this.StateArrow = true;
    } 
  }

}
