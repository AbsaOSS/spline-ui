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

import { createSelector } from '@ngrx/store'
import { ExecutionEvent, OperationDetails } from 'spline-api'
import { ProcessingStore } from 'spline-utils'

import { DsOverviewDetailsStateManagement } from '../state-managements'
import { SplineDataSourceStateManagement } from '../state-managements/spline-data-source.state-management'


export namespace DsOverviewDetailsStoreSelectors {

    export const rootState = createSelector(
        SplineDataSourceStateManagement.rootState,
        (_state: SplineDataSourceStateManagement.State) => _state[DsOverviewDetailsStateManagement.STORE_FEATURE_NAME]
    )

    export const loading = createSelector<any, DsOverviewDetailsStateManagement.State, ProcessingStore.EventProcessingState>(
        rootState,
        (_state) => _state.loading
    )

    export const isLoading = createSelector<any, DsOverviewDetailsStateManagement.State, boolean>(
        rootState,
        (_state) => _state.loading.processing
    )

    export const executionEvent = createSelector<any, DsOverviewDetailsStateManagement.State, ExecutionEvent>(
        rootState,
        (_state) => _state.executionEvent
    )

    export const operationDetails = createSelector<any, DsOverviewDetailsStateManagement.State, OperationDetails[]>(
        rootState,
        (_state) => _state.operationDetails
    )

}
