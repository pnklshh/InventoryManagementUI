import {map} from 'rxjs/operators';
import { Component, Injectable } from '@angular/core';
import { Http,Response, RequestOptions, Headers } from '@angular/http'; 

import { Observable } from 'rxjs';

@Injectable()
export class ApiServiceCall {

    public baseUrl: string = "http://localhost:8001/";
    //public baseUrl: string = "http://localhost:62046/";
    public UIHostUrl: string = "http://localhost:8000/";

    constructor(private http: Http){}

    GetData(urlToAppend: string)
    {
        let url = this.baseUrl + urlToAppend;
        let headers=new Headers();
        headers.append('Access-Control-Allow-Origin','*');
        let options=new RequestOptions({headers:headers});
        return this.http.get(url,options).pipe(
        map((res:Response) => res.json()));
        
    }

    PostData(urlToAppend: string, body: string)
    {
        let url = this.baseUrl + urlToAppend;
        let headers=new Headers();
        headers.append('Content-Type','application/json');
        headers.append('Access-Control-Allow-Origin','*');
        let options=new RequestOptions({headers:headers});
        return this.http.post(url,body,options).pipe(
        map((res:Response) => res.json()));
        
    }

    
}
