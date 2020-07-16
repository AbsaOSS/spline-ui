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
import { SdWidgetDefault, SdWidgetSchema, SplineColors } from 'spline-common'


@Component({
    selector: 'event-execution-plan-info',
    templateUrl: './execution-plan-info.component.html',
    styleUrls: ['./execution-plan-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecutionPlanInfoComponent implements OnChanges {

    @Input() data: ExecutionPlan

    detailsDataSchema: SdWidgetSchema[] = []

    readonly color = SplineColors.ORANGE
    readonly icon = 'playlist_play'

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.data && !!changes.data.currentValue) {
            this.detailsDataSchema = this.toDetailsDataSchema(changes.data.currentValue)
        }
    }

    private toDetailsDataSchema(data: ExecutionPlan): SdWidgetSchema[] {
        return [
            {
                data: {
                    label: 'EVENTS.EXECUTION_EVENT_INFO__DETAILS__SYSTEM_INFO',
                    value: `${data.systemInfo.name} ${data.systemInfo.version}`,
                } as SdWidgetDefault.Data,
            },
            {
                data: {
                    label: 'EVENTS.EXECUTION_EVENT_INFO__DETAILS__AGENT_INFO',
                    value: `${data.agentInfo.name} ${data.agentInfo.version}`,
                } as SdWidgetDefault.Data,
            },
        ]
    }

}
