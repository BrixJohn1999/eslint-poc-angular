import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {


    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${access_token}`
                }
            })
        }

        return next.handle(request);
    }
}
