import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BaseURLInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const baseUrl = 'http://127.0.0.1:8000/';
        const apiReq = req.clone({ 
            url: `${baseUrl}${req.url}`
         });
        return next.handle(apiReq);
    }
}