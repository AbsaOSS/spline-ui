import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { API_BASE_PATH_MAP, getApiBasePath } from '../models/spline-api-config.models'


@Injectable()
export class SplineApiConfigInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.hasUrlAnyApiAlias(request.url)) {
            request = request.clone({
                url: this.decorateUrl(request.url),
            })
            return next.handle(request)
        }
        else {
            return next.handle(request)
        }
    }

    protected hasUrlAnyApiAlias(url): boolean {
        for (const alias in API_BASE_PATH_MAP) {
            if (url.indexOf(alias) === 0) {
                return true
            }
        }
        return false
    }

    protected decorateUrl(url): string {
        for (const alias in API_BASE_PATH_MAP) {
            if (url.indexOf(alias) === 0) {
                return url.replace(alias, getApiBasePath(alias))
            }
        }
        console.log(url)
        return url
    }
}
