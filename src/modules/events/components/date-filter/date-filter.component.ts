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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import moment from 'moment'
import { DaterangepickerDirective } from 'ngx-daterangepicker-material'

import { SplineDateFilter } from './date-filter.models'


@Component({
    selector: 'spline-date-filter',
    templateUrl: './date-filter.component.html',
    styleUrls: ['./date-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplineDateFilterComponent {

    readonly customDateRanges = {
        Today: [moment().startOf('day'), moment().endOf('day')],
        Yesterday: [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
        'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
        'Last Week': [moment().subtract(1, 'week').startOf('isoWeek'), moment().subtract(1, 'week').endOf('isoWeek')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 3 Month': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    }

    @ViewChild(DaterangepickerDirective, { static: true }) datePicker: DaterangepickerDirective
    @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger

    @Input() set maxDate(value: Date) {
        this._maxDateMoment = moment(value).endOf('day')
    }

    @Input() set minDate(value: Date) {
        this._minDateMoment = moment(value).startOf('day')
    }

    @Input() set value(value: SplineDateFilter.Value | null) {
        this.setValue(value)
    }

    @Output() valueChanged$ = new EventEmitter<SplineDateFilter.Value>()

    valueString: string

    _maxDateMoment: moment.Moment
    _minDateMoment: moment.Moment
    _valueMoment: SplineDateFilter.ValueMoment

    onDateChosen($event: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment }): void {
        const newValue = $event.startDate && $event.endDate
            ? {
                dateFrom: $event.startDate ? $event.startDate.startOf('day').toDate() : undefined,
                dateTo: $event.endDate ? $event.endDate.endOf('day').toDate(): undefined,
            }
            : null
        this.setValue(newValue)
        this.valueChanged$.emit(newValue)
    }

    onCloneDatePicker(): void {
        this.matMenuTrigger.closeMenu()
    }

    private setValue(value: SplineDateFilter.Value): void {

        this.valueString = value
            ? SplineDateFilter.valueToString(value)
            : ''

        this._valueMoment = value
            ? {
                dateFrom: moment(value.dateFrom),
                dateTo: moment(value.dateTo),
            }
            : null
    }
}
