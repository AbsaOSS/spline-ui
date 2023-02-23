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

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { LabelApiService } from 'spline-api'
import { DtCellCustomEvent, DtHeaderCellCustomEvent, DynamicTableDataMap } from 'spline-common/dynamic-table'
import { BaseLocalStateComponent, QuerySorter, RouterNavigation, SearchFactoryStore, SplineRecord } from 'spline-utils'
import { SplineSearchDynamicTableStoreNs } from './spline-search-dynamic-table-store.ns'
import { distinctUntilChanged, first, map, Observable, repeatWhen, skip, startWith, Subject, takeUntil } from 'rxjs'
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'
import { filter } from 'rxjs/operators'
import { isEqual } from 'lodash-es'


export interface SplineGenericToken {
    tokenIndex: number
    type: string
    startIndex: number
    endIndex: number
    rawTokenString?: string
}

export interface SplineSearchToken extends SplineGenericToken {
    searchToken: string
}

export interface SplineFilterToken extends SplineGenericToken {
    startValueIndex?: number
    keyFragment?: string
    valueFragment?: string
    rawFilterValue?: string
    isFilterCompleted: boolean
    isDoubleQuotesStartChar: boolean
}

export interface SplineMatchedTokens {
    matchedTokens: SplineSearchToken | SplineFilterToken[]
    filterTokens: SplineFilterToken[]
    searchTokens: SplineSearchToken[]
    lastToken: SplineFilterToken
    searchInput: string

}

interface DynamicTableOptions {
    isSticky?: boolean // stick to container
}

