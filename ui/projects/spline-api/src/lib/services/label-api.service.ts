/*
 * Copyright 2023 ABSA Group Limited
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

import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { LabelPageQueryParams, LabelValuesPageQueryParams } from 'spline-utils'

import { ExecutionEventsQuery } from '../models'

import { BaseApiService } from './base-api.service'


@Injectable()
export class LabelApiService extends BaseApiService {

    constructor(protected readonly http: HttpClient) {
        super(http)
    }

    fetchList(queryParams: LabelPageQueryParams | LabelValuesPageQueryParams): Observable<string[]> {
        // Adapter LabelQuery to LabelHttpParams
        const params = ExecutionEventsQuery.labelQueryParamsToHttpParams(queryParams)
        const url = this.getConsumerApiResourceURL(`labels/names${ ('labelName' in queryParams) && queryParams.labelName
            ? `/${ queryParams.labelName }/values`
            : '' }`)
        return this.http.get<string[]>(url, { params: params })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error(error)
                    return throwError(error)
                })
            )
    }
}
