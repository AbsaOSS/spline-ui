/*
 * Copyright (c) 2020 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
