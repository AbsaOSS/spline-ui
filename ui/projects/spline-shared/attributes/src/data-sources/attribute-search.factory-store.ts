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

import { Observable, of } from 'rxjs'
import { AttributeApiService } from 'spline-api'
import { SimpleFactoryStore } from 'spline-utils'

import { SplineAttributeSearch } from '../models'


export type AttributeSearchDataSourceFilter = {
    search: string
}

export class AttributeSearchFactoryStore extends SimpleFactoryStore<SplineAttributeSearch.Data, AttributeSearchDataSourceFilter> {
    constructor(private readonly attributeApiService: AttributeApiService) {
        super()
    }

    protected getDataObserver(filterValue: AttributeSearchDataSourceFilter): Observable<SplineAttributeSearch.Data> {
        return filterValue?.search?.length
               ? this.attributeApiService.search(filterValue.search)
               : of([])
    }

}
