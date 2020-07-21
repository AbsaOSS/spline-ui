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
import { filter, takeUntil } from 'rxjs/operators'
import { ExecutionPlanFacade, ExecutionPlanLineageNode } from 'spline-api'
import { SplineDataViewSchema } from 'spline-common'
import { BaseLocalStateComponent } from 'spline-utils'

import { OperationDetailsDataSource } from '../../data-sources'
import { OperationInfo } from '../../models'


export type ExecutionPlanNodeInfoState = {
    operationDvs: SplineDataViewSchema
    inputsDvs: SplineDataViewSchema | null
    outputDvs: SplineDataViewSchema | null
    detailsDvs: SplineDataViewSchema | null
}

@Component({
    selector: 'event-operation-info',
    templateUrl: './operation-info.component.html',
    styleUrls: ['./operation-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: OperationDetailsDataSource,
            useFactory: (executionPlanFacade: ExecutionPlanFacade) => {
                return new OperationDetailsDataSource(executionPlanFacade)
            },
            deps: [ExecutionPlanFacade],
        },
    ],
})
export class OperationInfoComponent extends BaseLocalStateComponent<ExecutionPlanNodeInfoState> implements OnChanges {

    @Input() node: ExecutionPlanLineageNode
    @Input() selectedAttributeId: string

    @Output() selectedAttributeChanged$ = new EventEmitter<{ attributeId: string | null }>()

    constructor(readonly dataSource: OperationDetailsDataSource) {
        super()

        this.dataSource.data$
            .pipe(
                filter(state => !!state),
                takeUntil(this.destroyed$),
            )
            .subscribe(data =>
                this.updateState({
                    operationDvs: OperationInfo.toDataViewSchema(data.operation),
                    inputsDvs: OperationInfo.toInputsDvs(data),
                    outputDvs: OperationInfo.toOutputsDvs(data),
                    detailsDvs: OperationInfo.toDetailsDvs(data),
                }),
            )
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.node && !!changes.node.currentValue) {
            this.dataSource.setFilter({
                operationId: changes.node.currentValue.id,
            })
        }
    }

}
