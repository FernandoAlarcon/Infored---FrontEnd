import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Citas {
  
    constructor(private http: HttpClient) {} 

    
    GetCitas(id_user : Object, roll: Object, mood : any, DataSearch : string):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes-estado?roll=${roll}&id_user=${id_user}&mood=${mood}&data=${DataSearch}`);
    }

    DeleteCitas(id_cita : Object):Observable<any>{
        return this.http.delete(`${GLOBAL.UrlLocalTest}/api/examenes/${id_cita}`);
    }

    UpdateStateCitas(id_examen : string, data : any ):Observable<any>{
        return this.http.put(`${GLOBAL.UrlLocalTest}/api/examenes/${id_examen}`, data );
    }

}