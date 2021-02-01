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


import { Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { ExecutionEventField, ExecutionEventsQuery } from 'spline-api'
import { SearchQuery } from 'spline-utils'

import { DsOverviewHistoryStoreActions, DsOverviewStore, DsOverviewStoreSelectors } from '../../store'
import SearchParams = SearchQuery.SearchParams


@Injectable()
export class DsOverviewHistoryStoreFacade {

    readonly state$: Observable<DsOverviewStore.State>
    readonly isInitialized$: Observable<boolean>

    constructor(private readonly store: Store<any>) {
        this.state$ = this.store.pipe(select(DsOverviewStoreSelectors.rootState))
        this.isInitialized$ = this.store.pipe(select(DsOverviewStoreSelectors.isInitialized))
    }

    fetchHistory(queryParams: SearchParams<ExecutionEventsQuery.QueryFilter, ExecutionEventField>): void {
        this.store.dispatch(
            new DsOverviewHistoryStoreActions.FetchHistoryRequest({
                queryParams
            })
        )
    }
}
