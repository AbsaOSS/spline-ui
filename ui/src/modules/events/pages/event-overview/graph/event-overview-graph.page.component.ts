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

import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { filter, map, skip, takeUntil } from 'rxjs/operators'
import { ExecutionEventLineageNodeType } from 'spline-api'
import { SplineDataWidgetEvent } from 'spline-common/data-view'
import { SgNodeEvent, SgNodeSchema } from 'spline-common/graph'
import { SgNodeCardDataView } from 'spline-shared/data-view'
import { SgContainerComponent, SgNodeControl } from 'spline-shared/graph'
import { BaseComponent, GenericEventInfo, RouterNavigation } from 'spline-utils'

import { EventNodeControl, EventNodeInfo } from '../../../models'
import { EventOverviewStore, EventOverviewStoreFacade } from '../../../store'
import NodeEventData = SgNodeCardDataView.NodeEventData


@Component({
    selector: 'event-overview-graph-page',
    templateUrl: './event-overview-graph.page.component.html',
    styleUrls: ['./event-overview-graph.page.component.scss'],
})
export class EventOverviewGraphPageComponent extends BaseComponent implements OnInit {

    @ViewChild(SgContainerComponent) readonly sgContainer: SgContainerComponent

    readonly state$: Observable<EventOverviewStore.State>

    readonly selectedNodeQueryParamName: string = 'selectedNodeId'

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                readonly store: EventOverviewStoreFacade) {
        super()

        this.state$ = store.state$
    }

    ngOnInit(): void {
        const selectedNodeId = this.activatedRoute.snapshot.queryParamMap.get(this.selectedNodeQueryParamName)
        this.store.setSelectedNode(selectedNodeId)

        //
        // [ACTION] :: SELECTED NODE CHANGE
        //      => update query params
        //
        this.store.state$
            .pipe(
                map(state => state.selectedNodeId),
                skip(2),
                takeUntil(this.destroyed$),
                filter(nodeId => {
                    const currentNodeId = this.activatedRoute.snapshot.queryParamMap.get(this.selectedNodeQueryParamName)
                    return currentNodeId !== nodeId
                }),
            )
            .subscribe(
                nodeId => this.updateQueryParams(nodeId),
            )
    }

    onNodeSelected(nodeId: string | null): void {
        this.store.setSelectedNode(nodeId)
    }

    onNodeDoubleClick(nodeSchema: SgNodeSchema): void {
        const node = this.store.findNode(nodeSchema.id)
        if (node.type === ExecutionEventLineageNodeType.Execution) {
            this.navigateToExecutionPlanPage(node.id)
        }
    }

    onChangeGraphDepth(depth): void {
        this.store.setGraphDepth(depth)
    }

    onDataViewEvent($event: SplineDataWidgetEvent): void {
        switch ($event.type) {
            case EventNodeInfo.WidgetEvent.LaunchExecutionEvent:
                this.onExecutionPlanNodeLaunchAction(($event as GenericEventInfo<NodeEventData>).data.nodeId)
                break
            case SgNodeCardDataView.WidgetEvent.FocusNode:
                this.onNodeFocus(($event as GenericEventInfo<NodeEventData>).data.nodeId)
                break

            case SgNodeCardDataView.WidgetEvent.HighlightNodeRelations:
                this.onNodeHighlightRelations(($event as GenericEventInfo<NodeEventData>).data.nodeId)
                break
        }
    }

    onGraphNodeEvent($event: SgNodeEvent): void {
        switch ($event.event.type) {
            case EventNodeControl.NodeControlEvent.LaunchExecutionEvent:
                this.onExecutionPlanNodeLaunchAction($event.nodeSchema.id)
                break
            case EventNodeControl.NodeControlEvent.LoadHistory:
                this.store.loadNodeHistory(
                    EventNodeControl.loadMoreNodeToNativeNodeId($event.nodeSchema.id)
                )
                break
            case EventNodeControl.NodeControlEvent.LoadFuture:
                this.store.loadNodeFuture(
                    EventNodeControl.loadMoreNodeToNativeNodeId($event.nodeSchema.id)
                )
                break
        }
    }

    onContentSidebarDialogClosed(): void {
        this.onNodeSelected(null)
    }

    onGraphNodeViewChanged(graphNodeView: SgNodeControl.NodeView): void {
        this.store.setGraphNodeView(graphNodeView)
    }

    onHighlightSpecificRelations(nodeIds: string[]): void {
        this.sgContainer.highlightSpecificRelations(nodeIds)
    }

    private onExecutionPlanNodeLaunchAction(nodeId: string): void {
        this.navigateToExecutionPlanPage(nodeId)
    }

    private onNodeFocus(nodeId: string): void {
        this.sgContainer.focusNode(nodeId)
    }

    private onNodeHighlightRelations(nodeId: string): void {
        this.sgContainer.highlightNodeRelations(nodeId)
    }

    private navigateToExecutionPlanPage(executionPlanId: string): void {
        this.router.navigate(
            ['/plans/overview', executionPlanId],
            {
                queryParams: {
                    eventId: this.store.state.executionEventId,
                },
            },
        )
    }

    private updateQueryParams(nodeId: string | null): void {
        RouterNavigation.updateCurrentRouterOneQueryParam(
            this.router,
            this.activatedRoute,
            this.selectedNodeQueryParamName,
            nodeId,
        )
    }
}
