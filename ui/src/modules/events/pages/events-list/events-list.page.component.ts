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
import { takeUntil } from 'rxjs/operators'
import { ExecutionEventApiService, ExecutionEventsQuery } from 'spline-api'
import { DynamicFilterFactory, DynamicFilterModel } from 'spline-common/dynamic-filter'
import { DynamicFilterStoreExtras, SplineConfigApiService } from 'spline-shared'
import { EventsFactoryStore } from 'spline-shared/events'
import { BaseComponent } from 'spline-utils'

import { EventsListDtSchema } from '../../dynamic-table'

import { EventsListPageConfig } from './events-list.page-config'


@Component({
    selector: 'events-list-page',
    templateUrl: './events-list.page.component.html',
    styleUrls: ['./events-list.page.component.scss'],
    providers: [
        {
            provide: EventsFactoryStore,
            useFactory: (
                executionEventApiService: ExecutionEventApiService,
                splineConfigApiService: SplineConfigApiService
            ) => {
                return new EventsFactoryStore(executionEventApiService, splineConfigApiService)
            },
            deps: [
                ExecutionEventApiService,
                SplineConfigApiService
            ]
        }
    ]
})
export class EventsListPageComponent extends BaseComponent implements OnDestroy, OnInit {

    readonly dataMap = EventsListDtSchema.getSchema()

    filterModel: DynamicFilterModel<EventsListPageConfig.Filter>

    constructor(readonly dataSource: EventsFactoryStore,
                private readonly dynamicFilterFactory: DynamicFilterFactory
    ) {
        super()
    }

    ngOnInit(): void {
        this.dynamicFilterFactory
            .schemaToModel<EventsListPageConfig.Filter>(
                EventsListPageConfig.getDynamicFilterSchema()
            )
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe(model => {
                this.filterModel = model
                DynamicFilterStoreExtras.bindDynamicFilter<ExecutionEventsQuery.QueryFilter, EventsListPageConfig.Filter>(
                    this.dataSource,
                    this.filterModel,
                    EventsListPageConfig.getFiltersMapping()
                )
            })
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.dataSource.disconnect()
    }
}
