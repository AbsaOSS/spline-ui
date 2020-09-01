/*
 * Copyright 2020 ABSA Group Limited
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

import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import _ from 'lodash'
import { Observable } from 'rxjs'
import { distinctUntilChanged, filter, map, skip, takeUntil } from 'rxjs/operators'
import { ExecutionEventFacade, ExecutionEventField, ExecutionEventsPageResponse, QuerySorter } from 'spline-api'
import { BaseComponent, ProcessingStore, RouterHelpers, SearchQuery } from 'spline-utils'

import { SplineDateFilter } from '../../components'
import { EventsDataSource } from '../../data-sources'
import { EventsListUrlState } from '../../models'


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
export class EventsListPageComponent extends BaseComponent implements OnInit, AfterContentInit, OnDestroy {

    @ViewChild(MatSort, { static: true }) sortControl: MatSort

    readonly loadingProcessing$: Observable<ProcessingStore.EventProcessingState>
    readonly data$: Observable<ExecutionEventsPageResponse>
    readonly dateFilter$: Observable<SplineDateFilter.Value | null>

    readonly visibleColumns = [
        ExecutionEventField.applicationName,
        ExecutionEventField.executionPlanId,
        ExecutionEventField.dataSourceUri,
        ExecutionEventField.dataSourceType,
        ExecutionEventField.append,
        ExecutionEventField.timestamp,
    ]

    readonly ExecutionEventField = ExecutionEventField

    constructor(readonly dataSource: EventsDataSource,
                private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router) {
        super()

        this.loadingProcessing$ = this.dataSource.loadingProcessing$
        this.data$ = this.dataSource.dataState$.pipe(map(dataState => dataState.data))

        this.dateFilter$ = this.dataSource.searchParams$
            .pipe(
                map(searchParams => {
                    if (searchParams.filter?.executedAtFrom && searchParams.filter?.executedAtTo) {

                        return {
                            dateFrom: searchParams.filter?.executedAtFrom,
                            dateTo: searchParams.filter?.executedAtTo,
                        }
                    }
                    else {
                        return null
                    }
                }),
            )
    }

    ngOnInit(): void {
        // init DataSource & load data
        this.initDataSource()
        this.dataSource.load()
    }

    ngAfterContentInit(): void {
        // init view layer Table sorting logic
        this.initTableSortingState()
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.dataSource.disconnect()
    }

    onPaginationChanged(pageEvent: PageEvent): void {
        this.dataSource.goToPage(pageEvent.pageIndex)
    }

    onSearch(searchTerm: string): void {
        this.dataSource.search(searchTerm)
    }

    onDateFilterChanged(value: SplineDateFilter.Value): void {
        this.dataSource.setFilter({
            ...this.dataSource.searchParams.filter,
            executedAtFrom: value?.dateFrom ?? undefined,
            executedAtTo: value?.dateTo ?? undefined,
        })
    }

    private initDataSource(): void {
        // init from URL
        const searchParamsFromUrl = EventsListUrlState.extractSearchParams(this.activatedRoute.snapshot.queryParams)
        if (searchParamsFromUrl !== null) {
            this.dataSource.updateSearchParams(searchParamsFromUrl, false)
        }

        //
        // [ACTION] :: SEARCH PARAMS CHANGED
        //      => update URL
        //
        this.dataSource.searchParams$
            .pipe(
                distinctUntilChanged((a, b) => _.isEqual(a, b)),
                skip(1),
            )
            .subscribe(searchParams => {
                const queryParams = EventsListUrlState.applySearchParams(
                    this.activatedRoute.snapshot.queryParams,
                    searchParams,
                )
                this.updateRouterState(queryParams)
            })

        //
        // [ACTION] :: URL QUERY PARAMS CHANGED
        //      => update DataSource state
        //
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroyed$),
                // extract pagerState
                map(() => EventsListUrlState.extractSearchParams(this.activatedRoute.snapshot.queryParams)),
                filter((newSearchParams) => !_.isEqual(newSearchParams, this.dataSource.searchParams)),
            )
            .subscribe((newSearchParams) => {
                this.dataSource.updateSearchParams(
                    newSearchParams ?? this.dataSource.defaultSearchParams,
                )
            })
    }

    private initTableSortingState(): void {
        // setup default value
        this.setTableSorting(this.dataSource.searchParams.sortBy)
        //
        // [ACTION] :: UI TABLE SORTING CHANGED
        //      => update DataSource Search Params
        //
        this.sortControl.sortChange
            .pipe(
                takeUntil(this.destroyed$),
                map(sort => {
                    return sort.direction.length === 0
                        ? []
                        : [
                            SearchQuery.matSortToFiledSorter(sort),
                        ]
                }),
                filter(sortBy => !_.isEqual(sortBy, this.dataSource.searchParams.sortBy)),
            )
            .subscribe((sortBy: QuerySorter.FieldSorter<ExecutionEventField>[]) => {
                this.dataSource.sort(sortBy)
            })

        //
        // [ACTION] :: DATA SOURCE SORTING CHANGED
        //      => update UI Table sort state
        //
        this.dataSource.searchParams$
            .pipe(
                map(searchParams => searchParams.sortBy),
                filter(sortBy => {
                    const sort = {
                        active: this.sortControl.active,
                        direction: this.sortControl.direction,
                    }
                    const currentSortBy = [SearchQuery.matSortToFiledSorter(sort)]
                    return !_.isEqual(sortBy, currentSortBy)
                }),
            )
            .subscribe(
                sortBy => this.setTableSorting(sortBy),
            )
    }

    private updateRouterState(queryParams, replaceUrl: boolean = true): void {
        RouterHelpers.updateCurrentRouterQueryParams(
            this.router,
            this.activatedRoute,
            queryParams,
            replaceUrl,
        )
    }

    private setTableSorting(sortBy: QuerySorter.FieldSorter[]): void {
        const initSorting = SearchQuery.toMatSortable(sortBy[0])
        this.sortControl.sort(initSorting)
    }
}
