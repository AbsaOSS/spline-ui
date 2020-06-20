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

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { DEFAULT_SPLINE_CONFIG, SplineConfig } from './spline-config.models'


@Injectable()
export class SplineConfigService {

    constructor(private readonly http: HttpClient) {
    }

    fetchConfig(): Observable<SplineConfig> {
        return this.http.get<SplineConfig>(
            environment.appConfigUri,
            {
                headers: new HttpHeaders({
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                }),
            },
        )
            .pipe(
                catchError(() => of(DEFAULT_SPLINE_CONFIG)),
            )
    }
}
