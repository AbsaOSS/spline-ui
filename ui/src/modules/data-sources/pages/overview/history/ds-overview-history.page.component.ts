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
import { ActivatedRoute, Router } from '@angular/router'
import { isEqual } from 'lodash-es'
import { Observable } from 'rxjs'
import { distinctUntilChanged, filter, map, skip, takeUntil, withLatestFrom } from 'rxjs/operators'
import { ExecutionEvent, ExecutionEventFacade, ExecutionEventField, ExecutionEventsQuery, SplineDataSourceInfo } from 'spline-api'
import { SplineDateRangeFilter } from 'spline-common'
import { DtCellCustomEvent } from 'spline-common/dynamic-table'
import { BaseLocalStateComponent, SearchQuery, SplineDateRangeValue } from 'spline-utils'

import { DsStateHistoryDataSource } from '../../../data-sources'
import { DsStateHistoryDtSchema } from '../../../dynamic-table'
import { DsOverviewStoreFacade } from '../../../services'

import { DsOverviewHistoryPage } from './ds-overview-history.page.models'
import SearchParams = SearchQuery.SearchParams

// TODO: Replace redundant filter logic with some generic filter model.
@Component({
    selector: 'data-sources-overview-history-page',
    templateUrl: './ds-overview-history.page.component.html',
    styleUrls: ['./ds-overview-history.page.component.scss'],
    providers: [
        {
            provide: DsStateHistoryDataSource,
            useFactory: (executionEventFacade: ExecutionEventFacade) => {
                return new DsStateHistoryDataSource(executionEventFacade)
            },
            deps: [ExecutionEventFacade],
        },
    ],

})
export class DsOverviewHistoryPageComponent extends BaseLocalStateComponent<DsOverviewHistoryPage.State> implements OnInit {

    readonly dataMap = DsStateHistoryDtSchema.getSchema()
    readonly dataSourceInfo$: Observable<SplineDataSourceInfo>

    constructor(readonly dataSource: DsStateHistoryDataSource,
                private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                private readonly store: DsOverviewStoreFacade) {
        super()

        this.updateState(
            DsOverviewHistoryPage.getDefaultState()
        )

        this.initDateRangeFilter()

        this.dataSourceInfo$ = this.store.isInitialized$
            .pipe(
                withLatestFrom(this.store.dataSourceInfo$),
                filter(([isInitialized, dataSourceInfo]) => isInitialized && !!dataSourceInfo),
                map(([isInitialized, dataSourceInfo]) => dataSourceInfo),
            )

        this.dataSourceInfo$
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe((dataSourceInfo) => {
                this.dataSource.updateAndApplyDefaultSearchParams({
                    filter: {
                        dataSourceUri: dataSourceInfo.uri
                    }
                })
            })
    }

    ngOnInit(): void {
    }

    onCellEvent($event: DtCellCustomEvent<ExecutionEvent>): void {
        if ($event.event instanceof DsStateHistoryDtSchema.OpenDsStateDetailsEvent) {
            this.updateState(
                DsOverviewHistoryPage.reduceSelectDsState(
                    this.state, $event.rowData
                )
            )
        }
    }

    onDateFilterChanged(value: SplineDateRangeFilter.Value): void {
        this.updateDateRangeFilterValue(value)
    }

    onSideDialogClosed(): void {
        this.updateState(
            DsOverviewHistoryPage.reduceSelectDsState(
                this.state, null
            )
        )
    }

    private updateDateRangeFilterValue(value: SplineDateRangeFilter.Value): void {
        this.updateState(
            DsOverviewHistoryPage.reduceDateRangeFilterChanged(
                this.state, value
            )
        )
    }

    private initDateRangeFilter(): void {
        //
        // [ACTION] :: FilterValue changed
        //      => fetch data
        //
        this.state$
            .pipe(
                map(state => state.dateRangeFilter.value),
                skip(1),
                takeUntil(this.destroyed$),
                distinctUntilChanged((left, right) => isEqual(left, right)),
                filter(filterValue => {
                    const searchParams = this.dataSource.searchParams
                    const currentDsFilterValue: SplineDateRangeValue = searchParams.filter.executedAtFrom
                        ? {
                            dateFrom: searchParams.filter.executedAtFrom,
                            dateTo: searchParams.filter.executedAtTo,
                        }
                        : null

                    return !isEqual(filterValue, currentDsFilterValue)
                })
            )
            .subscribe(filterValue => {
                this.dataSource.setFilter({
                    ...this.dataSource.searchParams.filter,
                    executedAtFrom: filterValue?.dateFrom ?? undefined,
                    executedAtTo: filterValue?.dateTo ?? undefined,
                })
            })

        //
        // [ACTION] :: SearchParams changed
        //      => update current date range filter value
        //
        this.dataSource.searchParams$
            .pipe(
                takeUntil(this.destroyed$),
                map((searchParams: SearchParams<ExecutionEventsQuery.QueryFilter, ExecutionEventField>) => {

                    if (!searchParams.filter?.executedAtFrom || !searchParams.filter?.executedAtTo) {
                        return null
                    }

                    return {
                        dateFrom: searchParams.filter.executedAtFrom,
                        dateTo: searchParams.filter.executedAtTo,
                    }
                }),
                filter(filterValue => !isEqual(filterValue, this.state.dateRangeFilter.value)),
            )
            .subscribe(
                filterValue => this.updateDateRangeFilterValue(filterValue),
            )

        //
        // [ACTION] :: DateRange Bounds changed (from the fetched data)
        //      => update current date range filter bounds value
        //
        this.dataSource.dataState$
            .pipe(
                takeUntil(this.destroyed$),
                map(dataState => dataState?.data?.dateRangeBounds),
                distinctUntilChanged((left, right) => isEqual(left, right)),
                filter(dateRangeBounds => !isEqual(dateRangeBounds, this.state.dateRangeFilter.bounds))
            )
            .subscribe(dateRangeBounds => {
                this.updateState(
                    DsOverviewHistoryPage.reduceDateRangeFilterBoundsChanged(
                        this.state, dateRangeBounds
                    )
                )
            })
    }
}
