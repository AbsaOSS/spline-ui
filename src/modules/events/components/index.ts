/*
 * Copyright 2020 ABSA Group Limited
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

import { AttributeLineageInfoComponent } from './attribute-lineage-info/attribute-lineage-info.component'
import { SplineDateFilterComponent } from './date-filter/date-filter.component'
import { EventInfoComponent } from './event-info/event-info.component'
import { ExecutionPlanInfoComponent } from './execution-plan-info/execution-plan-info.component'
import { SgLegendComponent } from './graph-legend/sg-legend.component'
import { OperationInfoComponent } from './operation-info/operation-info.component'
import { SgHighlightedRelationsActionsComponent } from './sg-highlighted-relations-actions/sg-highlighted-relations-actions.component'


export const components: any[] = [
    EventInfoComponent,
    ExecutionPlanInfoComponent,
    OperationInfoComponent,
    AttributeLineageInfoComponent,
    SgLegendComponent,
    SplineDateFilterComponent,
    SgHighlightedRelationsActionsComponent,
]

export * from './event-info/event-info.component'
export * from './execution-plan-info/execution-plan-info.component'
export * from './operation-info/operation-info.component'
export * from './attribute-lineage-info/attribute-lineage-info.component'
export * from './graph-legend/sg-legend.component'
export * from './date-filter/date-filter.component'
export * from './date-filter/date-filter.models'
