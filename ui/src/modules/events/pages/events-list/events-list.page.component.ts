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
import { DataSourceWriteMode, ExecutionEventFacade, ExecutionEventField, ExecutionEventsQuery } from 'spline-api'
import { DynamicFilterModel, DynamicFilterValue } from 'spline-common/dynamic-filter'
import { DfControlDateRange } from 'spline-common/dynamic-filter/filter-controls'
import { EventsDataSource } from 'spline-shared/events'
import { BaseComponent, BaseLocalStateComponent, SearchQuery, SplineDateRangeValue } from 'spline-utils'

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
export class EventsListPageComponent extends BaseComponent {

    readonly dataMap = EventsListDtSchema.getSchema()
    readonly filterModel: DynamicFilterModel<EventsListPage.Filter> = EventsListPage.createFilterModel()

    constructor(readonly dataSource: EventsDataSource) {
        super()
        this.initDateRangeFilter()
    }

    private get dateRangeControl(): DfControlDateRange.Model {
        return this.filterModel.getFilterControl(EventsListPage.FilterId.dataRange) as DfControlDateRange.Model
    }

    private initDateRangeFilter(): void {
        //
        // [ACTION] :: FilterValue changed
        //      => fetch data
        //
        this.filterModel.valueChanged$
            .pipe(
                skip(1),
                takeUntil(this.destroyed$),
                distinctUntilChanged((left, right) => isEqual(left, right)),
                map((dynamicFilterValue: DynamicFilterValue<EventsListPage.Filter>) =>
                    dynamicFilterValue[EventsListPage.FilterId.dataRange].value
                ),
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
                filter(filterValue => !isEqual(filterValue, this.dateRangeControl.value)),
            )
            .subscribe(
                filterValue => this.dateRangeControl.patchValue(filterValue),
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
                filter(dateRangeBounds => !isEqual(dateRangeBounds, this.dateRangeControl.bounds))
            )
            .subscribe(dateRangeBounds => {
                this.dateRangeControl.bounds = dateRangeBounds
            })
    }
}
