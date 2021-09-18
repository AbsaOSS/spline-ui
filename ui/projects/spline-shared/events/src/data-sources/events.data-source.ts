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
import {
    ExecutionEvent,
    ExecutionEventFacade,
    ExecutionEventField,
    ExecutionEventsPageResponse,
    ExecutionEventsQuery,
} from 'spline-api'
import { QuerySorter, SearchDataSource, SearchQuery, StringHelpers } from 'spline-utils'
import SortDir = QuerySorter.SortDir
import SearchParams = SearchQuery.SearchParams


export class EventsDataSource extends SearchDataSource<ExecutionEvent,
    ExecutionEventsPageResponse,
    ExecutionEventsQuery.QueryFilter,
    ExecutionEventField> {

    constructor(protected readonly executionEventFacade: ExecutionEventFacade) {
        super()

        this.updateDefaultSearchParams({
            filter: {
                asAtTime: new Date().getTime()
            },
            sortBy: [
                {
                    field: ExecutionEventField.timestamp,
                    dir: SortDir.DESC
                }
            ]
        })
    }

    searchParamsFromUrlString(
        searchParamsUrlString: string): SearchParams<ExecutionEventsQuery.QueryFilter, ExecutionEventField> {

        const searchParams = StringHelpers
            .decodeObjFromUrlString<SearchParams<ExecutionEventsQuery.QueryFilter, ExecutionEventField>>(
                searchParamsUrlString
            )

        if (!searchParams) {
            return { ...this.defaultSearchParams }
        }

        return {
            ...searchParams,
            filter: {
                ...searchParams.filter,
                executedAtFrom: searchParams.filter.executedAtFrom ? new Date(searchParams.filter.executedAtFrom) : undefined,
                executedAtTo: searchParams.filter.executedAtTo ? new Date(searchParams.filter.executedAtTo) : undefined,
            }
        }
    }

    protected getDataObserver(
        searchParams: SearchParams<ExecutionEventsQuery.QueryFilter, ExecutionEventField>
    ): Observable<ExecutionEventsPageResponse> {

        const queryParams = this.toQueryParams(searchParams)
        return this.executionEventFacade.fetchList(queryParams)
    }

    protected toQueryParams(
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
