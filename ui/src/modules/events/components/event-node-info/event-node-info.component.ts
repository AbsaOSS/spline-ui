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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core'
import { isEqual } from 'lodash-es'
import { delay, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators'
import { ExecutionEventLineageNodeType, ExecutionPlanApiService } from 'spline-api'
import { SplineDataWidgetEvent } from 'spline-common/data-view'
import { SgNodeCardDataView } from 'spline-shared/data-view'
import { BaseLocalStateComponent, GenericEventInfo, ProcessingStoreNs } from 'spline-utils'

import { OperationDetailsListFactoryStore } from '../../data-sources'
import { EventNodeInfo } from '../../models'
import NodeEventData = SgNodeCardDataView.NodeEventData


@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'event-node-info',
    templateUrl: './event-node-info.component.html',
    styleUrls: ['./event-node-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: OperationDetailsListFactoryStore,
            useFactory: (executionPlanApiService: ExecutionPlanApiService) => {
                return new OperationDetailsListFactoryStore(executionPlanApiService)
            },
            deps: [ExecutionPlanApiService]
        }
    ]
})
export class EventNodeInfoComponent extends BaseLocalStateComponent<EventNodeInfo.NodeInfoViewState> implements OnChanges, OnDestroy {

    @Input() nodeRelations: EventNodeInfo.NodeRelationsInfo

    @Output() focusNode$ = new EventEmitter<{ nodeId: string }>()
    @Output() launchNode$ = new EventEmitter<{ nodeId: string }>()
    @Output() highlightToggleRelations$ = new EventEmitter<{ nodeId: string }>()
    @Output() highlightSpecificRelations$ = new EventEmitter<{ nodeIds: string[] }>()
    @Output() dataViewEvent$ = new EventEmitter<SplineDataWidgetEvent>()

    constructor(readonly dataSource: OperationDetailsListFactoryStore) {
        super()

        this.updateState(
            EventNodeInfo.getDefaultState()
        )

        const domRelaxationTime = 250

        // calculate state after new data arrived
        this.dataSource.data$
            .pipe(
                filter(state => !!state),
                takeUntil(this.destroyed$)
            )
            .subscribe(operationDetailsList => {
                this.updateState({
                    ...EventNodeInfo.reduceNodeRelationsState(
                        this.state,
                        this.nodeRelations,
                        operationDetailsList
                    )
                })

                setTimeout(
                    () => {
                        this.updateState({
                            loadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.loadingProcessing)
                        })
                    },
                    domRelaxationTime
                )
            })

        this.dataSource.loadingProcessingEvents.error$
            .pipe(
                distinctUntilChanged((left, right) => isEqual(left, right)),
                delay(domRelaxationTime),
                takeUntil(this.destroyed$)
            )
            .subscribe(state =>
                this.updateState({
                    loadingProcessing:
                        ProcessingStoreNs.eventProcessingFinish(
                            this.state.loadingProcessing, state.loadingProcessing.processingError)
                })
            )
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.nodeRelations && !!changes.nodeRelations.currentValue) {
            const nodeRelations: EventNodeInfo.NodeRelationsInfo = changes.nodeRelations.currentValue

            const executionPlanIds = nodeRelations.node.type === ExecutionEventLineageNodeType.DataSource &&
                                     nodeRelations?.parents?.length > 0
                ? nodeRelations.parents.map(node => node.id)
                : []

            this.updateState({
                loadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.loadingProcessing)
            })

            // set filter and trigger data fetching
            this.dataSource.setFilter({
                executionPlanIds
            })
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.dataSource.disconnect()
    }

    onDataViewEvent($event: SplineDataWidgetEvent): void {
        switch ($event.type) {
            case EventNodeInfo.WidgetEvent.LaunchExecutionEvent:
                this.launchNode$.next({ nodeId: ($event as GenericEventInfo<NodeEventData>).data.nodeId })
                break

            case SgNodeCardDataView.WidgetEvent.FocusNode:
                this.focusNode$.next({ nodeId: ($event as GenericEventInfo<NodeEventData>).data.nodeId })
                break

            case SgNodeCardDataView.WidgetEvent.HighlightNodeRelations:
                this.highlightToggleRelations$.next({ nodeId: ($event as GenericEventInfo<NodeEventData>).data.nodeId })
                break
        }

        this.dataViewEvent$.next($event)
    }

}
