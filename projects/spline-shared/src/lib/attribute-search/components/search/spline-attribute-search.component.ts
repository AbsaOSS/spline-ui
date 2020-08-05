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

import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatAutocompleteActivatedEvent, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { BehaviorSubject, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AttributeFacade, AttributeSearchRecord } from 'spline-api'


@Component({
    selector: 'spline-attribute-search',
    templateUrl: './spline-attribute-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplineAttributeSearchComponent {

    searchTerm$ = new BehaviorSubject<string>(null)
    attributesList$ = new BehaviorSubject<AttributeSearchRecord[]>([])
    loading = false
    searchTerm: string

    constructor(private readonly attributeFacade: AttributeFacade) {
    }

    displayWitFn = (item: AttributeSearchRecord) => item?.id ? item.id : ''

    onAutocompleteOpenSelected($event: MatAutocompleteSelectedEvent): void {
        console.log($event)
        // TODO: redirect
        this.searchTerm = ''
    }

    onSearch($event: string): void {
        if ($event?.length) {
            this.loading = true
            this.attributeFacade.search($event)
                .pipe(
                    catchError(error => {
                        // show ERROR MESSAGE
                        return of([])
                    }),
                )
                .subscribe(
                    result => {
                        this.loading = false
                        this.attributesList$.next(result)
                    },
                )
        }
        else {
            this.attributesList$.next([])
        }
    }

    onOptionActivated($event: MatAutocompleteActivatedEvent) {
        console.log($event)
    }

}
