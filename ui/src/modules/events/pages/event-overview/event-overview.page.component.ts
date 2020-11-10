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

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs'
import { filter, map, shareReplay, skip, takeUntil, withLatestFrom } from 'rxjs/operators'
import { ExecutionEventFacade, ExecutionEventLineageNodeType } from 'spline-api'
import { SdWidgetSchema, SgData, SgNodeSchema, SgRelations, SplineAnimationSlideXInOut } from 'spline-common'
import { SgNodeControl } from 'spline-shared'
import { BaseComponent, RouterHelpers } from 'spline-utils'

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
    animations: [
        SplineAnimationSlideXInOut.getAnimation()
    ]

})
export class EventOverviewPageComponent extends BaseComponent implements OnInit {

    readonly selectedNodeQueryParamName: string = 'selectedNodeId'

    readonly graphData$: Observable<SgData>

    readonly selectedNodeRelations$: Observable<EventNodeInfo.NodeRelationsInfo>
    readonly targetNodeDvs$: Observable<SdWidgetSchema | null>
    readonly targetExecutionPlanNodeDvs$: Observable<SdWidgetSchema | null>

    readonly focusNode$ = new Subject<string>()
    readonly highlightedRelationsNodesIds$ = new BehaviorSubject<string[] | null>(null)
    readonly graphNodeView$ = new BehaviorSubject<SgNodeControl.NodeView>(SgNodeControl.NodeView.Detailed)

    executionEventId: string

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                readonly store: EventOverviewStoreFacade) {
        super()

        this.graphData$ = merge(
            this.store.loadingProcessingEvents.success$,
            this.store.graphLoadingProcessingEvents.success$,
            this.graphNodeView$.pipe(skip(1))
        )
            .pipe(
                takeUntil(this.destroyed$),
                withLatestFrom(this.graphNodeView$),
                map(([x, graphNodeView]) => {
                    const state = this.store.state
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
                                    (nodeId) => this.onNodeHighlightToggleRelations(nodeId),
                                    graphNodeView
                                ),
                            ),
                    }
                }),
                shareReplay(1),
            )

        this.selectedNodeRelations$ = this.store.selectedNode$
            .pipe(
                map(
                    selectedNode => selectedNode
                        ? {
                            node: selectedNode,
                            children: this.store.findChildrenNodes(selectedNode.id),
                            parents: this.store.findParentNodes(selectedNode.id),
                        }
                        : null,
                ),
            )

        this.targetNodeDvs$ = this.store.targetNode$
            .pipe(
                map(node => {
                    if (node === null) {
                        return null
                    }

                    return EventNodeInfo.toDataSchema(
                        node,
                        (nodeId) => this.onExecutionPlanNodeLaunchAction(nodeId),
                        (nodeId) => this.onNodeFocus(nodeId),
                        (nodeId) => this.onNodeHighlightToggleRelations(nodeId),
                    )
                }),
            )

        // TODO: optimize code duplication after PoC approve.
        this.targetExecutionPlanNodeDvs$ = this.store.targetExecutionPlanNode$
            .pipe(
                map(node => {
                    if (node === null) {
                        return null
                    }

                    return EventNodeInfo.toDataSchema(
                        node,
                        (nodeId) => this.onExecutionPlanNodeLaunchAction(nodeId),
                        (nodeId) => this.onNodeFocus(nodeId),
                        (nodeId) => this.onNodeHighlightToggleRelations(nodeId),
                    )
                }),
            )

    }

    ngOnInit(): void {
        this.executionEventId = this.activatedRoute.snapshot.params['id']
        const selectedNodeId = this.activatedRoute.snapshot.queryParamMap.get(this.selectedNodeQueryParamName)

        this.store.init(this.executionEventId, selectedNodeId)
        //
        // [ACTION] :: SELECTED NODE CHANGE
        //      => update query params
        //
        this.store.selectedNode$
            .pipe(
                skip(1),
                takeUntil(this.destroyed$),
                map(selectedNode => selectedNode?.id ?? null),
                filter(nodeId => {
                    const currentNodeId = this.activatedRoute.snapshot.queryParamMap.get(this.selectedNodeQueryParamName)
                    return currentNodeId !== nodeId
                }),
            )
            .subscribe(
                nodeId => this.updateQueryParams(nodeId),
            )
    }

    onNodeSelected($event: { nodeSchema: SgNodeSchema | null }): void {
        this.store.setSelectedNode($event.nodeSchema ? $event.nodeSchema.id : null)
    }

    onNodeDoubleClick(nodeSchema: SgNodeSchema): void {
        const node = this.store.findNode(nodeSchema.id)
        if (node.type === ExecutionEventLineageNodeType.Execution) {
            this.navigateToExecutionPlanPage(node.id)
        }
    }

    onToggleAllRelationsBtnClicked(): void {
        this.highlightedRelationsNodesIds$.next(null)
    }

    onChangeGraphDepth(depth): void {
        this.store.setGraphDepth(depth)
    }

    onExecutionPlanNodeLaunchAction(nodeId: string): void {
        this.navigateToExecutionPlanPage(nodeId)
    }

    onNodeFocus(nodeId: string): void {
        this.focusNode$.next(nodeId)
    }

    onNodeHighlightRelations(nodeId: string): void {
        this.processNodeHighlightAction(nodeId, SgRelations.toggleSelection)
    }

    onNodeHighlightToggleRelations(nodeId: string): void {
        this.processNodeHighlightAction(nodeId, SgRelations.toggleSelection)
    }

    onShowDetailsBtnCLicked(): void {
        this.store.setSelectedNode(null)
    }

    onGraphNodeViewChanged(nodeView: SgNodeControl.NodeView) {
        this.graphNodeView$.next(nodeView)
    }

    private navigateToExecutionPlanPage(executionPlanId: string): void {
        this.router.navigate(
            ['/plans/overview', executionPlanId],
            {
                queryParams: {
                    eventId: this.executionEventId,
                },
            },
        )
    }

    private processNodeHighlightAction(nodeId: string, highlightFn: SgRelations.NodeHighlightFn) {
        const highlightedRelationsNodesIds = highlightFn(
            this.highlightedRelationsNodesIds$.getValue() ?? [],
            nodeId,
            this.store.state.links,
        )

        this.highlightedRelationsNodesIds$.next(
            highlightedRelationsNodesIds.length > 0 ? highlightedRelationsNodesIds : null
        )
    }

    private updateQueryParams(nodeId: string | null): void {

        RouterHelpers.updateCurrentRouterOneQueryParam(
            this.router,
            this.activatedRoute,
            this.selectedNodeQueryParamName,
            nodeId,
        )
    }
}