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

    setGraphDepth(graphDepth: number, overviewType: OverviewTypeEnum = OverviewTypeEnum.LINEAGE_OVERVIEW): void {
        this.loadData(
            this.state.executionEventId,
            graphDepth,
            overviewType,
            state => ({
                ...state,
                graphLoadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.graphLoadingProcessing)
            }),
            state => ({
                ...state,
                graphLoadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.graphLoadingProcessing)
            }),
            (state, error) => ({
                ...state,
                graphLoadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.graphLoadingProcessing, error)
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
                loadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.loadingProcessing)
            }),
            state => ({
                ...state,
                loadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.loadingProcessing)
            }),
            (state, error) => ({
                ...state,
                loadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.loadingProcessing, error)
            })
        )
            .subscribe(() => {
                this.updateState({
                    executionEventId
                })
            })
    }

    findNode(nodeId: string): ExecutionEventLineageNode {
        return EventOverviewStoreNs.selectNode(this.state, nodeId)
    }

    findChildrenNodes(nodeId: string): ExecutionEventLineageNode[] {
        return EventOverviewStoreNs.selectChildrenNodes(this.state, nodeId)
    }

    findParentNodes(nodeId: string): ExecutionEventLineageNode[] {
        return EventOverviewStoreNs.selectParentNodes(this.state, nodeId)
    }

    // TODO: remove it after BE will support it.
    loadNodeHistory(nodeId: string): void {

        this.updateState({
            graphLoadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.graphLoadingProcessing)
        })

        setTimeout(() => {
            this.updateState({
                ...EventOverviewStoreNs.__reduceFakeHistoryNode(this.state, nodeId),
                graphLoadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.graphLoadingProcessing)
            })
        }, 500)
    }

    // TODO: remove it after BE will support it.
    loadNodeFuture(nodeId: string): void {

        this.updateState({
            graphLoadingProcessing: ProcessingStoreNs.eventProcessingStart(this.state.graphLoadingProcessing)
        })

        setTimeout(() => {
            this.updateState({
                ...EventOverviewStoreNs.__reduceFakeFutureNode(this.state, nodeId),
                graphLoadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.state.graphLoadingProcessing)
            })
        }, 500)
    }

    private loadData(
        executionEventId: string,
        graphDepth: number,
        overviewType: OverviewTypeEnum,
        onLoadingStart: (state: EventOverviewStoreNs.State) => EventOverviewStoreNs.State,
        onLoadingSuccess: (state: EventOverviewStoreNs.State) => EventOverviewStoreNs.State,
        onLoadingError: (state: EventOverviewStoreNs.State, error: any | null) => EventOverviewStoreNs.State
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
                            ...EventOverviewStoreNs.reduceLineageOverviewData(
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
