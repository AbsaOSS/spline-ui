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
import { ExecutionEventApiService, ExecutionEventLineageNode, ExecutionEventLineageOverview } from 'spline-api'
import { OverviewTypeEnum } from 'spline-common/graph'
import { SgNodeControl } from 'spline-shared/graph'
import { BaseStore, ProcessingStore } from 'spline-utils'

import { EventOverviewStateManagement } from '../models'


@Injectable()
export class EventOverviewStore extends BaseStore<EventOverviewStateManagement.State> {

    constructor(private readonly executionEventApiService: ExecutionEventApiService) {
        super(EventOverviewStateManagement.getDefaultState())
    }

    setSelectedNode(nodeId: string | null): void {
        if (this.state.selectedNodeId !== nodeId) {
            this.updateState(
                EventOverviewStateManagement.reduceSelectedNodeId(nodeId, this.state)
            )
        }
    }

    setGraphNodeView(graphNodeView: SgNodeControl.NodeView): void {
        this.updateState(
            EventOverviewStateManagement.reduceGraphNodeView(this.state, graphNodeView)
        )
    }

    setGraphDepth(graphDepth: number, overviewType: OverviewTypeEnum = OverviewTypeEnum.LINEAGE_OVERVIEW): void {
        this.loadData(
            this.state.executionEventId,
            graphDepth,
            overviewType,
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
        graphDepth: number
    ): void {

        this.loadData(
            executionEventId,
            graphDepth,
            OverviewTypeEnum.LINEAGE_OVERVIEW,
            state => ({
                ...state,
                loadingProcessing: ProcessingStore.eventProcessingStart(this.state.loadingProcessing)
            }),
            state => ({
                ...state,
                loadingProcessing: ProcessingStore.eventProcessingFinish(this.state.loadingProcessing)
            }),
            (state, error) => ({
                ...state,
                loadingProcessing: ProcessingStore.eventProcessingFinish(this.state.loadingProcessing, error)
            })
        )
            .subscribe(() => {
                this.updateState({
                    executionEventId
                })
            })
    }

    findNode(nodeId: string): ExecutionEventLineageNode {
        return EventOverviewStateManagement.selectNode(this.state, nodeId)
    }

    findChildrenNodes(nodeId: string): ExecutionEventLineageNode[] {
        return EventOverviewStateManagement.selectChildrenNodes(this.state, nodeId)
    }

    findParentNodes(nodeId: string): ExecutionEventLineageNode[] {
        return EventOverviewStateManagement.selectParentNodes(this.state, nodeId)
    }

    // TODO: remove it after BE will support it.
    loadNodeHistory(nodeId: string): void {

        this.updateState({
            graphLoadingProcessing: ProcessingStore.eventProcessingStart(this.state.graphLoadingProcessing)
        })

        setTimeout(() => {
            this.updateState({
                ...EventOverviewStateManagement.__reduceFakeHistoryNode(this.state, nodeId),
                graphLoadingProcessing: ProcessingStore.eventProcessingFinish(this.state.graphLoadingProcessing)
            })
        }, 500)
    }

    // TODO: remove it after BE will support it.
    loadNodeFuture(nodeId: string): void {

        this.updateState({
            graphLoadingProcessing: ProcessingStore.eventProcessingStart(this.state.graphLoadingProcessing)
        })

        setTimeout(() => {
            this.updateState({
                ...EventOverviewStateManagement.__reduceFakeFutureNode(this.state, nodeId),
                graphLoadingProcessing: ProcessingStore.eventProcessingFinish(this.state.graphLoadingProcessing)
            })
        }, 500)
    }

    private loadData(
        executionEventId: string,
        graphDepth: number,
        overviewType: OverviewTypeEnum,
        onLoadingStart: (state: EventOverviewStateManagement.State) => EventOverviewStateManagement.State,
        onLoadingSuccess: (state: EventOverviewStateManagement.State) => EventOverviewStateManagement.State,
        onLoadingError: (state: EventOverviewStateManagement.State, error: any | null) => EventOverviewStateManagement.State
    ): Observable<ExecutionEventLineageOverview> {

        this.updateState({
            ...onLoadingStart(this.state)
        })

        return this.executionEventApiService.fetchLineageOverview<OverviewTypeEnum>(executionEventId, overviewType, graphDepth)
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
                            ...EventOverviewStateManagement.reduceLineageOverviewData(
                                onLoadingSuccess(this.state),
                                executionEventId,
                                lineageData
                            )
                        })
                    }
                }),
                take(1)
            )
    }

}