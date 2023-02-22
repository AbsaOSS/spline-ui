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

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatAutocomplete } from '@angular/material/autocomplete'
import { distinctUntilChanged } from 'rxjs'
import { debounceTime, takeUntil } from 'rxjs/operators'
import { BaseComponent } from 'spline-utils'


@Component({
    selector: 'spline-search-box',
    templateUrl: './spline-search-box.component.html'
})
export class SplineSearchBoxComponent extends BaseComponent {
    @Input() placeholder = 'COMMON.SEARCH'
    @Input() matAutocomplete: MatAutocomplete
    @Output() search$ = new EventEmitter<string>()
    isFocused = false

    searchControl = new FormControl()
    formGroup = new FormGroup({
        searchControl: this.searchControl
    })
    readonly emitSearchEventDebounceTimeInUs = 300

    constructor() {
        super()

        this.searchControl.valueChanges
            .pipe(
                // wait some time between keyUp events
                debounceTime(this.emitSearchEventDebounceTimeInUs),
                // emit only different value form the previous one
                distinctUntilChanged((a, b) => a?.trim().toLocaleLowerCase() === b?.trim().toLocaleLowerCase()),
                takeUntil(this.destroyed$)
            )
            .subscribe(value => {
                this.search$.emit(value)
            })
    }

    @Input() set searchTerm(value: string) {
        this.formGroup.controls['searchControl'].setValue(value)
    }

    onClearBtnClicked(): void {
        this.searchControl.reset()
    }

    clearFocus(): void {
        this.isFocused = false
    }
}
