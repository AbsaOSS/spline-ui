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

import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { EventOverviewType } from 'spline-api'


@Component({
    selector: 'sg-overview-control',
    templateUrl: './sg-overview-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SgOverviewControlComponent {
    @Output() changeOverview$ = new EventEmitter<{ eventOverviewType: EventOverviewType }>()

    overviewTypeEnum = EventOverviewType
    toggleLinageImpactView = EventOverviewType.Lineage

    onToggleOverviewBtnClicked(eventOverviewType: EventOverviewType): void {
        this.toggleLinageImpactView = eventOverviewType

        this.changeOverview$.emit({ eventOverviewType })

    }
}
