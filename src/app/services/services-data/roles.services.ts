import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Roles {
  
    constructor(private http: HttpClient) {} 

    
    GetRoles(data : Object, roll: Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?id_roll=${roll}&data=${data}`);
    }

    GetRollId(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?id_roll=${data}`);
    }

    GetRollLike(data : Object):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/roles?data=${data}`);
    }
}