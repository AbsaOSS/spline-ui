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
import { SdWidgetDefault, SdWidgetSchema, SplineColors } from 'spline-common'
import { DateTimeHelpers } from 'spline-utils'

import { EventInfo } from '../../models'


@Component({
    selector: 'event-info',
    templateUrl: './event-info.component.html',
    styleUrls: ['./event-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInfoComponent implements OnChanges {

    @Input() data: EventInfo

    detailsDataSchema: SdWidgetSchema[] = []

    readonly color = SplineColors.PINK
    readonly icon = 'play_arrow'

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.data && !!changes.data.currentValue) {
            this.detailsDataSchema = this.toDetailsDataSchema(changes.data.currentValue)
        }
    }

    private toDetailsDataSchema(data: EventInfo): SdWidgetSchema[] {
        return [
            {
                data: {
                    label: 'EVENTS.EVENT_INFO__DETAILS__EXECUTED_AT',
                    value: DateTimeHelpers.toString(data.executedAt),
                } as SdWidgetDefault.Data,
            },
            {
                data: {
                    label: 'EVENTS.EVENT_INFO__DETAILS__EVENT_ID',
                    value: data.id,
                } as SdWidgetDefault.Data,
            },
            {
                data: {
                    label: 'EVENTS.EVENT_INFO__DETAILS__APPLICATION_ID',
                    value: data.applicationId,
                } as SdWidgetDefault.Data,
            },
        ]
    }

}
