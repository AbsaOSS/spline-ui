/*
 * Copyright 2021 ABSA Group Limited
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

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'

import { idToDataSourceInfo, SplineDataSourceInfo } from '../models'

import { BaseApiService } from './base-api.service'


@Injectable()
export class SplineDataSourceApiService extends BaseApiService {

    constructor(protected readonly http: HttpClient) {
        super(http)
    }

    fetchOne(id: string): Observable<SplineDataSourceInfo> {
        return of(idToDataSourceInfo(id))
            .pipe(
                delay(250)
            )
    }
}
