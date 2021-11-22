import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Usuarios {
  
    constructor(private http: HttpClient) {} 

    
    GetUsuarios( DataSearch : string, mood : string ):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/personas?data=${DataSearch}&mood=${mood}`);
    }

    
}