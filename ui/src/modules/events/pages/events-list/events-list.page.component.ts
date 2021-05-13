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

import { Component } from '@angular/core'
import { isEqual } from 'lodash-es'
import { distinctUntilChanged, filter, map, skip, takeUntil } from 'rxjs/operators'
import { ExecutionEventFacade, ExecutionEventField, ExecutionEventsQuery } from 'spline-api'
import { SplineDateRangeFilter } from 'spline-common'
import { EventsDataSource } from 'spline-shared/events'
import { BaseLocalStateComponent, SearchQuery, SplineDateRangeValue } from 'spline-utils'

import { EventsListDtSchema } from '../../dynamic-table'

import { EventsListPage } from './events-list.page.models'
import SearchParams = SearchQuery.SearchParams


@Component({
    selector: 'events-list-page',
    templateUrl: './events-list.page.component.html',
    styleUrls: ['./events-list.page.component.scss'],
    providers: [
        {
            provide: EventsDataSource,
            useFactory: (executionEventFacade: ExecutionEventFacade) => {
                return new EventsDataSource(executionEventFacade)
            },
            deps: [ExecutionEventFacade],
        },
    ],
})
export class EventsListPageComponent extends BaseLocalStateComponent<EventsListPage.State> {

    readonly dataMap = EventsListDtSchema.getSchema()

    constructor(readonly dataSource: EventsDataSource) {
        super()

        this.updateState(
            EventsListPage.getDefaultState()
        )

        this.initDateRangeFilter()

    }

    onDateFilterChanged(value: SplineDateRangeFilter.Value): void {
        this.updateDateRangeFilterValue(value)
    }

    private updateDateRangeFilterValue(value: SplineDateRangeFilter.Value): void {
        this.updateState(
            EventsListPage.reduceDateRangeFilterChanged(
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
                    EventsListPage.reduceDateRangeFilterBoundsChanged(
                        this.state, dateRangeBounds
                    )
                )
            })
    }
}
