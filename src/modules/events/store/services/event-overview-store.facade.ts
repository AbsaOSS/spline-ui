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
import { Observable, of } from 'rxjs'
import { catchError, distinctUntilChanged, map, shareReplay, take, tap } from 'rxjs/operators'
import { ExecutionEventFacade, ExecutionEventLineageNode, ExecutionEventLineageOverview } from 'spline-api'
import { BaseStore, ProcessingStore, SplineEntityStore } from 'spline-utils'

import { EventOverviewStore } from '../models'


@Injectable()
export class EventOverviewStoreFacade extends BaseStore<EventOverviewStore.State> {

    readonly loadingProcessingEvents: ProcessingStore.ProcessingEvents<EventOverviewStore.State>
    readonly loadingProcessing$: Observable<ProcessingStore.EventProcessingState>

    readonly graphLoadingProcessingEvents: ProcessingStore.ProcessingEvents<EventOverviewStore.State>
    readonly graphLoadingProcessing$: Observable<ProcessingStore.EventProcessingState>

    selectedNode$: Observable<ExecutionEventLineageNode | null>
    targetNode$: Observable<ExecutionEventLineageNode | null>

    constructor(private readonly executionEventFacade: ExecutionEventFacade) {
        super(EventOverviewStore.getDefaultState())

        this.loadingProcessingEvents = ProcessingStore.createProcessingEvents(
            this.state$, (state) => state.loadingProcessing,
        )

        this.loadingProcessing$ = this.state$.pipe(map(data => data.loadingProcessing))

        this.graphLoadingProcessingEvents = ProcessingStore.createProcessingEvents(
            this.state$, (state) => state.graphLoadingProcessing,
        )

        this.graphLoadingProcessing$ = this.state$.pipe(map(data => data.graphLoadingProcessing))

        this.selectedNode$ = this.getNodeSelector(state => state.selectedNodeId)
        this.targetNode$ = this.getNodeSelector(state => state.targetNodeId)
    }

    setSelectedNode(nodeId: string | null): void {
        if (this.state.selectedNodeId !== nodeId) {
            this.updateState({
                selectedNodeId: nodeId,
            })
        }
    }

    setGraphDepth(graphDepth: number): void {
        this.loadData(
            this.state.executionEventId,
            graphDepth,
            state => ({
                ...state,
                graphLoadingProcessing: ProcessingStore.eventProcessingStart(this.state.graphLoadingProcessing)
            }),
            state => ({
                ...state,
                graphLoadingProcessing: ProcessingStore.eventProcessingFinish(this.state.graphLoadingProcessing)
            }),
            (state, error) => ({
                ...state,
                graphLoadingProcessing: ProcessingStore.eventProcessingFinish(this.state.graphLoadingProcessing, error)
            })
        )
            .subscribe()
    }

    init(
        executionEventId: string,
        selectedNodeId: string | null = null,
        graphDepth: number = EventOverviewStore.GRAPH_DEFAULT_DEPTH,
    ): void {

        this.loadData(
            executionEventId,
            graphDepth,
            state => ({
                ...state,
                loadingProcessing: ProcessingStore.eventProcessingStart(this.state.loadingProcessing)
            }),
            state => ({
                ...state,
                loadingProcessing: ProcessingStore.eventProcessingFinish(this.state.loadingProcessing),
            }),
            (state, error) => ({
                ...state,
                loadingProcessing: ProcessingStore.eventProcessingFinish(this.state.loadingProcessing, error),
            }),
        )
            .subscribe(() => {
                this.updateState({
                    executionEventId,
                    selectedNodeId,
                })
            })
    }

    selectChildrenNodes(nodeId: string): ExecutionEventLineageNode[] {
        return EventOverviewStore.selectChildrenNodes(this.state, nodeId)
    }

    selectParentNodes(nodeId: string): ExecutionEventLineageNode[] {
        return EventOverviewStore.selectParentNodes(this.state, nodeId)
    }

    private loadData(
        executionEventId: string,
        graphDepth: number,
        onLoadingStart: (state: EventOverviewStore.State) => EventOverviewStore.State,
        onLoadingSuccess: (state: EventOverviewStore.State) => EventOverviewStore.State,
        onLoadingError: (state: EventOverviewStore.State, error: any | null) => EventOverviewStore.State,
    ): Observable<ExecutionEventLineageOverview> {

        this.updateState({
            ...onLoadingStart(this.state)
        })

        return this.executionEventFacade.fetchLineageOverview(executionEventId, graphDepth)
            .pipe(
                catchError((error) => {
                    this.updateState({
                        ...onLoadingError(this.state, error)
                    })
                    return of(null)
                }),
                // update data state
                tap((lineageData) => {
                    if (lineageData !== null) {
                        this.updateState({
                            ...EventOverviewStore.reduceLineageOverviewData(
                                onLoadingSuccess(this.state),
                                executionEventId,
                                lineageData
                            ),
                        })
                    }
                }),
                take(1),
            )
    }

    private getNodeSelector(nodeIdSelector: (state: EventOverviewStore.State) => string): Observable<ExecutionEventLineageNode | null> {
        return this.state$
            .pipe(
                distinctUntilChanged((stateX, stateY) => nodeIdSelector(stateX) === nodeIdSelector(stateY)),
                map(state => {
                    const nodeId = nodeIdSelector(state)
                    if (nodeId === null) {
                        return null
                    }
                    return SplineEntityStore.selectOne<ExecutionEventLineageNode>(nodeId, state.nodes)
                }),
                shareReplay(1),
            )
    }

}
