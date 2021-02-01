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

import { ExecutionEventField, ExecutionEventsPageResponse } from 'spline-api'
import { SplineDateRangeFilter } from 'spline-common'
import { DEFAULT_PAGER, ProcessingStore, QueryPager, QuerySorter } from 'spline-utils'

import { DsOverviewHistoryStoreActions } from '../actions'
import ActionTypes = DsOverviewHistoryStoreActions.ActionTypes


export namespace DsOverviewHistoryStore {

    export const STORE_FEATURE_NAME = 'overviewHistory'

    export type State = {
        executionEventsPage: ExecutionEventsPageResponse | null
        loading: ProcessingStore.EventProcessingState
        dataSourceUri: string
        dateFilter: SplineDateRangeFilter.Value
        sortBy: QuerySorter.FieldSorter<ExecutionEventField>[]
        searchTerm: string
        firstRequestAt: Date
        pager: QueryPager
    }

    export function getInitState(): State {
        return {
            executionEventsPage: null,
            loading: ProcessingStore.getDefaultProcessingState(true),
            dataSourceUri: null,
            searchTerm: '',
            dateFilter: null,
            sortBy: [],
            firstRequestAt: null,
            pager: { ...DEFAULT_PAGER }
        }
    }

    export function reducer(state = getInitState(),
                            action: DsOverviewHistoryStoreActions.Actions): State {

        switch (action.type) {
            case ActionTypes.FetchHistoryRequest:
                return {
                    ...state,
                    firstRequestAt: new Date(),
                    loading: ProcessingStore.eventProcessingStart(state.loading)
                }

            case ActionTypes.FetchHistorySuccess:
                return {
                    ...state,
                    executionEventsPage: action.payload.executionEventsPage,
                    loading: ProcessingStore.eventProcessingFinish(state.loading)
                }

            case ActionTypes.FetchHistoryError:
                return {
                    ...state,
                    loading: ProcessingStore.eventProcessingFinish(state.loading, action.payload.error)
                }
            default:
                return { ...state }
        }

    }
}
