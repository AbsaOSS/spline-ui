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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import { DaterangepickerComponent } from 'ngx-daterangepicker-material'
import { BaseLocalStateComponent, SplineDateRangeValue } from 'spline-utils'
import { SplineDateRangeFilter } from './spline-date-range-filter.models'
import dayjs from 'dayjs'


@Component({
    selector: 'spline-date-filter',
    templateUrl: './spline-date-range-filter.component.html'
})
export class SplineDateRangeFilterComponent extends BaseLocalStateComponent<SplineDateRangeFilter.State> implements OnChanges {

    @ViewChild(DaterangepickerComponent) datePicker: DaterangepickerComponent
    @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger
    @Input() value: SplineDateRangeValue | null
    @Input() showIcon = true
    @Input() icon = 'schedule'
    @Input() label: string
    @Input() emptyValueString = 'COMMON.DATE_FILTER__EMPTY_VALUE_LABEL'
    @Output() valueChanged$ = new EventEmitter<SplineDateRangeValue>()
    _customDateRanges: { [key: string]: [dayjs.Dayjs, dayjs.Dayjs] }
    private _defaultValue: dayjs.Dayjs

    constructor() {
        super()

        const currentDate = new Date()
        this._defaultValue = dayjs(currentDate)

        // TODO: labels localization is needed
        this._customDateRanges = {
            Today: [dayjs(currentDate), dayjs(currentDate)], // ts-ignore
            Yesterday: [dayjs(currentDate).subtract(1, 'days'), dayjs(currentDate).subtract(1, 'days')],
            'This Week': [dayjs(currentDate).startOf('week'), dayjs(currentDate).endOf('week')],
            'Last Week': [dayjs(currentDate).subtract(1, 'weeks').startOf('week'), dayjs(currentDate).subtract(1, 'weeks').endOf('week')],
            'This Month': [dayjs(currentDate).startOf('month'), dayjs(currentDate).endOf('month')],
            'Last Month': [
                dayjs(currentDate).subtract(1, 'month').startOf('month'),
                dayjs(currentDate).subtract(1, 'month').endOf('month')
            ],
            'Last 3 Month': [
                dayjs(currentDate).subtract(3, 'month').startOf('month'),
                dayjs(currentDate).subtract(1, 'month').endOf('month')
            ]
        }

        this.updateState(
            SplineDateRangeFilter.getDefaultState()
        )
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private _maxDate: dayjs.Dayjs

    @Input() set maxDate(value: Date) {
        this._maxDate = value ? dayjs(value).endOf('day') : null
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private _minDate: dayjs.Dayjs

    @Input() set minDate(value: Date) {
        this._minDate = value ? dayjs(value).startOf('day') : null
    }

    get initialStartDate(): dayjs.Dayjs {
        if (this.state?.valueDayjs) {
            return this.state.valueDayjs.dateFrom
        }

        if (this._minDate) {
            return this._minDate
        }

        return this._defaultValue
    }

    get initialEndDate(): dayjs.Dayjs {
        if (this.state?.valueDayjs) {
            return this.state.valueDayjs.dateTo
        }
        if (this._maxDate) {
            return this._maxDate
        }

        return this._defaultValue
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { value } = changes
        if (value) {
            this.setValue(value.currentValue)
        }
    }

    onDateChosen($event: { [key: string]: any }): void {
        const { startDate, endDate } = $event as { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }
        const newValue = startDate && endDate
            ? {
                dateFrom: startDate?.startOf('day').toDate(),
                dateTo: endDate?.endOf('day').toDate()
            }
            : null
        this.setValue(newValue)
        this.valueChanged$.emit(newValue)
    }

    onCloseDatePicker(): void {
        this.datePicker.updateView()
        this.matMenuTrigger.closeMenu()
    }

    private setValue(value: SplineDateRangeValue): void {
        this.updateState(
            SplineDateRangeFilter.reduceValueChanged(this.state, value)
        )
    }
}
