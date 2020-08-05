/*
 * Copyright (c) 2020 ABSA Group Limited
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

import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { AttributeFacade, AttributeSearchRecord } from 'spline-api'

import { AttributeSearchDataSource } from '../../data-source/attribute-search.data-source'


@Component({
    selector: 'spline-attribute-search',
    templateUrl: './spline-attribute-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: AttributeSearchDataSource,
            useFactory: (attributeFacade: AttributeFacade) => {
                return new AttributeSearchDataSource(attributeFacade)
            },
            deps: [AttributeFacade],
        },
    ],
})
export class SplineAttributeSearchComponent {

    @Output() attributeSelected$ = new EventEmitter<{ attributeInfo: AttributeSearchRecord }>()

    searchTerm: string

    noOptionsFound$: Observable<boolean>

    constructor(readonly dataSource: AttributeSearchDataSource) {
        this.noOptionsFound$ = this.dataSource.onFilterChanged$
            .pipe(
                switchMap(
                    ({ filter }) => this.dataSource.dataState$
                        .pipe(
                            map(dataState => ({
                                dataState,
                                filter,
                            })),
                        ),
                ),
                map(({ dataState, filter }) => (
                    !dataState.loadingProcessing.processing
                    && dataState.data?.length === 0
                    && filter?.search?.length > 0
                )),
            )

    }

    onAutocompleteOpenSelected($event: MatAutocompleteSelectedEvent): void {
        this.searchTerm = ''
        this.attributeSelected$.emit({
            attributeInfo: $event.option.value,
        })
    }

    onSearch(searchTerm: string): void {
        this.searchTerm = searchTerm
        this.dataSource.setFilter({
            search: searchTerm,
        })
    }

}
