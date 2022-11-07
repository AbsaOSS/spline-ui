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

import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { ExecutionEvent, ExecutionEventApiService, ExecutionEventsQuery, SplineDataSourceInfo } from 'spline-api'
import { DynamicFilterFactory, DynamicFilterModel } from 'spline-common/dynamic-filter'
import { DtCellCustomEvent } from 'spline-common/dynamic-table'
import { DynamicFilterStorePlugin, SplineConfigApiService } from 'spline-shared'
import { BaseLocalStateComponent } from 'spline-utils'

import { DsStateHistoryFactoryStore } from '../../../data-sources'
import { DsStateHistoryDtSchema } from '../../../dynamic-table'
import { DsOverviewStore } from '../../../services'
import { DsOverviewHistoryPageSchema } from './ds-overview-history.page.schema'


@Component({
    selector: 'data-sources-overview-history-page',
    templateUrl: './ds-overview-history.page.component.html',
    styleUrls: ['./ds-overview-history.page.component.scss'],
    providers: [
        {
            provide: DsStateHistoryFactoryStore,
            useFactory: (
                executionEventApiService: ExecutionEventApiService,
                splineConfigApiService: SplineConfigApiService,
                store: DsOverviewStore
            ) => {

                const dsUri$ = store.dataSourceInfo$.pipe(map((dataSourceInfo) => dataSourceInfo.uri))

                return new DsStateHistoryFactoryStore(executionEventApiService, splineConfigApiService, dsUri$)
            },
            deps: [
                ExecutionEventApiService,
                SplineConfigApiService,
                DsOverviewStore
            ]
        }
    ]

})
export class DsOverviewHistoryPageComponent extends BaseLocalStateComponent<DsOverviewHistoryPageSchema.State> implements OnInit {

    readonly dataMap = DsStateHistoryDtSchema.getSchema()
    readonly dataSourceInfo$: Observable<SplineDataSourceInfo>

    filterModel: DynamicFilterModel<DsOverviewHistoryPageSchema.Filter>

    constructor(readonly dataSource: DsStateHistoryFactoryStore,
                private readonly dynamicFilterFactory: DynamicFilterFactory,
                private readonly store: DsOverviewStore
    ) {
        super()

        this.updateState(
            DsOverviewHistoryPageSchema.getDefaultState()
        )

        this.dataSourceInfo$ = this.store.dataSourceInfo$
    }

    ngOnInit(): void {
        this.dynamicFilterFactory
            .schemaToModel<DsOverviewHistoryPageSchema.Filter>(
                DsOverviewHistoryPageSchema.getDynamicFilterSchema()
            )
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe(model => {
                this.filterModel = model
                DynamicFilterStorePlugin.bindDynamicFilter<ExecutionEventsQuery.QueryFilter, DsOverviewHistoryPageSchema.Filter>(
                    this.dataSource,
                    this.filterModel,
                    DsOverviewHistoryPageSchema.getFiltersMapping()
                )
            })
    }

    onCellEvent($event: DtCellCustomEvent<ExecutionEvent>): void {
        if ($event.event instanceof DsStateHistoryDtSchema.OpenDsStateDetailsEvent) {
            this.updateState(
                DsOverviewHistoryPageSchema.reduceSelectDsState(
                    this.state, $event.rowData
                )
            )
        }
    }

    onSideDialogClosed(): void {
        this.updateState(
            DsOverviewHistoryPageSchema.reduceSelectDsState(
                this.state, null
            )
        )
    }
}
