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
import { Observable, of } from 'rxjs'
import { catchError, take, tap } from 'rxjs/operators'
import { EventOverviewType, ExecutionEventApiService, ExecutionEventLineageNode, ExecutionEventLineageOverview } from 'spline-api'
import { SgNodeControl } from 'spline-shared/graph'
import { BaseStore, ProcessingStoreNs } from 'spline-utils'

import { EventOverviewStoreNs } from '../models'


@Injectable()
export class EventOverviewStore extends BaseStore<EventOverviewStoreNs.State> {

    constructor(private readonly executionEventApiService: ExecutionEventApiService) {
        super(EventOverviewStoreNs.getDefaultState())
    }

    setSelectedNode(nodeId: string | null): void {
        if (this.state.selectedNodeId !== nodeId) {
            this.updateState(
                EventOverviewStoreNs.reduceSelectedNodeId(nodeId, this.state)
            )
        }
    }

    setGraphNodeView(graphNodeView: SgNodeControl.NodeView): void {
        this.updateState(
            EventOverviewStoreNs.reduceGraphNodeView(this.state, graphNodeView)
        )
    }

    onLoadingStart = state => ({
        ...state,
        graphLoadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.graphLoadingProcessing)
    })
    onLoadingSuccess = state => ({
        ...state,
        graphLoadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.graphLoadingProcessing)
    })
    onLoadingError = (state, error) => ({
        ...state,
        graphLoadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.graphLoadingProcessing, error)
    })

    setGraphOverviewType(overviewType: EventOverviewType = EventOverviewType.Lineage): void {
        this.loadData(
            this.state.executionEventId,
            overviewType,
            this.state.lineageDepth.depthRequested,
            this.onLoadingStart,
            this.onLoadingSuccess,
            this.onLoadingError
        )
            .subscribe(() => {
                this.updateState({ overviewType: overviewType })
            })
    }

    setGraphDepth(graphDepth: number): void {
        this.loadData(
            this.state.executionEventId,
            this.state.overviewType,
            graphDepth,
            this.onLoadingStart,
            this.onLoadingSuccess,
            this.onLoadingError
        ).subscribe()
    }

    init(
        executionEventId: string,
        graphDepth: number,
        overviewType: EventOverviewType
    ): void {
        this.loadData(executionEventId, overviewType, graphDepth, state => ({
            ...state,
            loadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.loadingProcessing)
        }), state => ({
            ...state,
            loadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.loadingProcessing)
        }), (state, error) => ({
            ...state,
            loadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.loadingProcessing, error)
        }))
            .subscribe(() => {
                this.updateState({
                    executionEventId,
                    lineageDepth: {...this.state.lineageDepth, depthRequested: graphDepth},
                    overviewType
                })
            })
    }

    findNode(nodeId: string): ExecutionEventLineageNode {
        return EventOverviewStoreNs.selectNode(this.state, nodeId)
    }
    // TODO: remove it after BE will support it.
    loadNodeHistory(nodeId: string): void {

        this.updateState({
            graphLoadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.graphLoadingProcessing)
        })

        
            this.updateState({
                ...EventOverviewStoreNs.__reduceFakeHistoryNode(this.state, nodeId),
                graphLoadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.graphLoadingProcessing)
            })
        
    }

    // TODO: remove it after BE will support it.
    loadNodeFuture(nodeId: string): void {

        this.updateState({
            graphLoadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.graphLoadingProcessing)
        })

        
            this.updateState({
                ...EventOverviewStoreNs.__reduceFakeFutureNode(this.state, nodeId),
                graphLoadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.graphLoadingProcessing)
            })
        
    }

    private loadData(
        executionEventId: string,
        eventOverviewType: EventOverviewType,
        graphDepth: number,
        onLoadingStart: EventOverviewStoreNs.ProcessingFn,
        onLoadingSuccess: EventOverviewStoreNs.ProcessingFn,
        onLoadingError: EventOverviewStoreNs.ProcessingErrorFn
    ): Observable<ExecutionEventLineageOverview> {

        this.updateState({
            ...onLoadingStart(this.state)
        })

        return this.executionEventApiService.fetchEventOverview(executionEventId, eventOverviewType, graphDepth)
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
                            ...EventOverviewStoreNs.reduceLineageOverviewData(
                                onLoadingSuccess(this.state),
                                executionEventId,
                                lineageData,
                                eventOverviewType
                            )
                        })
                    }
                }),
                take(1)
            )
    }

}
