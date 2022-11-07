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

import { ActionReducerMap, createFeatureSelector } from '@ngrx/store'

import { DsOverviewDetailsStateManagement } from './ds-overview-details.state-management'
import { DsOverviewStateManagement } from './ds-overview.state-management'


export namespace SplineDataSourceStateManagement {

    export const STORE_FEATURE_NAME = 'dataSources'

    export type State = {
        [DsOverviewStateManagement.STORE_FEATURE_NAME]: DsOverviewStateManagement.State
        [DsOverviewDetailsStateManagement.STORE_FEATURE_NAME]: DsOverviewDetailsStateManagement.State
    }

    export const reducers: ActionReducerMap<State> = {
        [DsOverviewStateManagement.STORE_FEATURE_NAME]: DsOverviewStateManagement.reducer,
        [DsOverviewDetailsStateManagement.STORE_FEATURE_NAME]: DsOverviewDetailsStateManagement.reducer
    }

    export const rootState = createFeatureSelector<State>(STORE_FEATURE_NAME)
}
