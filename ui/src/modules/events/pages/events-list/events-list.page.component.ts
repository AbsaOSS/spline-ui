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
import { ExecutionEventFacade, ExecutionEventsQuery } from 'spline-api'
import { DynamicFilterModel, DynamicFilterValue } from 'spline-common/dynamic-filter'
import { EventsDataSource } from 'spline-shared/events'
import { BaseComponent, SearchDataSource } from 'spline-utils'

import { EventsListDtSchema } from '../../dynamic-table'

import { EventsListPage } from './events-list.page.models'


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

        this.initDateRangeFilter<ExecutionEventsQuery.QueryFilter, EventsListPage.Filter>(this.dataSource, this.filterModel)
    }

    private initDateRangeFilter<TQueryFilter, TDynamicFilter>(
        dataSource: SearchDataSource<any, any, TQueryFilter>,
        filterModel: DynamicFilterModel<TDynamicFilter>): void {

        //
        // [ACTION] :: FilterValue changed
        //      => fetch data
        //
        filterModel.valueChanged$
            .pipe(
                skip(1),
                takeUntil(dataSource.disconnected$),
                distinctUntilChanged((left, right) => isEqual(left, right)),
                map((dynamicFilterValue: DynamicFilterValue<TDynamicFilter>) => {
                    const currentQueryFilter = dataSource.searchParams.filter
                    return {
                        ...currentQueryFilter,
                        ...EventsListPage.dynamicFilterToQueryFilter(dynamicFilterValue as any, currentQueryFilter)
                    }
                }),
                filter((queryFilter: TQueryFilter) => {
                    const currentQueryFilter = dataSource.searchParams.filter
                    return !isEqual(queryFilter, currentQueryFilter)
                })
            )
            .subscribe(queryFilter => {
                dataSource.setFilter(queryFilter)
            })

        //
        // [ACTION] :: SearchParams changed
        //      => update current date range filter value
        //
        dataSource.searchParams$
            .pipe(
                skip(1),
                takeUntil(dataSource.disconnected$),
                map((searchParams) => EventsListPage.queryFilterToDynamicFilter(searchParams.filter as any)),
                filter(filterValue => {
                    const currentValue = filterModel.plainValue
                    return !isEqual(filterValue, currentValue)
                }),
            )
            .subscribe(filterValue => {
                filterModel.patchValue(filterValue as any, false)
            })
    }
}
