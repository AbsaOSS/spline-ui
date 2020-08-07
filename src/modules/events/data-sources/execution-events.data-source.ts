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

import { Observable } from 'rxjs'
import { ExecutionEvent, ExecutionEventFacade, ExecutionEventField, ExecutionEventsPageResponse, ExecutionEventsQuery } from 'spline-api'
import { SearchDataSource, SearchQuery } from 'spline-utils'


export class ExecutionEventsDataSource extends SearchDataSource<ExecutionEvent,
    ExecutionEventsPageResponse,
    ExecutionEventsQuery.QueryFilter,
    ExecutionEventField> {

    private initialRequestTime: Date

    constructor(private readonly executionEventFacade: ExecutionEventFacade) {
        super()

    }

    protected getDataObserver(
        searchParams: SearchQuery.SearchParams<ExecutionEventsQuery.QueryFilter, ExecutionEventField>,
        force: boolean,
    ): Observable<ExecutionEventsPageResponse> {


        const queryParams = this.toQueryParams({
            ...searchParams,
            filter: {
                ...searchParams.filter,
                asAtTime: this.initialRequestTime ? this.initialRequestTime.getTime() : undefined,
            },
        })

        if (!this.initialRequestTime) {
            this.initialRequestTime = new Date()
        }

        return this.executionEventFacade.fetchList(queryParams)
    }

    private toQueryParams(
        searchParams: SearchQuery.SearchParams<ExecutionEventsQuery.QueryFilter, ExecutionEventField>,
    ): ExecutionEventsQuery.QueryParams {
        const queryFilter = {
            ...searchParams.filter,
            ...searchParams.staticFilter,
            searchTerm: searchParams.searchTerm,
        }
        return {
            filter: queryFilter,
            pager: searchParams.pager,
            sortBy: searchParams.sortBy,
        }
    }
}
