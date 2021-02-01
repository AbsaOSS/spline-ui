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

import { Action } from '@ngrx/store'
import { ExecutionEventsPageResponse, ExecutionEventsQuery } from 'spline-api'


export namespace DsOverviewHistoryStoreActions {


    export enum ActionTypes {
        Init = '[DS Overview :: History] :: Init',
        FetchHistoryRequest = '[DS Overview :: History] :: Fetch :: Request',
        FetchHistorySuccess = '[DS Overview :: History] :: Fetch :: Success',
        FetchHistoryError = '[DS Overview :: History] :: Fetch :: Error'
    }

    export class Init implements Action {

        readonly type = ActionTypes.FetchHistoryRequest

        constructor(public payload: { queryParams: ExecutionEventsQuery.QueryParams }) {

        }
    }

    export class FetchHistoryRequest implements Action {

        readonly type = ActionTypes.FetchHistoryRequest

        constructor(public payload: { queryParams: ExecutionEventsQuery.QueryParams }) {

        }
    }

    export class FetchHistorySuccess implements Action {

        readonly type = ActionTypes.FetchHistorySuccess

        constructor(public payload: { executionEventsPage: ExecutionEventsPageResponse }) {

        }
    }

    export class FetchHistoryError implements Action {

        readonly type = ActionTypes.FetchHistoryError

        constructor(public payload: { error: any }) {

        }
    }

    export type Actions =
        | FetchHistoryRequest
        | FetchHistorySuccess
        | FetchHistoryError
}
