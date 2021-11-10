import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Citas {
  
    constructor(private http: HttpClient) {} 

    
    GetCitas(id_user : Object, roll: Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes-estado?roll=${roll}&id_user=${id_user}`);
    }

}