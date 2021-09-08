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

import { CollectionViewer, DataSource } from '@angular/cdk/collections'
import { isEqual } from 'lodash-es'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import { catchError, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators'

import { ProcessingStore } from '../../../store'
import { SplineRecord, StringHelpers } from '../heplers'
import { PageResponse, QuerySorter } from '../query'

import { SearchQuery } from './search-query.models'
import DataState = SearchQuery.DataState
import DEFAULT_RENDER_DATA = SearchQuery.DEFAULT_RENDER_DATA
import DEFAULT_SEARCH_PARAMS = SearchQuery.DEFAULT_SEARCH_PARAMS
import SearchParams = SearchQuery.SearchParams


export abstract class SearchDataSource<TDataRecord = unknown,
    TData extends PageResponse<TDataRecord> = PageResponse<TDataRecord>,
    TFilter extends SplineRecord = {},
    TSortableFields = string> implements DataSource<TDataRecord> {

    readonly dataState$: Observable<DataState<TData>>
    readonly searchParams$: Observable<SearchParams<TFilter, TSortableFields>>
    readonly loadingProcessing$: Observable<ProcessingStore.EventProcessingState>
    readonly loadingProcessingEvents: ProcessingStore.ProcessingEvents<DataState<TData>>

    readonly onFilterChanged$ = new Subject<{ filter: TFilter; apply: boolean; force: boolean }>()
    readonly onSearch$ = new Subject<{ searchTerm: string; apply: boolean; force: boolean }>()
    readonly onSort$ = new Subject<{ sortBy: QuerySorter.FieldSorter<TSortableFields>[]; apply: boolean; force: boolean }>()

    readonly disconnected$: Observable<void>

    protected readonly entitiesList$ = new BehaviorSubject<TData[]>([])
    protected readonly _dataState$ = new BehaviorSubject<DataState<TData>>(DEFAULT_RENDER_DATA)
    protected readonly _searchParams$ = new BehaviorSubject<SearchParams<TFilter, TSortableFields>>(DEFAULT_SEARCH_PARAMS)

    // Request to update params with apply flag.
    // If apply === true then rendered data will be recalculated based on new searchParams value and the current entitiesList collection.
    protected readonly updateSearchParams$ =
        new Subject<{ searchParams: SearchParams<TFilter, TSortableFields>; apply: boolean; forceApply: boolean }>()

    protected _defaultSearchParams: SearchParams<TFilter, TSortableFields> = DEFAULT_SEARCH_PARAMS
    protected readonly _disconnected$ = new Subject<void>()


    constructor() {

        this.searchParams$ = this._searchParams$
        this.dataState$ = this._dataState$
        this.disconnected$ = this._disconnected$

        this.loadingProcessing$ = this.dataState$.pipe(map(data => data.loadingProcessing))
        this.loadingProcessingEvents = ProcessingStore.createProcessingEvents(
            this.dataState$, (state) => state.loadingProcessing,
        )

        this.init()
    }

    get searchParams(): SearchParams<TFilter, TSortableFields> {
        return this._searchParams$.getValue()
    }

    get defaultSearchParams(): SearchParams<TFilter, TSortableFields> {
        return this._defaultSearchParams
    }

    get data(): TData {
        return this._dataState$.getValue().data
    }

    get dataState(): DataState<TData> {
        return this._dataState$.getValue()
    }

    updateDefaultSearchParams(value: Partial<SearchParams<TFilter, TSortableFields>>): void {
        this._defaultSearchParams = {
            ...this._defaultSearchParams,
            ...value,
        }
    }

    updateAndApplyDefaultSearchParams(
        value: Partial<SearchParams<TFilter, TSortableFields>>,
        apply: boolean = false,
        forceApply: boolean = false): SearchParams<TFilter, TSortableFields> {

        this.updateDefaultSearchParams(value)
        return this.updateSearchParams(this.defaultSearchParams, apply, forceApply)
    }

    load(force: boolean = false): void {
        this.fetchData(this.searchParams, force).subscribe()
    }

    search(searchTerm: string, apply: boolean = true, force: boolean = false): void {
        this.onSearch$.next({ searchTerm, apply, force })
    }

    sort(sortBy: QuerySorter.FieldSorter<TSortableFields>[], apply: boolean = true, force: boolean = false): void {
        this.onSort$.next({ sortBy, apply, force })
    }

    setFilter(filterValue: TFilter, apply: boolean = true, force: boolean = false): void {
        this.onFilterChanged$.next({ filter: filterValue, apply, force })
    }

    refresh(): void {
        // reset pagination
        const newSearchParams = {
            pager: {
                offset: 0,
                limit: this.searchParams.pager.limit,
            },
        }

        this.updateSearchParams(newSearchParams, true, true)
    }

    resetSearchParams(fetchData: boolean = false, force: boolean = false): SearchParams<TFilter, TSortableFields> {
        return this.updateSearchParams({
            ...this.defaultSearchParams,
            staticFilter: this.searchParams.staticFilter,
        }, fetchData, force)
    }

    goToPage(pageIndex: number, apply: boolean = true): void {
        const currentPager = this.searchParams.pager
        if (currentPager.offset !== pageIndex) {
            this.updateSearchParams({
                pager: {
                    ...currentPager,
                    offset: pageIndex * currentPager.limit,
                },
            }, apply)
        }
        else {
            console.warn('Nothing to do. The current offset equals to the target offset.')
        }
    }

    nextPage(apply: boolean = true): void {
        const currentPager = this.searchParams.pager
        this.updateSearchParams({
            pager: {
                ...currentPager,
                offset: currentPager.offset + currentPager.limit,
            },
        }, apply)
    }

    prevPage(apply: boolean = true): void {
        const currentPager = this.searchParams.pager
        if (currentPager.offset === 0) {
            console.error('You are already on the very first page, you cannot go back.')
            return
        }
        this.updateSearchParams({
            pager: {
                ...currentPager,
                offset: currentPager.offset - currentPager.limit,
            },
        }, apply)
    }

    updateSearchParams(
        searchParams: Partial<SearchParams<TFilter, TSortableFields>>,
        apply: boolean = true,
        forceApply: boolean = false): SearchParams<TFilter, TSortableFields> {

        const newValue = {
            ...this.searchParams,
            ...searchParams,
        } as SearchParams<TFilter, TSortableFields>

        this.updateSearchParams$.next({
            searchParams: newValue,
            apply,
            forceApply,
        })

        return newValue
    }

    connect(collectionViewer: CollectionViewer): Observable<TDataRecord[]> {
        return this._dataState$
            .pipe(
                map(x => x.data?.items ?? []),
            )
    }

    disconnect(collectionViewer?: CollectionViewer): void {
        this.entitiesList$.complete()
        this._dataState$.complete()
        this._searchParams$.complete()

        this._disconnected$.next()
        this._disconnected$.complete()
    }

    searchParamsToUrlString(searchParams: SearchParams<TFilter, TSortableFields>): string {
        return StringHelpers.encodeObjToUrlString(searchParams)
    }

    searchParamsFromUrlString(searchParamsUrlString: string): SearchParams<TFilter, TSortableFields> {
        return StringHelpers.decodeObjFromUrlString(searchParamsUrlString)
    }

    protected init(): void {

        const updateSearchParams$ = this.updateSearchParams$
            .pipe(
                map(payload => {
                    const isNewSearchParams = !this.compareSearchParams(payload.searchParams, this.searchParams)
                    return {
                        ...payload,
                        isNewSearchParams,
                    }
                }),
            )

        // TODO: Do we really need that step?
        // Last emitted SearchParams are the same as previous
        //      => emit prev data
        updateSearchParams$
            .pipe(
                takeUntil(this._disconnected$),
                filter(({ isNewSearchParams }) => !isNewSearchParams),
            )
            .subscribe(() => {
                this._dataState$.next({
                    ...this.dataState,
                    data: { ...this.dataState.data },
                })
            })

        // Last emitted SearchParams differs from the previous
        //      => save new searchParams value
        //      => fetch new data
        updateSearchParams$
            .pipe(
                takeUntil(this._disconnected$),
                filter(({ isNewSearchParams, forceApply }) => isNewSearchParams || forceApply),
                tap(({ searchParams }) => this._searchParams$.next(searchParams)),
                filter(({ apply }) => apply),
                // using here switchMap to cancel the prev request
                switchMap(({ searchParams, forceApply }) => this.fetchData(searchParams, forceApply)),
            )
            .subscribe()

        // SORT EVENT
        this.onSort$
            .pipe(
                takeUntil(this._disconnected$),
            )
            .subscribe(
                ({ sortBy, apply, force }) => this.processOnSortEvent(sortBy, apply, force),
            )

        // SEARCH EVENT
        this.onSearch$
            .pipe(
                takeUntil(this._disconnected$),
            )
            .subscribe(
                ({ searchTerm, apply, force }) => this.processOnSearchEvent(searchTerm, apply, force),
            )

        // FILTER CHANGED EVENT
        this.onFilterChanged$
            .pipe(
                takeUntil(this._disconnected$),
            )
            .subscribe(
                (payload) => this.processOnFilterChangedEvent(payload.filter, payload.apply, payload.force),
            )
    }

    // Returns TRUE if search$ params are the same.
    protected compareSearchParams(
        searchParams: SearchParams<TFilter, TSortableFields>,
        newSearchParams: SearchParams<TFilter, TSortableFields>): boolean {

        return isEqual(searchParams, newSearchParams)
    }

    protected processOnSearchEvent(searchTerm: string, apply: boolean = true, force: boolean = false): void {
        let searchParams: Partial<SearchParams<TFilter, TSortableFields>> = { searchTerm }

        // reset pagination on real search$
        if (apply) {
            searchParams = this.resetPagination(searchParams)
        }

        this.updateSearchParams(searchParams, apply, force)
    }

    protected processOnSortEvent(
        sortBy: QuerySorter.FieldSorter<TSortableFields>[],
        apply: boolean = true, force: boolean = false): void {

        this.updateSearchParams({ sortBy }, apply, force)
    }

    protected processOnFilterChangedEvent(filterValue: TFilter, apply: boolean = true, force: boolean = false): void {
        let searchParams: Partial<SearchParams<TFilter, TSortableFields>> = { filter: filterValue }

        // reset pagination on real search$
        if (apply) {
            searchParams = {
                ...searchParams,
                pager: {
                    limit: this.searchParams.pager.limit,
                    offset: 0,
                },
            }
        }

        this.updateSearchParams(searchParams, apply, force)
    }

    protected fetchData(
        searchParams: SearchParams<TFilter, TSortableFields>,
        force: boolean = false): Observable<PageResponse<TData>> {

        this.updateDataState({
            loadingProcessing: ProcessingStore.eventProcessingStart(this.dataState.loadingProcessing),
        })

        return this.getDataObserver(searchParams, force)
            .pipe(
                catchError((error) => {
                    this.updateDataState({
                        loadingProcessing: ProcessingStore.eventProcessingFinish(this.dataState.loadingProcessing, error),
                    })
                    return of(null)
                }),
                // update data state
                tap((result) => {
                    if (result !== null) {
                        this.updateDataState({
                            data: { ...result },
                            loadingProcessing: ProcessingStore.eventProcessingFinish(this.dataState.loadingProcessing),
                        })
                    }
                }),
                take(1),
            )
    }

    protected updateDataState(dataState: Partial<DataState<TData>>): void {
        this._dataState$.next({
            ...this._dataState$.getValue(),
            ...dataState,
        })
    }

    protected resetPagination(
        searchParams: Partial<SearchParams<TFilter, TSortableFields>>,
    ): Partial<SearchParams<TFilter, TSortableFields>> {
        return {
            ...searchParams,
            pager: {
                limit: this.searchParams.pager.limit,
                offset: 0,
            },
        }
    }

    protected abstract getDataObserver(searchParams: SearchParams<TFilter, TSortableFields>,
                                       force: boolean): Observable<TData>;
}

