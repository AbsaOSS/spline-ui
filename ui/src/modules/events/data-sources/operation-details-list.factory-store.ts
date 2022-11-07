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

import { forkJoin, Observable, of } from 'rxjs'
import { ExecutionPlanApiService, OperationDetails } from 'spline-api'
import { SimpleFactoryStore } from 'spline-utils'


export type OperationDetailsListFilter = {
    executionPlanIds: string[]
}

export class OperationDetailsListFactoryStore extends SimpleFactoryStore<OperationDetails[], OperationDetailsListFilter> {

    constructor(private readonly executionPlanApiService: ExecutionPlanApiService) {
        super()
    }

    protected getDataObserver(filter: OperationDetailsListFilter): Observable<OperationDetails[]> {
        return filter.executionPlanIds.length
               ? forkJoin(
                filter.executionPlanIds
                    .map(planId => this.executionPlanApiService.fetchExecutionPlanRootOperationDetails(planId))
            )
               : of([])
    }

}
