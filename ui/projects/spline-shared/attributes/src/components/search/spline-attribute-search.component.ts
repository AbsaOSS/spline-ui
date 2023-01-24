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

import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { map, switchMap, takeUntil } from 'rxjs/operators'
import { AttributeApiService, AttributeSearchRecord } from 'spline-api'
import { SplineSearchBoxComponent } from 'spline-common'

import { AttributeSearchFactoryStore } from '../../data-sources'


@Component({
    selector: 'spline-attribute-search',
    templateUrl: './spline-attribute-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: AttributeSearchFactoryStore,
            useFactory: (attributeApiService: AttributeApiService) => {
                return new AttributeSearchFactoryStore(attributeApiService)
            },
            deps: [AttributeApiService]
        }
    ]
})
export class SplineAttributeSearchComponent implements OnDestroy {

    @ViewChild(SplineSearchBoxComponent) splineSearchBoxComponent: SplineSearchBoxComponent

    @Output() attributeSelected$ = new EventEmitter<{ attributeInfo: AttributeSearchRecord }>()

    readonly searchTerm$ = new BehaviorSubject<string>('')
    destroyed$ = new Subject<void>()
    noOptionsFound$: Observable<boolean>

    constructor(readonly dataSource: AttributeSearchFactoryStore) {
        this.noOptionsFound$ = this.dataSource.filterChanged$
            .pipe(
                switchMap(
                    ({ filter }) => this.dataSource.dataState$
                        .pipe(
                            map(dataState => ({
                                dataState,
                                filter
                            }))
                        )
                ),
                map(({ dataState, filter }) => (
                    !dataState.loadingProcessing.processing
                    && dataState.data?.length === 0
                    && filter?.search?.length > 0
                )),
                takeUntil(this.destroyed$)
            )
    }

    displayWitFn = (item: AttributeSearchRecord): string => item?.name ? item.name : ''

    onSearch(searchTerm: string): void {
        this.searchTerm$.next(searchTerm)
        this.dataSource.setFilter({
            search: searchTerm
        })
    }

    onAutocompleteOptionSelected($event: MatAutocompleteSelectedEvent): void {
        this.attributeSelected$.emit({
            attributeInfo: $event.option.value
        })
        this.searchTerm$.next('')
        this.splineSearchBoxComponent.clearFocus()
    }

    onAutocompleteOpened(): void {
        this.dataSource.setFilter({
            search: this.searchTerm$.getValue()
        })
    }

    ngOnDestroy(): void {
        this.destroyed$.next()
        this.destroyed$.complete()
        this.dataSource.disconnect()
    }
}
