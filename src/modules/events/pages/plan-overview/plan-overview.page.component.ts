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
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router'
import _ from 'lodash'
import { Observable } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { ExecutionPlanFacade } from 'spline-api'
import { SgNodeSchema, SplineDataViewSchema } from 'spline-common'
import { BaseComponent } from 'spline-utils'

import { OperationInfo } from '../../models'
import { ExecutionPlanOverviewStoreFacade } from '../../store'


interface FoodNode {
    name: string
    children?: FoodNode[]
}

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

    private readonly executionEventQueryParamName: string = 'eventId'
    private readonly selectedNodeQueryParamName: string = 'nodeId'
    private readonly selectedAttributeQueryParamName: string = 'attributeId'

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
        const executionPlanId = this.activatedRoute.snapshot.params['planId']
        this.eventId = this.activatedRoute.snapshot.queryParamMap.get(this.executionEventQueryParamName)
        const selectedNodeId = this.activatedRoute.snapshot.queryParamMap.get(this.selectedNodeQueryParamName)
        const selectedAttributeId = this.activatedRoute.snapshot.queryParamMap.get(this.selectedAttributeQueryParamName)

        this.store.init(executionPlanId, selectedNodeId, selectedAttributeId)

        //
        // [ACTION] :: SELECTED NODE CHANGE
        //      => update query params
        //
        this.store.selectedNode$
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe(selectedNode => {
                const queryParams = selectedNode
                    ? {
                        ...this.activatedRoute.snapshot.queryParams,
                        [this.selectedNodeQueryParamName]: selectedNode.id,
                    }
                    : _.omit(this.activatedRoute.snapshot.queryParams, this.selectedNodeQueryParamName)

                this.updateQueryParams(queryParams)
            })

        //
        // [ACTION] :: SELECTED NODE CHANGE
        //      => update query params
        //
        this.store.selectedAttribute$
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe(selectedAttribute => {
                const queryParams = selectedAttribute
                    ? {
                        ...this.activatedRoute.snapshot.queryParams,
                        [this.selectedAttributeQueryParamName]: selectedAttribute.id,
                    }
                    : _.omit(this.activatedRoute.snapshot.queryParams, this.selectedAttributeQueryParamName)

                this.updateQueryParams(queryParams)
            })

        this.store.selectedNode$
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe(selectedNode => {
                const queryParams = selectedNode
                    ? {
                        ...this.activatedRoute.snapshot.queryParams,
                        [this.selectedNodeQueryParamName]: selectedNode.id,
                    }
                    : _.omit(this.activatedRoute.snapshot.queryParams, this.selectedNodeQueryParamName)

                this.updateQueryParams(queryParams)
            })
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

    private updateQueryParams(queryParams: Params, replaceUrl: boolean = true): void {

        const extras: NavigationExtras = {
            queryParams,
            relativeTo: this.activatedRoute,
            replaceUrl,
        }

        this.router.navigate([], extras)
    }

}
