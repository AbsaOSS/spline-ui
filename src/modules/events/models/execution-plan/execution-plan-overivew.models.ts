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


import { ActivatedRoute } from '@angular/router'
import _ from 'lodash'
import { ExecutionEventsQuery } from 'spline-api'


export namespace ExecutionPlanOverview {

    import QueryParams = ExecutionEventsQuery.QueryParams


    export enum QueryParamAlis {
        ExecutionPlanId = 'planId',
        ExecutionEventId = 'eventId',
        SelectedNodeId = 'nodeId',
        SelectedAttributeId = 'attributeId',
    }

    export type RouterState = {
        [QueryParamAlis.ExecutionPlanId]: string
        [QueryParamAlis.ExecutionEventId]: string | null
        [QueryParamAlis.SelectedNodeId]: string | null
        [QueryParamAlis.SelectedAttributeId]: string | null
    }

    export function extractRouterState(activatedRoute: ActivatedRoute): RouterState {
        return {
            [QueryParamAlis.ExecutionPlanId]: activatedRoute.snapshot.params['planId'],
            [QueryParamAlis.ExecutionEventId]: extractQueryParam(activatedRoute, QueryParamAlis.ExecutionEventId),
            [QueryParamAlis.SelectedNodeId]: extractQueryParam(activatedRoute, QueryParamAlis.SelectedNodeId),
            [QueryParamAlis.SelectedAttributeId]: extractQueryParam(activatedRoute, QueryParamAlis.SelectedAttributeId),
        }
    }

    export function getSelectedNodeId(activatedRoute: ActivatedRoute): string {
        return extractQueryParam(activatedRoute, QueryParamAlis.SelectedNodeId)
    }

    export function getSelectedAttributeId(activatedRoute: ActivatedRoute): string {
        return extractQueryParam(activatedRoute, QueryParamAlis.SelectedAttributeId)
    }

    export function extractQueryParam(activatedRoute: ActivatedRoute, queryParamName: string): string | null {
        return activatedRoute.snapshot.queryParamMap.get(queryParamName)
    }

    export function updateQueryParams(activatedRoute: ActivatedRoute, alias: string, value: string | null): QueryParams {
        return value
            ? {
                ...activatedRoute.snapshot.queryParams,
                [alias]: value,
            }
            : _.omit(this.activatedRoute.snapshot.queryParams, alias)
    }
}
