import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SeveralServices {
  
    constructor(private http: HttpClient) {} 

    
    GetTipoExamenes(data : string):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/tipo-examenes?data=${data}`);
    }

    GetExamenes(idExamen : string):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/tipo-examenes?idExamen=${idExamen}`);
    }

    GetRollId(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?id_roll=${data}`);
    }

    GetRollLike(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?data=${data}`);
    }

    GetCiudades(Departamento : any):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/ciudades?departamento=${Departamento}`);
    }

    GetClinicas():Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/clinicas`);
    }
} 