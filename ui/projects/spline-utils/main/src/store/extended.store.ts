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
import { map } from 'rxjs/operators'

import { BaseStore } from './base.store'
import { ProcessingStoreNs } from './processing-store.ns'


export type StateWithLoading = {
    loading: ProcessingStoreNs.EventProcessingState
}

export abstract class ExtendedStore<TState extends StateWithLoading> extends BaseStore<TState> {

    readonly loadingEvents: ProcessingStoreNs.ProcessingEvents<TState>
    readonly loading$: Observable<ProcessingStoreNs.EventProcessingState>

    protected constructor(defaultState: TState = null) {

        super(defaultState)

        this.loadingEvents = ProcessingStoreNs.createProcessingEvents(
            this.state$, (state) => state.loading
        )

        this.loading$ = this.state$.pipe(map(data => data.loading))
    }

}