@Component({
    selector: 'spline-search-dynamic-table',
    templateUrl: './spline-search-dynamic-table.component.html'
})
// eslint-disable-next-line @typescript-eslint/ban-types
export class SplineSearchDynamicTableComponent<TRowData = undefined, TFilter extends SplineRecord = {}, TSortableFields = string>
    extends BaseLocalStateComponent<SplineSearchDynamicTableStoreNs.State> implements OnInit, OnDestroy, OnChanges {

    readonly defaultUrlStateQueryParamAlias = 'searchTable'

    @Input() dataMap: DynamicTableDataMap
    @Input() dataSource: SearchFactoryStore<TRowData>

    @Input() options: Readonly<DynamicTableOptions> = {
        isSticky: false
    }

    @Input() urlStateQueryParamAlias = this.defaultUrlStateQueryParamAlias
    @Input() isUrlStateDisabled = false
    @Input() showPaginator = true

    @Output() cellEvent$ = new EventEmitter<DtCellCustomEvent<TRowData>>()
    @Output() headerCellEvent$ = new EventEmitter<DtHeaderCellCustomEvent>()
    @Output() secondaryHeaderCellEvent$ = new EventEmitter<DtHeaderCellCustomEvent>()

    private readonly _resumeListeningOnServerUpdates$ = new Subject<void>()
    private _dataUpdateAvailable$: Observable<unknown | boolean>

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                readonly labelApiService: LabelApiService
    ) {
        super()
        this.updateState(
            SplineSearchDynamicTableStoreNs.getDefaultState()
        )
    }

    get currentQueryParams(): Params {
        return this.activatedRoute.snapshot.queryParams
    }

    get isDataUpdateAvailable$(): Observable<unknown | boolean> {
        return this._dataUpdateAvailable$
    }

    ngOnInit(): void {
        this.subscribeToRouter(this.router)
        this.subscribeToDataSource(this.dataSource)

        // start listening on the server data updates
        this.initDataUpdateAvailableObservable(this.dataSource)

        // init URL state Sync if it is allowed
        if (!this.isUrlStateDisabled) {
            this.initUrlStateSync(this.dataSource, this.urlStateQueryParamAlias)
        }

        // load data
        this.dataSource.update(this.searchParamsFromUrl() ?? {})
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { urlStateDisabled: isUrlStateDisabled } = changes

        if (isUrlStateDisabled
            && !isUrlStateDisabled.isFirstChange()
            && isUrlStateDisabled.previousValue !== isUrlStateDisabled.currentValue) {

            console.warn('[SplineSearchDynamicTable] :: isUrlStateDisabled changes are not considered once table was initialized.')
        }
    }

    onCellEvent($event: DtCellCustomEvent<TRowData>): void {
        this.cellEvent$.emit($event)
    }

    onHeaderCellEvent($event: DtHeaderCellCustomEvent): void {
        this.headerCellEvent$.emit($event)
    }

    onSecondaryHeaderCellEvent($event: DtHeaderCellCustomEvent): void {
        this.secondaryHeaderCellEvent$.emit($event)
    }

    onPaginationChanged(pageEvent: PageEvent): void {
        this.dataSource.goToPage(pageEvent.pageIndex)
    }

    onSearch({ searchTokens, filterTokens }: Partial<SplineMatchedTokens>): void {
        const searchTerm = this.isolationSearchTerm(searchTokens)
        const label = this.isolationLabelsFromFilters(filterTokens)
        const searchDataFilter = Object.assign(
            {},
            searchTerm.length && { searchTerm },
            label.length && { label }
        )
        if (!label.length && !searchTerm.length) {
            return this.dataSource.reset()
        }
        this.dataSource.setFilter(searchDataFilter)
    }

    isolationSearchTerm(searchTokens: SplineSearchToken[]): string {
        return searchTokens.reduce((result: string, item: SplineSearchToken, index) =>
            result + `${ index ? ' ' : '' }${ item.searchToken }`
        , '')
    }

    isolationLabelsFromFilters(filterTokens: SplineFilterToken[]): string[] {
        const result = []
        const filterDictionary = new Map()
        for (const filterToken of filterTokens) {
            if (!filterToken.keyFragment) {
                continue
            }
            if (!filterDictionary.has(filterToken.keyFragment)) {
                filterDictionary.set(filterToken.keyFragment, new Set())
            }
            filterDictionary.get(filterToken.keyFragment).add(filterToken.valueFragment)
        }

        for (const [filterKey, filterValues] of filterDictionary.entries()) {
            const _filterValues = []
            for (const filterValue of filterValues.values()) {
                _filterValues.push(filterValue)
            }
            result.push(`${ filterKey as string }:${ _filterValues.join() }`)
        }
        return result
    }

    onRefreshDataClick(): void {
        this.dataSource.setFilter({ asAtTime: Date.now() })
        this._resumeListeningOnServerUpdates$.next()
    }

    ngOnDestroy(): void {
        this._resumeListeningOnServerUpdates$.complete()
        super.ngOnDestroy()
    }

    onSortingChanged(sorter: QuerySorter.FieldSorter): void {
        this.dataSource.sort([sorter])
    }

    private searchParamsFromUrl() {
        return !this.isUrlStateDisabled
            ? SplineSearchDynamicTableStoreNs.extractSearchParamsFromUrl(
                this.currentQueryParams,
                this.urlStateQueryParamAlias
            )
            : null
    }

    private subscribeToRouter(router: Router): void {
        // Refresh the table on re-navigating to the same route
        router.events.pipe(
            filter((event: RouterEvent) => event instanceof NavigationEnd),
            takeUntil(this.destroyed$)
        ).subscribe(() => {
            if (this.searchParamsFromUrl() === null) {
                this.dataSource.reset()
                this._resumeListeningOnServerUpdates$.next()
            }
        })
    }

    private subscribeToDataSource(dataSource: SearchFactoryStore<TRowData>): void {
        // totalCount
        dataSource.dataState$
            .pipe(
                map(dataState => dataState.data?.totalCount ?? 0),
                distinctUntilChanged(),
                takeUntil(this.destroyed$)
            )
            .subscribe(
                totalCount => this.updateState({
                    totalCount
                })
            )

        // loadingProcessing
        dataSource.loadingProcessing$
            .pipe(
                skip(1),
                distinctUntilChanged((left, right) => isEqual(left, right)),
                takeUntil(this.destroyed$)
            )
            .subscribe(
                loading => this.updateState({
                    loadingProcessing: loading
                })
            )

        // searchParams
        dataSource.searchParams$
            .pipe(
                skip(1),
                distinctUntilChanged((left, right) => isEqual(left, right)),
                takeUntil(this.destroyed$)
            )
            .subscribe(searchParams => {
                const sorting = searchParams.sortBy.length > 0
                    ? searchParams.sortBy[0]
                    : null

                this.updateState({
                    sorting: sorting,
                    searchParams: { ...searchParams }
                })
            })
    }

    private initDataUpdateAvailableObservable(dataSource: SearchFactoryStore<TRowData>): void {
        this._dataUpdateAvailable$ = dataSource.serverDataUpdates$
            .pipe(
                map(() => true),
                first(),
                startWith(false),
                repeatWhen(() => this._resumeListeningOnServerUpdates$),
                takeUntil(this.destroyed$)
            )
    }

    private initUrlStateSync(dataSource: SearchFactoryStore<TRowData>, queryParamAlias: string): void {
        //
        // [ACTION] :: SEARCH PARAMS CHANGED
        //      => update URL
        //
        dataSource.searchParams$
            .pipe(
                distinctUntilChanged((a, b) => isEqual(a, b)),
                skip(1),
                takeUntil(this.destroyed$)
            )
            .subscribe((searchParams) => {
                const queryParams = SplineSearchDynamicTableStoreNs.applySearchParams(
                    this.currentQueryParams,
                    queryParamAlias,
                    searchParams
                )
                this.updateRouterState(queryParams)
            })
    }

    private updateRouterState(queryParams, replaceUrl: boolean = true): void {
        RouterNavigation.updateCurrentRouterQueryParams(
            this.router,
            this.activatedRoute,
            queryParams,
            replaceUrl
        )
    }

}
