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
import { map, takeUntil } from 'rxjs/operators'
import { ExecutionPlanFacade, ExecutionPlanLineageNode } from 'spline-api'
import { SgNodeSchema, SplineDataViewSchema } from 'spline-common'
import { BaseComponent } from 'spline-utils'

import { ExecutionPlanNodeInfo } from '../../models'
import { ExecutionPlanOverviewStoreFacade } from '../../store'


@Component({
    selector: 'event-overview-page',
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

    readonly selectedNodeQueryParamName: string = 'selectedNodeId'

    readonly selectedNodeViewSchema$: Observable<SplineDataViewSchema>

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                readonly store: ExecutionPlanOverviewStoreFacade) {
        super()

        this.selectedNodeViewSchema$ = this.store.selectedNode$
            .pipe(
                map(selectedNode => selectedNode ? ExecutionPlanNodeInfo.toDataSchema(selectedNode) : null),
            )
    }

    ngOnInit(): void {
        const executionPlanId = this.activatedRoute.snapshot.params['id']
        const selectedNodeId = this.activatedRoute.snapshot.queryParamMap.get(this.selectedNodeQueryParamName)

        this.store.init(executionPlanId, selectedNodeId)

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

    private updateQueryParams(selectedNode: ExecutionPlanLineageNode | null): void {
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
