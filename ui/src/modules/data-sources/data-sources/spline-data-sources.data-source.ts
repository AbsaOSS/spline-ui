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

import { Observable } from 'rxjs'
import { ExecutionEvent, ExecutionEventFacade, ExecutionEventField, ExecutionEventsPageResponse, ExecutionEventsQuery } from 'spline-api'
import { QuerySorter, SearchDataSource, SearchQuery } from 'spline-utils'
import SearchParams = SearchQuery.SearchParams;
import SortDir = QuerySorter.SortDir;


export class SplineDataSourcesDataSource extends SearchDataSource<ExecutionEvent,
    ExecutionEventsPageResponse,
    ExecutionEventsQuery.QueryFilter,
    ExecutionEventField> {

    constructor(
        protected readonly executionEventFacade: ExecutionEventFacade
    ) {
        super(() => ({
            defaultSearchParams: {
                filter: {
                    asAtTime: new Date().getTime()
                },
                sortBy: [
                    {
                        field: ExecutionEventField.dataSourceName,
                        dir: SortDir.ASC
                    }
                ]
            }
        }))
    }

    protected getDataObserver(
        searchParams: SearchParams<ExecutionEventsQuery.QueryFilter, ExecutionEventField>
    ): Observable<ExecutionEventsPageResponse> {

        const queryParams = ExecutionEventsQuery.toQueryParams(searchParams)
        return this.executionEventFacade.fetchListAggregatedByDataSource(queryParams)
    }

}
