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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { ExecutionPlanFacade, ExecutionPlanLineageNode } from 'spline-api'
import { BaseComponent } from 'spline-utils'

import { OperationDetailsDataSource } from '../../data-sources'


@Component({
    selector: 'event-execution-plan-node-info',
    templateUrl: './execution-plan-node-info.component.html',
    styleUrls: ['./execution-plan-node-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: OperationDetailsDataSource,
            useFactory: (executionPlanFacade: ExecutionPlanFacade) => {
                return new OperationDetailsDataSource(executionPlanFacade)
            },
            deps: [ExecutionPlanFacade]
        }
    ]
})
export class ExecutionPlanNodeInfoComponent extends BaseComponent implements OnChanges {

    @Input() node: ExecutionPlanLineageNode
    @Input() selectedAttributeId: string

    @Output() attributeSelected$ = new EventEmitter<{ attributeId: string | null }>()

    constructor(readonly dataSource: OperationDetailsDataSource) {
        super()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.node && !!changes.node.currentValue) {

        }
    }

}
