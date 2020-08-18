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
import { MatSort, MatSortable } from '@angular/material/sort'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import _ from 'lodash'
import { Observable } from 'rxjs'
import { distinctUntilChanged, filter, map, skip, takeUntil } from 'rxjs/operators'
import { ExecutionEventFacade, ExecutionEventField, ExecutionEventsPageResponse, QuerySorter } from 'spline-api'
import { BaseComponent, ProcessingStore, RouterHelpers } from 'spline-utils'

import { SplineDateFilter } from '../../components'
import { ExecutionEventsDataSource } from '../../data-sources'
import { EventsListUrlState } from '../../models'
import SortDir = QuerySorter.SortDir


@Component({
    selector: 'events-list-page',
    templateUrl: './events-list.page.component.html',
    styleUrls: ['./events-list.page.component.scss'],
    providers: [
        {
            provide: ExecutionEventsDataSource,
            useFactory: (executionEventFacade: ExecutionEventFacade) => {
                return new ExecutionEventsDataSource(executionEventFacade)
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

    readonly initSorting: MatSortable = {
        id: ExecutionEventField.timestamp,
        start: 'desc',
        disableClear: false,
    }

    readonly ExecutionEventField = ExecutionEventField

    constructor(readonly dataSource: ExecutionEventsDataSource,
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
        // setup view layer
        this.sortControl.sort(this.initSorting)
        // watch sorting change
        this.sortControl.sortChange
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe((sort) => {
                const sortBy: QuerySorter.FieldSorter<ExecutionEventField>[] = sort.direction.length === 0
                    ? []
                    : [{
                        field: sort.active as ExecutionEventField,
                        dir: sort.direction === 'asc' ? SortDir.ASC : SortDir.DESC,
                    }]

                this.dataSource.sort(sortBy)
            })
    }

    ngOnDestroy(): void {
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
        // initial sorting
        this.dataSource.sort(
            [{
                field: this.initSorting.id as ExecutionEventField,
                dir: this.initSorting.start === 'asc' ? SortDir.ASC : SortDir.DESC,
            }],
            false,
        )

        // init pagination
        const pagerState = EventsListUrlState.extractPager(this.activatedRoute.snapshot.queryParams)
        if (pagerState !== null) {
            this.dataSource.updateSearchParams({
                pager: pagerState.pager,
            }, false)

            this.dataSource.initialRequestTime = pagerState.initialRequestTime
        }

        //
        // [ACTION] :: PAGINATION CHANGED
        //      => sync URL
        //
        this.dataSource.searchParams$
            .pipe(
                distinctUntilChanged((a, b) => _.isEqual(a, b)),
                skip(1),
            )
            .subscribe(searchParams => {
                const queryParams = EventsListUrlState.applyPager(
                    this.activatedRoute.snapshot.queryParams,
                    {
                        pager: searchParams.pager,
                        initialRequestTime: this.dataSource.initialRequestTime,
                    },
                )
                this.updateRouterState(queryParams)
            })

        // watch pager changes from URL
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroyed$),
                // extract pagerState
                map(() => EventsListUrlState.extractPager(this.activatedRoute.snapshot.queryParams)),
                filter((newPagerState) => {
                    const currentPagerState: EventsListUrlState.PagerState = {
                        pager: this.dataSource.searchParams.pager,
                        initialRequestTime: this.dataSource.initialRequestTime,
                    }
                    return !_.isEqual(newPagerState, currentPagerState)
                }),
            )
            .subscribe((newPagerState) => {
                this.dataSource.initialRequestTime = newPagerState?.initialRequestTime ?? null
                this.dataSource.updateSearchParams({
                    pager: newPagerState?.pager ?? this.dataSource.defaultSearchParams.pager,
                })
            })
    }

    private updateRouterState(queryParams, replaceUrl: boolean = true): void {
        RouterHelpers.updateCurrentRouterQueryParams(
            this.router,
            this.activatedRoute,
            queryParams,
            replaceUrl,
        )
    }
}
