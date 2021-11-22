import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent,HttpParams} from '@angular/common/http';

import { GLOBAL } from '../global'
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class ExamenesServices {

    constructor(private http: HttpClient) {} 

    GetPersonalRoll(IdRoll: string, Data: string):Observable<any>{
        return  this.http.get(`${GLOBAL.UrlLocalTest}/api/personas?id_roll=${IdRoll}&data=${Data}`);
    }

    CreateExamen(Data:Object):Observable<any>{
        return  this.http.post(`${GLOBAL.UrlLocalTest}/api/examenes`,Data);
    }

    ListExamenes(idExamen: string, Data: string,  page:number|undefined):Observable<any>{
        return  this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes?id_examen=${idExamen}&data=${Data}&page=${page}`);
    }

    ListDataExamen(idExamen: string, Data: string,  mood : any ):Observable<any>{
        return  this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes?id_examen=${idExamen}&data=${Data}&mood=${mood}`);
    }

    upload( file: File , id_estados: string, examen : string ): Observable<HttpEvent<any>>{
        const formData: FormData = new FormData();
        formData.append('imagenes', file);
        formData.append('name', examen);
        formData.append('id_estados', id_estados);
       
        const req = new HttpRequest('POST', `${GLOBAL.UrlLocalTest}/api/examenes-adjuntos`, formData, {
          reportProgress: true,
          responseType: 'json'
        });
        return this.http.request(req);
    }

    //Metodo para Obtener los archivos
    getFiles( idExamen : string ):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes-adjuntos?idExamen=${idExamen}`);
    }

    //Metodo para borrar los archivos
    deleteFile(filename: string){
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes-adjuntos/${filename}`);
    }

    GetExamenes(id_user : Object, roll: Object, mood : any, DataSearch : string, id_examenes : any ):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes?roll=${roll}&id_user=${id_user}&mood=${mood}&data=${DataSearch}&id_examen=${id_examenes}`);
    }

    DeleteExamen( id_examenes : any ):Observable<any>{
        return this.http.delete(`${GLOBAL.UrlLocalTest}/api/examenes/${id_examenes}`); 
    }
} 