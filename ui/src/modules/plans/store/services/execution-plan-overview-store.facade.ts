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

import { Injectable } from '@angular/core'
import { forkJoin, Observable, of } from 'rxjs'
import { catchError, distinctUntilChanged, map, shareReplay, take, tap } from 'rxjs/operators'
import {
    AttributeSchema,
    ExecutionPlan,
    ExecutionPlanFacade,
    ExecutionPlanLineageNode,
    ExecutionPlanLineageOverview,
    OperationAttributeLineage,
} from 'spline-api'
import { SgNodeControl } from 'spline-shared/graph'
import { BaseStore, ProcessingStore, SplineEntityStore } from 'spline-utils'

import { ExecutionPlanOverviewStore } from '../models'


@Injectable()
export class ExecutionPlanOverviewStoreFacade extends BaseStore<ExecutionPlanOverviewStore.State> {

    readonly loadingProcessingEvents: ProcessingStore.ProcessingEvents<ExecutionPlanOverviewStore.State>
    readonly loadingProcessing$: Observable<ProcessingStore.EventProcessingState>

    readonly attributeLineageLoadingProcessingEvents: ProcessingStore.ProcessingEvents<ExecutionPlanOverviewStore.State>
    readonly attributeLineageLoadingProcessing$: Observable<ProcessingStore.EventProcessingState>

    selectedNode$: Observable<ExecutionPlanLineageNode | null>
    selectedAttribute$: Observable<AttributeSchema | null>
    executionPlan$: Observable<ExecutionPlan | null>

    constructor(private readonly executionPlanFacade: ExecutionPlanFacade) {
        super(ExecutionPlanOverviewStore.getDefaultState())

        this.loadingProcessingEvents = ProcessingStore.createProcessingEvents(
            this.state$, (state) => state.loadingProcessing,
        )

        this.loadingProcessing$ = this.state$.pipe(map(data => data.loadingProcessing))

        this.attributeLineageLoadingProcessingEvents = ProcessingStore.createProcessingEvents(
            this.state$, (state) => state.attributeLineageLoadingProcessing,
        )

        this.attributeLineageLoadingProcessing$ = this.state$.pipe(map(data => data.attributeLineageLoadingProcessing))

        this.selectedNode$ = this.state$
            .pipe(
                distinctUntilChanged((stateX, stateY) => stateX.selectedNodeId === stateY.selectedNodeId),
                map(state => {
                    if (state.selectedNodeId === null) {
                        return null
                    }
                    return SplineEntityStore.selectOne<ExecutionPlanLineageNode>(state.selectedNodeId, state.nodes)
                }),
                shareReplay(1),
            )

        this.selectedAttribute$ = this.state$
            .pipe(
                distinctUntilChanged((stateX, stateY) => stateX.selectedAttributeId === stateY.selectedAttributeId),
                map(state => {
                    if (state.selectedAttributeId === null) {
                        return null
                    }
                    return state.executionPlan.extraInfo?.attributes?.find(attr => attr.id === state.selectedAttributeId) ?? null
                }),
                shareReplay(1),
            )

        this.executionPlan$ = this.state$
            .pipe(
                distinctUntilChanged((stateX, stateY) => stateX.executionPlanId === stateY.executionPlanId),
                map(state => {
                    if (state.executionPlan === null) {
                        return null
                    }
                    return state.executionPlan
                }),
                shareReplay(1),
            )
    }

    setGraphNodeView(graphNodeView: SgNodeControl.NodeView): void {
        this.updateState(
            ExecutionPlanOverviewStore.reduceGraphNodeView(this.state, graphNodeView)
        )
    }

    setSelectedNode(nodeId: string | null): void {
        if (this.state.selectedNodeId !== nodeId) {
            this.updateState({
                selectedNodeId: nodeId,
            })
        }
    }

    setSelectedAttribute(attrId: string | null): void {
        if (this.state.selectedAttributeId !== attrId) {
            if (attrId === null) {
                this.updateState({
                    selectedAttributeId: attrId,
                    attributeLineage: null,
                    attributeLineageLoadingProcessing: ProcessingStore.eventProcessingFinish(
                        this.state.attributeLineageLoadingProcessing,
                    ),
                })
            }
            else {

                this.updateState({
                    selectedAttributeId: attrId,
                    attributeLineage: null,
                    attributeLineageLoadingProcessing: ProcessingStore.eventProcessingStart(
                        this.state.attributeLineageLoadingProcessing,
                    ),
                })

                this.executionPlanFacade.fetchAttributeLinage(this.state.executionPlanId, attrId)
                    .pipe(
                        catchError((error) => {
                            this.updateState({
                                attributeLineageLoadingProcessing: ProcessingStore.eventProcessingFinish(
                                    this.state.attributeLineageLoadingProcessing, error,
                                ),
                            })
                            return of(null)
                        }),
                        // update data state
                        tap((attributeLineage: OperationAttributeLineage) => {
                            if (attributeLineage !== null) {
                                this.updateState({
                                    attributeLineageLoadingProcessing: ProcessingStore.eventProcessingFinish(
                                        this.state.attributeLineageLoadingProcessing,
                                    ),
                                    attributeLineage,
                                })
                            }
                        }),
                        take(1),
                    )
                    .subscribe()

            }
        }
    }

    init(executionPlanId: string, selectedNodeId: string | null = null, selectedAttributeId: string | null = null): void {
        this.updateState({
            loadingProcessing: ProcessingStore.eventProcessingStart(this.state.loadingProcessing),
        })

        const operationObserver: Observable<OperationAttributeLineage | null> = selectedAttributeId
            ? this.executionPlanFacade.fetchAttributeLinage(executionPlanId, selectedAttributeId)
            : of(null)

        type CombinedData = {
            executionPlanLinage: ExecutionPlanLineageOverview
            attributeLineage: OperationAttributeLineage | null
        }

        const observer: Observable<CombinedData> = forkJoin([
            this.executionPlanFacade.fetchLineageOverview(executionPlanId),
            operationObserver,
        ])
            .pipe(
                map(([executionPlanLinage, attributeLineage]) => ({
                    executionPlanLinage,
                    attributeLineage,
                })),
            )

        observer
            .pipe(
                catchError((error) => {
                    this.updateState({
                        loadingProcessing: ProcessingStore.eventProcessingFinish(this.state.loadingProcessing, error),
                    })
                    return of(null)
                }),
                // update data state
                tap((data: CombinedData) => {
                    if (data !== null) {
                        this.updateState({
                            ...ExecutionPlanOverviewStore.reduceLineageOverviewData(this.state, executionPlanId, data.executionPlanLinage),
                            loadingProcessing: ProcessingStore.eventProcessingFinish(this.state.loadingProcessing),
                            selectedNodeId,
                            executionPlanId,
                            selectedAttributeId,
                            attributeLineage: data.attributeLineage,
                        })
                    }
                }),
                take(1),
            )
            .subscribe()
    }
}
