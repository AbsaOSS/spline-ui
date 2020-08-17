/*
 * Copyright 2020 ABSA Group Limited
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
import { Inject, Injectable, Optional } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, filter, tap } from 'rxjs/operators'

import { DEFAULT_SPLINE_CONFIG, SplineConfig, SplineConfigSettings, SPLINE_CONFIG_SETTINGS } from './spline-config.models'


@Injectable({
    providedIn: 'root',
})
export class SplineConfigService {

    config$: Observable<SplineConfig>

    get config(): SplineConfig | null {
        return this._config$.getValue()
    }

    private _config$ = new BehaviorSubject<SplineConfig>(null)

    constructor(private readonly http: HttpClient,
                @Optional() @Inject(SPLINE_CONFIG_SETTINGS) private readonly settings: SplineConfigSettings) {

        this.config$ = this._config$.asObservable()
            .pipe(
                filter(x => !!x),
            )
    }

    getConfig(force = false): Observable<SplineConfig> {
        return this.config !== null && !force
            ? of(this.config)
            : this.fetchConfig()
                .pipe(
                    tap(config => this._config$.next(config)),
                )
    }

    private fetchConfig(): Observable<SplineConfig> {
        return !this.settings
            ? of(DEFAULT_SPLINE_CONFIG)
            : this.http.get<SplineConfig>(
                this.settings.configFileUri,
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
