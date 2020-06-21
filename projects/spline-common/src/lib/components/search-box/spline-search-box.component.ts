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

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, skip, takeUntil } from 'rxjs/operators'

import { BaseComponent } from '../../common'


@Component({
    selector: 'spline-search-box',
    templateUrl: './spline-search-box.component.html',
})
export class SplineSearchComponent extends BaseComponent {

    @Input() placeholder = 'Search'

    @Output() search$ = new EventEmitter<string>()

    isFocused = false

    protected searchValue$ = new Subject<string>()

    constructor() {
        super()

        const debounceTimeInUs = 200
        this.searchValue$
            .pipe(
                takeUntil(this.destroyed$),
                // skip default value
                skip(1),
                map(val => val.trim().toLowerCase()),
                // wait 200 us between keyUp events
                debounceTime(debounceTimeInUs),
                // emit only different value form the previous one
                distinctUntilChanged(),
            )
            .subscribe(
                value => this.search$.next(value),
            )
    }

    onSearchChanged(searchTerm: string): void {
        this.searchValue$.next(searchTerm)
    }
}
