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

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { ExecutionPlan } from 'spline-api'
import { BaseLocalStateComponent } from 'spline-utils'

import { ExecutionPlanInfoStore } from '../../store'


@Component({
    selector: 'event-execution-plan-info',
    templateUrl: './execution-plan-info.component.html',
    styleUrls: ['./execution-plan-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecutionPlanInfoComponent extends BaseLocalStateComponent<ExecutionPlanInfoStore.State> implements OnChanges {

    @Input() executionPlan: ExecutionPlan

    constructor() {
        super()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.executionPlan && !!changes.executionPlan.currentValue) {
            this.updateState(
                ExecutionPlanInfoStore.toState(changes.executionPlan.currentValue),
            )
        }
    }

}
