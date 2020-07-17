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

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map, shareReplay, takeUntil } from 'rxjs/operators'
import { ExecutionEventFacade, ExecutionEventLineageNode } from 'spline-api'
import { SgData, SgNodeSchema, SplineDataViewSchema } from 'spline-common'
import { BaseComponent } from 'spline-utils'

import { EventNodeControl, EventNodeInfo } from '../../models'
import { EventOverviewStore, EventOverviewStoreFacade } from '../../store'


@Component({
    selector: 'event-overview-page',
    templateUrl: './event-overview.page.component.html',
    styleUrls: ['./event-overview.page.component.scss'],
    providers: [
        {
            provide: EventOverviewStoreFacade,
            useFactory: (executionEventFacade: ExecutionEventFacade) => {
                return new EventOverviewStoreFacade(executionEventFacade)
            },
            deps: [ExecutionEventFacade],
        },
    ],
})
export class EventOverviewPageComponent extends BaseComponent implements OnInit {

    readonly selectedNodeQueryParamName: string = 'selectedNodeId'

    readonly graphData$: Observable<SgData>

    readonly selectedNodeViewSchema$: Observable<SplineDataViewSchema>

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                readonly store: EventOverviewStoreFacade) {
        super()

        this.graphData$ = this.store.loadingProcessingEvents.success$
            .pipe(
                takeUntil(this.destroyed$),
                map(state => {
                    // select all nodes list from the store
                    const nodesList = EventOverviewStore.selectAllNodes(state)
                    return {
                        links: state.links,
                        nodes: nodesList
                            // map node source data to the SgNode schema
                            .map(
                                nodeSource => EventNodeControl.toSgNode(
                                    nodeSource,
                                    (nodeId) => this.onExecutionPlanNodeLaunchAction(nodeId),
                                ),
                            ),
                    }
                }),
                shareReplay(1),
            )

        this.selectedNodeViewSchema$ = this.store.selectedNode$
            .pipe(
                map(selectedNode => selectedNode ? EventNodeInfo.toDataSchema(selectedNode) : null),
            )
    }

    ngOnInit(): void {
        const executionEventId = this.activatedRoute.snapshot.params['id']
        const selectedNodeId = this.activatedRoute.snapshot.queryParamMap.get(this.selectedNodeQueryParamName)

        this.store.init(executionEventId, selectedNodeId)

        //
        // [ACTION] :: SELECTED NODE CHANGE
        //      => update query params
        //
        this.store.selectedNode$
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe(
                selectedNode => this.updateQueryParams(selectedNode),
            )
    }

    onNodeSelected($event: { nodeSchema: SgNodeSchema | null }): void {
        this.store.setSelectedNode($event.nodeSchema ? $event.nodeSchema.id : null)
    }

    private onExecutionPlanNodeLaunchAction(nodeId: string): void {
        this.router.navigate(['/events/plan-overview', nodeId])
    }

    private updateQueryParams(selectedNode: ExecutionEventLineageNode | null): void {
        const queryParams = selectedNode
            ? {
                [this.selectedNodeQueryParamName]: selectedNode.id,
            }
            : {}

        const extras: NavigationExtras = {
            queryParams,
            relativeTo: this.activatedRoute,
            replaceUrl: true,
        }

        this.router.navigate([], extras)
    }
}
