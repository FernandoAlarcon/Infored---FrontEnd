import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';

 


// COMPONENTES
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

// RUTAS
import { AppRoutingModule } from './app-routing.module';
// STYLES 
import { MDBBootstrapModule } from 'angular-bootstrap-md';
// JQUERY
import * as $ from 'jquery';

// LIBRERIAS
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoryComponent } from './components/category/category.component';
import { IndexHomeComponent } from './components/index-home/index-home.component';
import { VerticalNavBarComponent } from './components/vertical-nav-bar/vertical-nav-bar.component';
import { PermisosRolesComponent } from './components/permisos-roles/permisos-roles.component';
import { ExamenesComponent } from './components/examenes/examenes.component';
import { CitasComponent } from './components/citas/citas.component';
import { FooterComponent } from './components/footer/footer.component';
import { DiagnosticoComponent } from './components/diagnostico/diagnostico.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// QUIL 
import * as  Quill from 'ngx-quill'; 
import { QuillModule } from 'ngx-quill'
import QuillType from 'quill';  
// MATERIAL UI
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';


/// CALENDAR 
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
 
import dayGridPlugin          from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin      from '@fullcalendar/interaction'; 
//import resourceTimelinePlugin from '@fullcalendar/resource-timeline'; // a plugin!

import Counter from './counter';
import { CalendarioComponent } from './components/citas/calendario/calendario.component';
 

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,  
    SigninComponent,
    SignupComponent,
    UserProfileComponent,
    NavigationComponent,
    HomeComponent,
    ProductsComponent,
    CategoryComponent,
    IndexHomeComponent,
    VerticalNavBarComponent,
    PermisosRolesComponent,
    ExamenesComponent,
    CitasComponent,
    FooterComponent,
    DiagnosticoComponent,
    CalendarioComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,

    
    QuillModule.forRoot({
      customModules: [{
        implementation: Counter,
        path: 'modules/counter'
      }],
      customOptions: [{
        import: 'formats/font',
        whitelist: ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace']
      }]
    }),
    FullCalendarModule, 
    
  ],
  providers: [
    {  
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor,
      multi: true
    },
    {  
      provide: APP_BASE_HREF, 
      useValue : '/' , 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
