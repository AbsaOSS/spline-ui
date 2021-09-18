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
import { BehaviorSubject, EMPTY, interval, Observable, of, Subject, Subscription } from 'rxjs'
import { catchError, filter, first, map, share, switchMap, take, tap } from 'rxjs/operators'

import { ProcessingStore } from '../../../store'
import { whenPageVisible } from '../../rxjs-operators'
import { SplineRecord } from '../heplers'
import { PageResponse, QuerySorter } from '../query'

import { SearchQuery } from './search-query.models'
import DataState = SearchQuery.DataState
import DEFAULT_RENDER_DATA = SearchQuery.DEFAULT_RENDER_DATA
import DEFAULT_SEARCH_PARAMS = SearchQuery.DEFAULT_SEARCH_PARAMS
import DEFAULT_SERVER_POLLING_INTERVAL = SearchQuery.DEFAULT_SERVER_POLL_INTERVAL
import SearchParams = SearchQuery.SearchParams


export abstract class SearchDataSource<TDataRecord = unknown,
    TData extends PageResponse<TDataRecord> = PageResponse<TDataRecord>,
    TFilter extends SplineRecord = {},
    TSortableFields = string> implements DataSource<TDataRecord> {

    readonly dataState$: Observable<DataState<TData>>
    readonly searchParams$: Observable<SearchParams<TFilter, TSortableFields>>
    readonly loadingProcessing$: Observable<ProcessingStore.EventProcessingState>
    readonly loadingProcessingEvents: ProcessingStore.ProcessingEvents<DataState<TData>>
    readonly serverDataUpdates$: Observable<TData>

    readonly disconnected$: Observable<void>

    private readonly _dataState$ = new BehaviorSubject<DataState<TData>>(DEFAULT_RENDER_DATA)
    private readonly _searchParams$ = new BehaviorSubject<SearchParams<TFilter, TSortableFields>>(DEFAULT_SEARCH_PARAMS)

    private _defaultSearchParams: SearchParams<TFilter, TSortableFields> = DEFAULT_SEARCH_PARAMS
    private readonly _disconnected$ = new Subject<void>()

    private _activeFetchSubscription: Subscription

    protected constructor() {

        this.searchParams$ = this._searchParams$
        this.dataState$ = this._dataState$
        this.disconnected$ = this._disconnected$

        this.loadingProcessing$ = this.dataState$.pipe(map(data => data.loadingProcessing))
        this.loadingProcessingEvents = ProcessingStore.createProcessingEvents(
            this.dataState$, (state) => state.loadingProcessing,
        )

        this.serverDataUpdates$ = this.createServerDataUpdatePoller()
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

    updateDefaultSearchParams(value: Partial<SearchParams<TFilter, TSortableFields>>): SearchParams<TFilter, TSortableFields> {
        this._defaultSearchParams = {
            ...this._defaultSearchParams,
            ...value,
        }
        return this.updateSearchParams(this._defaultSearchParams, false, false)
    }

    search(searchTerm: string): void {
        const searchParamsWithResetPagination = this.withResetPagination({ searchTerm })
        this.updateSearchParams(searchParamsWithResetPagination, true, false)
    }

    sort(sortBy: QuerySorter.FieldSorter<TSortableFields>[]): void {
        this.updateSearchParams({ sortBy }, true, false)
    }

    setFilter(filterValue: TFilter): void {
        const searchParams = {
            filter: filterValue,
            pager: {
                limit: this.searchParams.pager.limit,
                offset: 0,
            },
        }

        this.updateSearchParams(searchParams, true, false)
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

    resetSearchParams(): SearchParams<TFilter, TSortableFields> {
        return this.updateSearchParams({
            ...this.defaultSearchParams,
            staticFilter: this.searchParams.staticFilter,
        }, false, false)
    }

    goToPage(pageIndex: number): void {
        const currentPager = this.searchParams.pager
        if (currentPager.offset !== pageIndex) {
            this.updateSearchParams({
                pager: {
                    ...currentPager,
                    offset: pageIndex * currentPager.limit,
                },
            }, true, false)
        }
        else {
            console.warn('Nothing to do. The current offset equals to the target offset.')
        }
    }

    nextPage(): void {
        const currentPager = this.searchParams.pager
        this.updateSearchParams({
            pager: {
                ...currentPager,
                offset: currentPager.offset + currentPager.limit,
            },
        }, true, false)
    }

    prevPage(): void {
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
        }, true, false)
    }

    updateSearchParams(
        searchParams: Partial<SearchParams<TFilter, TSortableFields>>,
        // If apply === true then rendered data will be recalculated based on new searchParams value and the current entitiesList collection
        apply: boolean,
        forceApply: boolean): SearchParams<TFilter, TSortableFields> {

        const newSearchParams = {
            ...this.searchParams,
            ...searchParams,
        } as SearchParams<TFilter, TSortableFields>

        if (forceApply || !isEqual(newSearchParams, this.searchParams)) {
            this._searchParams$.next(newSearchParams)

            if (apply) {
                this.fetchData(newSearchParams, forceApply)
            }
        }

        return newSearchParams
    }

    connect(collectionViewer: CollectionViewer): Observable<TDataRecord[]> {
        return this._dataState$
            .pipe(
                map(x => x.data?.items ?? []),
            )
    }

    disconnect(collectionViewer?: CollectionViewer): void {
        this._dataState$.complete()
        this._searchParams$.complete()

        this._disconnected$.next()
        this._disconnected$.complete()
    }

    private withResetPagination(
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

    // DATA stuff

    protected abstract getDataObserver(searchParams: SearchParams<TFilter, TSortableFields>,
                                       force: boolean): Observable<TData>;

    private updateDataState(dataState: Partial<DataState<TData>>): void {
        this._dataState$.next({
            ...this._dataState$.getValue(),
            ...dataState,
        })
    }

    private fetchData(
        searchParams: SearchParams<TFilter, TSortableFields>,
        force: boolean): void {

        if (this._activeFetchSubscription) {
            this._activeFetchSubscription.unsubscribe()
        }

        this.updateDataState({
            loadingProcessing: ProcessingStore.eventProcessingStart(this.dataState.loadingProcessing),
        })

        this._activeFetchSubscription = this.getDataObserver(searchParams, force)
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
            .subscribe()
    }

    private createServerDataUpdatePoller(): Observable<TData> {
        // Poll the server using the same search query as the main one, but with `asAtTime = now()`.
        // If the returned data differs from what the data source currently holds then an update notification
        // is sent to the observers.

        // The observable is multicast with active subscription counting.
        // The polling stops when `count == 0` and it resumes when `count > 0`

        return interval(DEFAULT_SERVER_POLLING_INTERVAL)
            .pipe(
                whenPageVisible(),
                switchMap(() => {
                    const lastSearchParams = this._searchParams$.getValue()
                    const freshSearchParams = {
                        ...lastSearchParams,
                        filter: {
                            ...lastSearchParams.filter,
                            asAtTime: undefined
                        }
                    }
                    return this.getDataObserver(freshSearchParams, undefined)
                        .pipe(
                            first(),
                            catchError(() => EMPTY)
                        )
                }),
                share(),
                filter(serverData => !isEqual(serverData.items, this._dataState$.getValue().data.items))
            )
    }
}

