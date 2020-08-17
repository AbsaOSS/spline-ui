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
import { ExecutionEventFacade, ExecutionEventLineageNode } from 'spline-api'
import { BaseStore, ProcessingStore, SplineEntityStore } from 'spline-utils'

import { EventOverviewStore } from '../models'


@Injectable()
export class EventOverviewStoreFacade extends BaseStore<EventOverviewStore.State> {

    readonly loadingProcessingEvents: ProcessingStore.ProcessingEvents<EventOverviewStore.State>
    readonly loadingProcessing$: Observable<ProcessingStore.EventProcessingState>

    selectedNode$: Observable<ExecutionEventLineageNode | null>

    constructor(private readonly executionEventFacade: ExecutionEventFacade) {
        super(EventOverviewStore.getDefaultState())

        this.loadingProcessingEvents = ProcessingStore.createProcessingEvents(
            this.state$, (state) => state.loadingProcessing,
        )

        this.loadingProcessing$ = this.state$.pipe(map(data => data.loadingProcessing))

        this.selectedNode$ = this.state$
            .pipe(
                distinctUntilChanged((stateX, stateY) => stateX.selectedNodeId === stateY.selectedNodeId),
                map(state => {
                    if (state.selectedNodeId === null) {
                        return null
                    }
                    return SplineEntityStore.selectOne<ExecutionEventLineageNode>(state.selectedNodeId, state.nodes)
                }),
                shareReplay(1),
            )
    }

    setSelectedNode(nodeId: string | null): void {
        if (this.state.selectedNodeId !== nodeId) {
            this.updateState({
                selectedNodeId: nodeId,
            })
        }
    }

    init(executionEventId: string, selectedNodeId: string | null = null): void {
        this.updateState({
            loadingProcessing: ProcessingStore.eventProcessingStart(this.state.loadingProcessing),
        })

        this.executionEventFacade.fetchLineageOverview(executionEventId)
            .pipe(
                catchError((error) => {
                    this.updateState({
                        loadingProcessing: ProcessingStore.eventProcessingFinish(this.state.loadingProcessing, error),
                    })
                    return of(null)
                }),
                // update data state
                tap((lineageData) => {
                    if (lineageData !== null) {
                        this.updateState({
                            ...EventOverviewStore.reduceLineageOverviewData(this.state, executionEventId, lineageData),
                            loadingProcessing: ProcessingStore.eventProcessingFinish(this.state.loadingProcessing),
                            selectedNodeId,
                        })
                    }
                }),
                take(1),
            )
            .subscribe()
    }
}
