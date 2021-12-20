import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpParams, HttpHeaders} from '@angular/common/http';

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

    ListDataExamen( id_user : Object, roll: Object, mood : any, DataSearch : string, id_examenes : any ):Observable<any>{
 
        return  this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes?roll=${roll}&id_user=${id_user}&mood=${mood}&data=${DataSearch}&id_examen=${id_examenes}`);

    }

    public uploadImage(image: File): Observable<any> {
        const formData = new FormData();
    
        formData.append('image', image);
    
        return this.http.post('/assets/examenes', formData);
      }

    upload( file: File , id_estados: string, examen : string ): Observable<HttpEvent<any>>{
 
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');

        const formData: FormData = new FormData();
        formData.append('imagenes', file);
        formData.append('name', examen);
        formData.append('id_estados', id_estados);

        //myFormData.append('image', this.filedata);

        const endpoint = '/assets/examenes';
        const DataAgnular: FormData = new FormData();
        DataAgnular.append(id_estados , file, examen);
        this.http
        .post(endpoint, formData, { headers: headers });
        //.map(() => { return true; })
        //.catch((e) => this.handleError(e));

       
        const req = new HttpRequest('POST', `${GLOBAL.UrlLocalTest}/api/examenes-adjuntos`, formData, {
          reportProgress: true,
          responseType: 'json',
          headers: headers
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

    GetExamenes( id_user : Object, roll: Object, mood : any, DataSearch : string, id_examenes : any, page : any ):Observable<any>{
        return this.http.get(`${GLOBAL.UrlLocalTest}/api/examenes?roll=${roll}&id_user=${id_user}&mood=${mood}&data=${DataSearch}&id_examen=${id_examenes}&page=${page}`);
    }

    DeleteExamen( id_examenes : any ):Observable<any>{
        return this.http.delete(`${GLOBAL.UrlLocalTest}/api/examenes/${id_examenes}`); 
    }
} 