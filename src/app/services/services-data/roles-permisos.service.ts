import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class RollServices {
  
    constructor(private http: HttpClient) {} 

    
    GetRoles(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles`);
    }

    GetRollId(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?id_roll=${data}`);
    }

    GetRollLike(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?data=${data}`);
    }

    UpdateRoll(id_roll : string, id_user : any ):Observable<any>{
        return this.http.put(`${GLOBAL.UrlLocalTest}/api/user-permisos/${ id_roll }`, id_user);
    }
} 