import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Permisos {
  
    constructor(private http: HttpClient) {} 

    
    GetPermisos(data : any):Observable<any>{
      return this.http.get(`${GLOBAL.UrlLocalTest}/api/user-permisos?id_user=${data}`);
    }   

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    GetOwnRoll(IdUser: any, Action:string):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/user-permisos?id_user=${IdUser}&action=${Action}`);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    GetRoles(data : Object, roll: Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?id_roll=${roll}&data=${data}`);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    GetPermisosRoles(data : Object, roll: any, modulo: any):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles-permisos?id_roll=${roll}&data=${data}&id_modulo=${modulo}`);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    CreatePermisosRol(Data: Object):Observable<any>{
        return this.http.post(`${GLOBAL.UrlLocalTest}/api/roles-permisos`,Data);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    GetRollId(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?id_roll=${data}`);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    GetRollLike(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?data=${data}`);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    GetAcciones(IdRoll : string, IdModulo : string):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/acciones-permisos?IdRoll=${IdRoll}&IdModulo=${IdModulo}`);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    CreatePermisosAcciones(data : Object):Observable<any>{
        return this.http.post(`${GLOBAL.UrlLocalTest}/api/acciones-permisos`,data);
    }
}