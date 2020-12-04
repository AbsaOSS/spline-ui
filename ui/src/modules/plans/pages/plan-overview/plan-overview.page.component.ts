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

import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter, map, skip, takeUntil } from 'rxjs/operators'
import { ExecutionPlanFacade } from 'spline-api'
import { SplineTabsNavBar } from 'spline-common'
import { SgContainerComponent, SgNodeControl } from 'spline-shared/graph'
import { BaseComponent, RouterNavigation } from 'spline-utils'

import { PlanOverview } from '../../models'
import { ExecutionPlanOverviewStoreFacade } from '../../store'
import QueryParamAlis = PlanOverview.QueryParamAlis
import NavTabInfo = SplineTabsNavBar.NavTabInfo


@Component({
    selector: 'plan-overview-page',
    templateUrl: './plan-overview.page.component.html',
    styleUrls: ['./plan-overview.page.component.scss'],
    providers: [
        {
            provide: ExecutionPlanOverviewStoreFacade,
            useFactory: (executionPlanFacade: ExecutionPlanFacade) => {
                return new ExecutionPlanOverviewStoreFacade(executionPlanFacade)
            },
            deps: [ExecutionPlanFacade],
        },
    ]
})
export class PlanOverviewPageComponent extends BaseComponent implements OnInit {

    @ViewChild(SgContainerComponent) readonly sgContainer: SgContainerComponent

    readonly headerNavTabs: NavTabInfo[] = [
        {
            label: 'PLANS.PLAN_OVERVIEW__NAV_TAB__GRAPH_VIEW',
            routeLink: '.',
            icon: 'graph-outline'
        }
    ]

    eventId: string

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                readonly store: ExecutionPlanOverviewStoreFacade) {
        super()

        //
        // [ACTION] :: ATTRIBUTE SELECTED
        //      => reset node highlights
        //
        this.store.selectedAttribute$
            .pipe(
                skip(2),
                takeUntil(this.destroyed$),
            )
            .subscribe(
                () => this.resetNodeHighlightRelations(),
            )
    }

    ngOnInit(): void {

        const routerState = PlanOverview.extractRouterState(this.activatedRoute)
        this.eventId = routerState[QueryParamAlis.ExecutionEventId]

        // init store state
        this.store.init(
            routerState[QueryParamAlis.ExecutionPlanId],
            routerState[QueryParamAlis.SelectedNodeId],
            routerState[QueryParamAlis.SelectedAttributeId],
        )

        this.watchStoreStateChanges()
        this.watchUrlChanges()
    }

    onNodeSelected(nodeId: string | null): void {
        this.store.setSelectedNode(nodeId)
    }

    onSelectedAttributeChanged(attributeId: string | null): void {
        this.store.setSelectedAttribute(attributeId)
    }

    onGraphNodeViewChanged(graphNodeView: SgNodeControl.NodeView): void {
        this.store.setGraphNodeView(graphNodeView)
    }

    onContentSidebarDialogClosed(): void {
        this.onNodeSelected(null)
    }

    onNodeFocus(nodeId: string): void {
        this.sgContainer.focusNode(nodeId)
    }

    onHighlightedRelationsNodesIdsChange(nodeIds: string[] | null): void {
        if (nodeIds?.length !== undefined && !!this.store.state.selectedAttributeId) {
            this.store.setSelectedAttribute(null)
        }
    }

    private resetNodeHighlightRelations(): void {
        this.sgContainer.highlightNodeRelations(null)
    }

    // Watch Store State changes => update Router State if needed
    private watchStoreStateChanges(): void {
        //
        // [ACTION] :: SELECTED NODE CHANGE
        //      => update query params
        //
        this.store.selectedNode$
            .pipe(
                skip(1),
                takeUntil(this.destroyed$),
                map(selectedNode => selectedNode ? selectedNode.id : null),
                filter(selectedNodeId => {
                    const nodeId = PlanOverview.getSelectedNodeId(this.activatedRoute)
                    return selectedNodeId !== nodeId
                }),
            )
            .subscribe(selectedNodeId =>
                this.updateQueryParams(PlanOverview.QueryParamAlis.SelectedNodeId, selectedNodeId),
            )

        //
        // [ACTION] :: SELECTED ATTRIBUTE CHANGE
        //      => update query params
        //
        this.store.selectedAttribute$
            .pipe(
                skip(1),
                takeUntil(this.destroyed$),
                map(selectedAttribute => selectedAttribute ? selectedAttribute.id : null),
                filter(selectedAttributeId => {
                    const attrId = PlanOverview.getSelectedAttributeId(this.activatedRoute)
                    return selectedAttributeId !== attrId
                }),
            )
            .subscribe(attrId =>
                this.updateQueryParams(PlanOverview.QueryParamAlis.SelectedAttributeId, attrId),
            )
    }

    // Watch Router State changes => update Store State if needed
    private watchUrlChanges(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {

                const routerState = PlanOverview.extractRouterState(this.activatedRoute)
                this.eventId = routerState[QueryParamAlis.ExecutionEventId]

                // reinitialize store state in case of new ExecutionPlan ID
                if (routerState[QueryParamAlis.ExecutionPlanId] !== this.store.state.executionPlanId) {
                    this.store.init(
                        routerState[QueryParamAlis.ExecutionPlanId],
                        routerState[QueryParamAlis.SelectedNodeId],
                        routerState[QueryParamAlis.SelectedAttributeId],
                    )
                }
                else {
                    this.store.setSelectedNode(routerState[QueryParamAlis.SelectedNodeId])
                    this.store.setSelectedAttribute(routerState[QueryParamAlis.SelectedAttributeId])
                }
            })
    }

    private updateQueryParams(paramName: string, value: string | null, replaceUrl: boolean = true): void {
        RouterNavigation.updateCurrentRouterOneQueryParam(
            this.router,
            this.activatedRoute,
            paramName,
            value,
            replaceUrl,
        )
    }
}
