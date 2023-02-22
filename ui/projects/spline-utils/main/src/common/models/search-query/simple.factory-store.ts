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

import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import { catchError, map, switchMap, take, takeUntil, tap } from 'rxjs/operators'

import { ProcessingStoreNs } from '../../../store'
import { SplineRecord } from '../heplers'

import { SearchQuery } from './search-query.models'
import DataState = SearchQuery.DataState
import DEFAULT_RENDER_DATA = SearchQuery.DEFAULT_RENDER_DATA

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class SimpleFactoryStore<TData, TFilter extends SplineRecord = {}> {

    readonly data$: Observable<TData>
    readonly dataState$: BehaviorSubject<DataState<TData>> = new BehaviorSubject<DataState<TData>>(DEFAULT_RENDER_DATA)
    readonly filterChanged$ = new Subject<{ filter: TFilter; apply: boolean; force: boolean }>()

    readonly loadingProcessing$: Observable<ProcessingStoreNs.EventProcessingState>
    readonly loadingProcessingEvents: ProcessingStoreNs.ProcessingEvents<DataState<TData>>

    protected readonly filter$ = new BehaviorSubject<TFilter>({} as TFilter)
    protected readonly disconnected$ = new Subject<void>()

    protected constructor() {

        this.data$ = this.dataState$.pipe(map(data => data.data), takeUntil(this.disconnected$))

        this.loadingProcessing$ = this.dataState$.pipe(map(data => data.loadingProcessing), takeUntil(this.disconnected$))
        this.loadingProcessingEvents = ProcessingStoreNs.createProcessingEvents(
            this.dataState$, (state) => state.loadingProcessing
        )

        this.init()
    }

    get data(): TData {
        return this.dataState$.getValue().data
    }

    get filter(): TFilter {
        return this.filter$.getValue()
    }

    get dataState(): DataState<TData> {
        return this.dataState$.getValue()
    }

    setFilter(filterValue: TFilter, apply: boolean = true, force: boolean = false): void {
        this.filterChanged$.next({ filter: filterValue, apply, force })
    }

    connect(): Observable<TData> {
        return this.dataState$.pipe(map(x => x.data), takeUntil(this.disconnected$))
    }

    disconnect(): void {
        this.filter$.complete()
        this.disconnected$.next()
        this.disconnected$.complete()
    }

    protected init(): void {
        // FILTER CHANGED EVENT
        this.filterChanged$
            .pipe(
                tap((payload) => this.filter$.next(payload.filter)),
                switchMap((payload) => this.fetchData(payload.filter)),
                takeUntil(this.disconnected$)
            )
            .subscribe()
    }

    protected updateDataState(dataState: Partial<DataState<TData>>): void {
        this.dataState$.next({
            ...this.dataState$.getValue(),
            ...dataState
        })
    }

    protected abstract getDataObserver(filterValue: TFilter): Observable<TData>;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private fetchData(filterValue: TFilter): Observable<TData> {

        this.updateDataState({
            loadingProcessing: ProcessingStoreNs.eventProcessingStart(this.dataState.loadingProcessing)
        })

        return this.getDataObserver(filterValue)
            .pipe(
                catchError((error) => {
                    this.updateDataState({
                        loadingProcessing: ProcessingStoreNs.eventProcessingFinish(
                            this.dataState.loadingProcessing, error)
                    })
                    return of(null)
                }),
                // update data state
                tap((result) => {
                    if (result !== null) {
                        this.updateDataState({
                            data: result,
                            loadingProcessing: ProcessingStoreNs.eventProcessingFinish(this.dataState.loadingProcessing)
                        })
                    }
                }),
                take(1)
            )
    }
}

