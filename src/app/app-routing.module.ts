import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { SigninComponent }   from './components/signin/signin.component';
import { SignupComponent }   from './components/signup/signup.component';
import { HomeComponent }     from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoryComponent } from './components/category/category.component';

import { ExamenesComponent } from './components/examenes/examenes.component';
import { CitasComponent } from './components/citas/citas.component';

import { UserProfileComponent } from './components/user-profile/user-profile.component';


import { from } from 'rxjs';
import { PermisosRolesComponent } from './components/permisos-roles/permisos-roles.component';
import { IndexHomeComponent } from './components/index-home/index-home.component';
import { PersonalUsuariosComponent } from './components/personal-usuarios/personal-usuarios.component';

const routes: Routes = [

  { path: '',           redirectTo: '/home', pathMatch: 'full' },
  { path: '*',          redirectTo: '/home', pathMatch: 'full' },
  { path: 'products',   redirectTo: '/home-index', pathMatch: 'full' },

  { path: 'home-index', component: IndexHomeComponent },
  { path: 'home',       component: HomeComponent },
  { path: 'profile',    component: UserProfileComponent },
  { path: 'register',   component: SignupComponent },
  { path: 'login',      component: SigninComponent },
  { path: 'categories', component: CategoryComponent },


  { path: 'usuarios',   component: PersonalUsuariosComponent },

  { path: 'modulos-permisos', component: PermisosRolesComponent },
  { path: 'examenes',         component: ExamenesComponent },
  { path: 'citas',            component: CitasComponent }  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
