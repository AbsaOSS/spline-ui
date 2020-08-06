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
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router'
import _ from 'lodash'
import { Observable } from 'rxjs'
import { filter, map, skip, takeUntil } from 'rxjs/operators'
import { ExecutionPlanFacade } from 'spline-api'
import { SgNodeSchema, SplineDataViewSchema } from 'spline-common'
import { BaseComponent } from 'spline-utils'

import { ExecutionPlanOverview, OperationInfo } from '../../models'
import { ExecutionPlanOverviewStoreFacade } from '../../store'
import QueryParamAlis = ExecutionPlanOverview.QueryParamAlis


@Component({
    selector: 'event-plan-overview-page',
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
    ],
})
export class PlanOverviewPageComponent extends BaseComponent implements OnInit {

    readonly selectedNodeViewSchema$: Observable<SplineDataViewSchema>

    eventId: string

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                readonly store: ExecutionPlanOverviewStoreFacade) {
        super()

        this.selectedNodeViewSchema$ = this.store.selectedNode$
            .pipe(
                map(selectedNode => selectedNode ? OperationInfo.toDataViewSchema(selectedNode) : null),
            )

    }

    ngOnInit(): void {

        const routerState = ExecutionPlanOverview.extractRouterState(this.activatedRoute)
        this.eventId = routerState[QueryParamAlis.ExecutionEventId]

        this.store.init(
            routerState[QueryParamAlis.ExecutionPlanId],
            routerState[QueryParamAlis.SelectedNodeId],
            routerState[QueryParamAlis.SelectedAttributeId],
        )

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
                    const nodeId = ExecutionPlanOverview.getSelectedNodeId(this.activatedRoute)
                    return selectedNodeId !== nodeId
                }),
            )
            .subscribe(selectedNodeId => {
                this.updateQueryParams(ExecutionPlanOverview.QueryParamAlis.SelectedNodeId, selectedNodeId)
            })
        //
        // //
        // // [ACTION] :: SELECTED ATTRIBUTE CHANGE
        // //      => update query params
        // //
        this.store.selectedAttribute$
            .pipe(
                skip(1),
                takeUntil(this.destroyed$),
                map(selectedAttribute => selectedAttribute ? selectedAttribute.id : null),
                filter(selectedAttributeId => {
                    const attrId = ExecutionPlanOverview.getSelectedAttributeId(this.activatedRoute)
                    return selectedAttributeId !== attrId
                }),
            )
            .subscribe(attrId => {
                this.updateQueryParams(ExecutionPlanOverview.QueryParamAlis.SelectedAttributeId, attrId)
            })

        this.watchUrlChanges()
    }

    onNodeSelected($event: { nodeSchema: SgNodeSchema | null }): void {
        this.store.setSelectedNode($event.nodeSchema ? $event.nodeSchema.id : null)
    }

    onShowEpDetailsBtnCLicked(): void {
        this.store.setSelectedNode(null)
    }

    onSelectedAttributeChanged(attributeId: string | null): void {
        this.store.setSelectedAttribute(attributeId)
    }

    private updateQueryParams(paramName: string, value: string | null, replaceUrl: boolean = true): void {

        const queryParams = value
            ? {
                ...this.activatedRoute.snapshot.queryParams,
                [paramName]: value,
            }
            : _.omit(this.activatedRoute.snapshot.queryParams, paramName)

        const extras: NavigationExtras = {
            queryParams,
            relativeTo: this.activatedRoute,
            replaceUrl,
        }

        this.router.navigate([], extras)
    }

    private watchUrlChanges(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                const routerState = ExecutionPlanOverview.extractRouterState(this.activatedRoute)
                console.log(routerState)

                this.eventId = routerState[QueryParamAlis.ExecutionEventId]

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

}
