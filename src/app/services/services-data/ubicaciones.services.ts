import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Ubicaciones {
  
    constructor(private http: HttpClient) {} 

    
    GetPaises():Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/paises`);
    }

    GetDepartamentos(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/departamentos?id_pais=${data}`);
    }

    GetCiudad(id_dep : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/ciudades?departamento=${id_dep}`);
    }
} 