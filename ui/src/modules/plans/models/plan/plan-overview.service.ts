/*
 * Copyright 2023 ABSA Group Limited
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
import { ActivatedRoute } from '@angular/router'
import { RouterNavigation } from 'spline-utils'
import { QueryParamAlis } from './query-param-alis'
import { RouterState } from './router-state'


@Injectable()
export class PlanOverviewService {


    extractRouterState(activatedRoute: ActivatedRoute): RouterState {
        return {
            [QueryParamAlis.ExecutionPlanId]: activatedRoute.snapshot.params[QueryParamAlis.ExecutionPlanId],
            [QueryParamAlis.ExecutionEventId]: RouterNavigation.extractQueryParam(activatedRoute, QueryParamAlis.ExecutionEventId),
            [QueryParamAlis.SelectedNodeId]: RouterNavigation.extractQueryParam(activatedRoute, QueryParamAlis.SelectedNodeId),
            [QueryParamAlis.SelectedAttributeId]: RouterNavigation.extractQueryParam(activatedRoute, QueryParamAlis.SelectedAttributeId),
        }
    }

    getSelectedNodeId(activatedRoute: ActivatedRoute): string {
        return RouterNavigation.extractQueryParam(activatedRoute, QueryParamAlis.SelectedNodeId)
    }

    getSelectedAttributeId(activatedRoute: ActivatedRoute): string {
        return RouterNavigation.extractQueryParam(activatedRoute, QueryParamAlis.SelectedAttributeId)
    }
}
