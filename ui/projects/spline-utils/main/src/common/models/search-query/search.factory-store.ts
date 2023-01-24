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

import { DataSource } from '@angular/cdk/collections'
import { isEqual } from 'lodash-es'
import { BehaviorSubject, EMPTY, interval, isObservable, Observable, of, Subject } from 'rxjs'
import { catchError, filter, first, map, share, skip, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators'

import { ProcessingStoreNs } from '../../../store'
import { whenPageVisible } from '../../rxjs-operators'
import { SplineRecord, TypeHelpers } from '../heplers'
import { PageResponse, QuerySorter } from '../query'

import { SearchQuery } from './search-query.models'
import DataState = SearchQuery.DataState
import DEFAULT_RENDER_DATA = SearchQuery.DEFAULT_RENDER_DATA
import DEFAULT_SEARCH_PARAMS = SearchQuery.DEFAULT_SEARCH_PARAMS
import SearchParams = SearchQuery.SearchParams
import isFunction = TypeHelpers.isFunction


export type SearchDataSourceConfig<TFilter extends SplineRecord, TSortableFields> = {
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    defaultSearchParams: Partial<SearchParams<TFilter, TSortableFields>>,
    pollingInterval: number
}

export type SearchDataSourceConfigInput<TFilter extends SplineRecord, TSortableFields> =
    | SearchDataSourceConfig<TFilter, TSortableFields>
    | (() => SearchDataSourceConfig<TFilter, TSortableFields>)
    | Observable<SearchDataSourceConfig<TFilter, TSortableFields>>
    | Observable<() => SearchDataSourceConfig<TFilter, TSortableFields>>

export abstract class SearchFactoryStore<TDataRecord = unknown,
    TData extends PageResponse<TDataRecord> = PageResponse<TDataRecord>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    TFilter extends SplineRecord = {},
    TSortableFields = string> implements DataSource<TDataRecord> {

    readonly dataState$: BehaviorSubject<DataState<TData>> = new BehaviorSubject(DEFAULT_RENDER_DATA)
    readonly searchParams$: BehaviorSubject<SearchParams<TFilter, TSortableFields>> = new BehaviorSubject(undefined)
    readonly disconnected$ = new Subject<void>()

    readonly serverDataUpdates$: Observable<TData>
    readonly loadingProcessing$: Observable<ProcessingStoreNs.EventProcessingState>
    readonly loadingProcessingEvents: ProcessingStoreNs.ProcessingEvents<DataState<TData>>

    private defaultSearchParamsProvider: () => SearchParams<TFilter, TSortableFields>

    protected constructor(configInput: SearchDataSourceConfigInput<TFilter, TSortableFields>) {
        const configLike$ = isObservable(configInput) ? configInput : of(configInput)
        const configProvider$ = configLike$
            .pipe(
                first(),
                map(configFnOrObj => {
                    return isFunction(configFnOrObj) ? configFnOrObj : (() => configFnOrObj)
                }),
                share(),
                takeUntil(this.disconnected$)
            )

        this.asyncInitDefaultSearchParams(configProvider$)

        this.dataState$ = new BehaviorSubject(DEFAULT_RENDER_DATA)

        this.loadingProcessing$ = this.dataState$.pipe(map(data => data.loadingProcessing), takeUntil(this.disconnected$))
        this.loadingProcessingEvents = ProcessingStoreNs.createProcessingEvents(
            this.dataState$, (state) => state.loadingProcessing
        )

        this.serverDataUpdates$ =
            configProvider$.pipe(
                switchMap(configProvider => this.createServerDataUpdatePoller(configProvider().pollingInterval)),
                takeUntil(this.disconnected$)
            )

        this.subscribeToSearchParams()
    }

    reset(): void {
        this.updateSearchParams(this.defaultSearchParamsProvider())
    }

    search(searchTerm: string): void {
        const searchParamsWithResetPagination = this.withResetPagination({ searchTerm })
        this.updateSearchParams(searchParamsWithResetPagination)
    }

    sort(sortBy: QuerySorter.FieldSorter<TSortableFields>[]): void {
        this.updateSearchParams(this.withResetPagination({ sortBy }))
    }

    setFilter(filterValue: TFilter): void {
        if ('searchTerm' in filterValue) {
            const searchParams = this.withResetPagination({ filter: filterValue, searchTerm: filterValue.searchTerm })
            this.updateSearchParams(searchParams)
            return
        }
        const searchParams = this.withResetPagination({ filter: filterValue })
        this.updateSearchParams(searchParams)
    }

    goToPage(pageIndex: number): void {
        const currentPager = this.searchParams$.getValue().pager
        if (currentPager.offset !== pageIndex) {
            this.updateSearchParams({
                pager: {
                    ...currentPager,
                    offset: pageIndex * currentPager.limit
                }
            })
        }
        else {
            console.warn('Nothing to do. The current offset equals to the target offset.')
        }
    }

    update(searchParams: Partial<SearchParams<TFilter, TSortableFields>>): void {
        this.updateSearchParams(searchParams)
    }

    connect(): Observable<TDataRecord[]> {
        return this.dataState$
            .pipe(
                map(x => x.data?.items ?? []),
                takeUntil(this.disconnected$)
            )
    }

    disconnect(): void {
        this.disconnected$.next()
        this.disconnected$.complete()
    }

    protected abstract getDataObserver(searchParams: SearchParams<TFilter, TSortableFields>): Observable<TData>

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private asyncInitDefaultSearchParams(configProvider$: Observable<() => SearchDataSourceConfig<TFilter, TSortableFields>>): void {
        configProvider$
            .subscribe(configProvider => {
                this.defaultSearchParamsProvider = () => {
                    const config = configProvider()
                    return {
                        ...DEFAULT_SEARCH_PARAMS,
                        ...config.defaultSearchParams
                    }
                }
                this.searchParams$.next(this.defaultSearchParamsProvider())
            })
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private subscribeToSearchParams(): void {
        this.searchParams$
            .pipe(
                skip(1), // skip default search params
                withLatestFrom(this.dataState$),
                tap(([, dataState]) => this.updateDataState({
                    loadingProcessing: ProcessingStoreNs.eventProcessingStart(
                        dataState.loadingProcessing)
                })),
                switchMap(([searchParams, dataState]) => this.getDataObserver(searchParams)
                    .pipe(
                        catchError((error) => {
                            this.updateDataState({
                                loadingProcessing: ProcessingStoreNs.eventProcessingFinish(
                                    dataState.loadingProcessing, error)
                            })
                            return of(null)
                        })
                    )
                ),
                withLatestFrom(this.dataState$),
                takeUntil(this.disconnected$)
            )
            .subscribe(([result, dataState]) => {
                if (result !== null) {
                    this.updateDataState({
                        data: { ...result },
                        loadingProcessing: ProcessingStoreNs.eventProcessingFinish(dataState.loadingProcessing)
                    })
                }
            })
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private updateDataState(dataState: Partial<DataState<TData>>): void {
        this.dataState$.next({
            ...this.dataState$.getValue(),
            ...dataState
        })
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private withResetPagination(
        searchParams: Partial<SearchParams<TFilter, TSortableFields>>
    ): Partial<SearchParams<TFilter, TSortableFields>> {
        return {
            ...searchParams,
            pager: {
                limit: this.searchParams$.getValue().pager.limit,
                offset: 0
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private updateSearchParams(searchParams: Partial<SearchParams<TFilter, TSortableFields>>): void {
        const currentSearchParams = { ...this.searchParams$.getValue() }
        delete currentSearchParams.searchTerm
        delete currentSearchParams.filter
        const newSearchParams = {
            ...currentSearchParams,
            ...searchParams
        } as SearchParams<TFilter, TSortableFields>
        this.searchParams$.next(newSearchParams)
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private createServerDataUpdatePoller(pollingInterval: number): Observable<TData> {
        // Poll the server using the same search query as the main one, but with `asAtTime = now()`.
        // If the returned data differs from what the data source currently holds then an update notification
        // is sent to the observers.

        // The observable is multicast with active subscription counting.
        // The polling stops when `count == 0` and it resumes when `count > 0`

        return interval(pollingInterval)
            .pipe(
                whenPageVisible(),
                withLatestFrom(this.searchParams$),
                switchMap(([, lastSearchParams]) => {
                    const freshSearchParams = {
                        ...lastSearchParams,
                        filter: {
                            ...lastSearchParams.filter,
                            asAtTime: undefined
                        }
                    }
                    return this.getDataObserver(freshSearchParams)
                        .pipe(
                            first(),
                            catchError(() => EMPTY),
                            takeUntil(this.disconnected$)
                        )
                }),
                share(),
                withLatestFrom(this.dataState$),
                filter(([serverData, lastDataState]) => !isEqual(serverData.items, lastDataState.data.items)),
                map(([serverData]) => serverData),
                takeUntil(this.disconnected$)
            )
    }
}
