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

import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { EventOverviewType } from 'spline-api'
import { SlBreadcrumbs } from 'spline-common/layout'
import { BaseComponent } from 'spline-utils'

import { EventOverviewStore, EventOverviewStoreNs } from '../../store'

import { EventOverviewPage } from './event-overview.page.model'


@Component({
    selector: 'event-overview-page',
    templateUrl: './event-overview.page.component.html',
    styleUrls: ['./event-overview.page.component.scss']
})
export class EventOverviewPageComponent extends BaseComponent implements OnInit, OnDestroy {
    readonly state$: Observable<EventOverviewStoreNs.State>

    readonly breadcrumbs$: Observable<SlBreadcrumbs.Breadcrumbs>

    constructor(private readonly activatedRoute: ActivatedRoute,
                readonly store: EventOverviewStore
    ) {
        super()
        this.state$ = store.state$

        // TODO: Use some generic system for breadcrumbs definition.
        this.breadcrumbs$ = store.state$
            .pipe(
                map(state => state.eventInfo.name),
                distinctUntilChanged(),
                map(eventName => [
                    {
                        label: 'Execution Event'
                    },
                    {
                        label: eventName
                    },
                    {
                        label: 'Overview'
                    }
                ])
            )
    }

    isImpactOverviewType(overviewType: string): overviewType is EventOverviewType.Impact {
        return overviewType === EventOverviewType.Impact
    }
    ngOnInit(): void {
        const executionEventId =
            this.activatedRoute.snapshot.params['id']

        const requestedGraphDepth =
            +this.activatedRoute.snapshot.queryParams[EventOverviewPage.QueryParam.RequestedGraphDepth]
            || EventOverviewStoreNs.GRAPH_DEFAULT_DEPTH
        const queryParamOverviewType = this.activatedRoute.snapshot.queryParams['overview']
        const overviewType = this.isImpactOverviewType(queryParamOverviewType) ? EventOverviewType.Impact : EventOverviewType.Lineage
        this.store.init(executionEventId, requestedGraphDepth, overviewType)
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.store.resetState()
    }

}
