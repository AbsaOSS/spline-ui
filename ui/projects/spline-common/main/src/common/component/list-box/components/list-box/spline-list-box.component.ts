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

import { SelectionModel } from '@angular/cdk/collections'
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Optional,
    Output,
    SimpleChanges
} from '@angular/core'
import { ControlValueAccessor, NgControl } from '@angular/forms'
import { MatSelectionListChange } from '@angular/material/list'
import { isEqual } from 'lodash-es'
import { BaseComponent } from 'spline-utils'

import { SplineListBox } from '../../models'


@Component({
    selector: 'spline-list-box',
    templateUrl: './spline-list-box.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplineListBoxComponent<TRecord = any, TValue = any> extends BaseComponent
    implements OnChanges, OnInit, ControlValueAccessor {

    @Input() records: TRecord[]

    @Input() searchTerm = ''

    @Output() searchTermChanged$ = new EventEmitter<string>()

    @Input() multiple = true

    @Input() dataMap: SplineListBox.DataMap<TRecord, TValue>
    @Input() selectionModel: SelectionModel<TValue>

    readonly defaultDataMap = SplineListBox.getDefaultDataMap()

    _value: TValue[]
    _selectionListOptions: SplineListBox.SelectListOption<TRecord, TValue>[] = []
    isDisabled = false

    constructor(
        @Optional() private readonly ngControl: NgControl,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super()

        if (this.ngControl) {
            this.ngControl.valueAccessor = this
        }
    }

    get value(): TValue[] {
        return this._value
    }

    set value(value: TValue[]) {
        if (isEqual(value, this._value)) {
            this._value = value
            this.onChange(value)
        }
    }

    trackByFn = (index: number, value: TRecord) => {
        const trackByFn = this.dataMap?.trackBy ?? this.defaultDataMap.trackBy
        return trackByFn(value)
    }

    compareFn = (a, b) => {
        return this.dataMap?.compareValueWith ?? this.defaultDataMap.compareValueWith
    }

    onChange = (value: TValue[]): void => {
    }

    onTouched = (): void => {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { records } = changes

        if (records && !records.isFirstChange()) {
            this.updateSelectListOptions(records.currentValue, this.dataMap, this.searchTerm)
        }
    }

    ngOnInit(): void {
        this.updateSelectListOptions(this.records, this.dataMap, this.searchTerm)
    }

    onNgModelChange($event: TValue[]): void {
        this.onChange($event)
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    writeValue(value: TValue[]): void {
        this._value = value
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    onSearchTermChanged(searchTerm: string): void {
        this.searchTerm = searchTerm
        this.searchTermChanged$.emit(searchTerm)

        this.updateSelectListOptions(this.records, this.dataMap, searchTerm)
    }

    onSelectionChanged($event: MatSelectionListChange): void {
        console.log($event)
    }

    private updateSelectListOptions(records: TRecord[], dataMap: SplineListBox.DataMap<TRecord, TValue>, searchTerm: string): void {
        this._selectionListOptions = this.calculateSelectOptions(records, dataMap, searchTerm)
    }

    private calculateSelectOptions(
        records: TRecord[],
        dataMap: SplineListBox.DataMap<TRecord, TValue>,
        searchTerm: string
    ): SplineListBox.SelectListOption<TRecord, TValue>[] {
        return records
            .map(
                item => SplineListBox.toListOption(item, dataMap)
            )
            .filter(item => item.label.toLowerCase().includes(searchTerm))
    }
}
