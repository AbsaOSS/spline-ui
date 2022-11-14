/*
 * Copyright 2021 ABSA Group Limited
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
    ExecutionPlanApiService,
    ExecutionPlanLineageNode,
    ExecutionPlanLineageOverview,
    OperationAttributeLineage
} from 'spline-api'
import { SgNodeControl } from 'spline-shared/graph'
import { ExtendedStore, ProcessingStoreNs, SplineEntityStoreNs } from 'spline-utils'

import { ExecutionPlanOverviewStoreNs } from '../models'


@Injectable()
export class ExecutionPlanOverviewFactoryStore extends ExtendedStore<ExecutionPlanOverviewStoreNs.State> {

    selectedNode$: Observable<ExecutionPlanLineageNode | null>
    selectedAttribute$: Observable<AttributeSchema | null>
    executionPlan$: Observable<ExecutionPlan | null>

    constructor(private readonly executionPlanApiService: ExecutionPlanApiService) {
        super(ExecutionPlanOverviewStoreNs.getDefaultState())

        this.selectedNode$ = this.state$
            .pipe(
                distinctUntilChanged((stateX, stateY) => stateX.selectedNodeId === stateY.selectedNodeId),
                map(state => {
                    if (state.selectedNodeId === null) {
                        return null
                    }
                    return SplineEntityStoreNs.selectOne<ExecutionPlanLineageNode>(state.selectedNodeId, state.nodes)
                }),
                shareReplay(1)
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
                shareReplay(1)
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
                shareReplay(1)
            )
    }

    setGraphNodeView(graphNodeView: SgNodeControl.NodeView): void {
        this.updateState(
            ExecutionPlanOverviewStoreNs.reduceGraphNodeView(this.state, graphNodeView)
        )
    }

    setSelectedNode(nodeId: string | null): void {
        if (this.state.selectedNodeId !== nodeId) {
            this.updateState({
                selectedNodeId: nodeId
            })
        }
    }

    setSelectedAttribute(attrId: string | null): void {
        if (this.state.selectedAttributeId !== attrId) {
            if (attrId === null) {
                this.updateState({
                    selectedAttributeId: attrId,
                    attributeLineage: null,
                    attributeLineageLoading: ProcessingStoreNs.eventProcessingFinish(
                        this.state.attributeLineageLoading
                    )
                })
            }
            else {

                this.updateState({
                    selectedAttributeId: attrId,
                    attributeLineage: null,
                    attributeLineageLoading: ProcessingStoreNs.eventProcessingStart(
                        this.state.attributeLineageLoading
                    )
                })

                this.executionPlanApiService.fetchAttributeLineage(this.state.executionPlanId, attrId)
                    .pipe(
                        catchError((error) => {
                            this.updateState({
                                attributeLineageLoading: ProcessingStoreNs.eventProcessingFinish(
                                    this.state.attributeLineageLoading, error
                                )
                            })
                            return of(null)
                        }),
                        // update data state
                        tap((attributeLineage: OperationAttributeLineage) => {
                            if (attributeLineage !== null) {
                                this.updateState({
                                    attributeLineageLoading: ProcessingStoreNs.eventProcessingFinish(
                                        this.state.attributeLineageLoading
                                    ),
                                    attributeLineage
                                })
                            }
                        }),
                        take(1)
                    )
                    .subscribe()

            }
        }
    }

    init(executionPlanId: string, selectedNodeId: string | null = null, selectedAttributeId: string | null = null): void {
        this.updateState({
            loading: ProcessingStoreNs.eventProcessingStart(this.state.loading)
        })

        const operationObserver: Observable<OperationAttributeLineage | null> = selectedAttributeId
                                                                                ? this.executionPlanApiService.fetchAttributeLineage(
                executionPlanId,
                selectedAttributeId
            )
                                                                                : of(null)

        type CombinedData = {
            executionPlanLinage: ExecutionPlanLineageOverview
            attributeLineage: OperationAttributeLineage | null
        }

        const observer: Observable<CombinedData> = forkJoin([
            this.executionPlanApiService.fetchExecutionPlanDetails(executionPlanId),
            operationObserver
        ])
            .pipe(
                map(([executionPlanLinage, attributeLineage]) => ({
                    executionPlanLinage,
                    attributeLineage
                }))
            )

        observer
            .pipe(
                catchError((error) => {
                    this.updateState({
                        loading: ProcessingStoreNs.eventProcessingFinish(this.state.loading, error)
                    })
                    return of(null)
                }),
                // update data state
                tap((data: CombinedData) => {
                    if (data !== null) {
                        this.updateState({
                            ...ExecutionPlanOverviewStoreNs.reduceLineageOverviewData(
                                this.state,
                                executionPlanId,
                                data.executionPlanLinage
                            ),
                            loading: ProcessingStoreNs.eventProcessingFinish(this.state.loading),
                            selectedNodeId,
                            executionPlanId,
                            selectedAttributeId,
                            attributeLineage: data.attributeLineage
                        })
                    }
                }),
                take(1)
            )
            .subscribe()
    }
}
