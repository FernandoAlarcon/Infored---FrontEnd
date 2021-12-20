import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Personas {
  
    constructor( private http: HttpClient ) {} 

    GetPersonas(data : Object, mood: Object, page : any):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/personas?mood=${mood}&data=${data}&page=${page}`);
    }

    GetPersonasData(data : Object, mood: Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/personas?mood=${mood}&data=${data}`);
    }

    CrearPersonas( Data : Object ):Observable<any>{
        return this.http.post(`${GLOBAL.UrlLocalTest}/api/personas`, Data);
    }
 
}