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

import { DataSourceWriteMode } from 'spline-api'
import { getDataSourceWriteModeInfoList, getDataSourceWriteModeLabel, SplineListBox } from 'spline-common'
import { DynamicFilterModel } from 'spline-common/dynamic-filter'
import { DfControlDateRange, DfControlSelect } from 'spline-common/dynamic-filter/filter-controls'


export namespace EventsListPage {

    export enum FilterId {
        writeMode = 'writeMode',
        dataRange = 'dateRange'
    }

    export type Filter = {
        [FilterId.writeMode]: DataSourceWriteMode[]
        [FilterId.dataRange]: DfControlDateRange.Value
    }

    export function createFilterModel(defaultValue?: Partial<Filter>): DynamicFilterModel<Filter> {
        const filterModel = new DynamicFilterModel<Filter>([
            new DfControlDateRange.Model(
                FilterId.dataRange,
                {
                    label: 'EVENTS.EVENTS_LIST__DF__EXECUTED_AT'
                }
            ),
            new DfControlSelect.Model(
                FilterId.writeMode,
                {
                    records: getDataSourceWriteModeInfoList()
                        .map(item => ({
                            label: item.label,
                            value: item.writeMode
                        })),
                    icon: 'save',
                    label: 'EVENTS.EVENTS_LIST__DF__WRITE_MODE',
                    options: {
                        dataMap: {
                            ...SplineListBox.getDefaultSimpleDataMap(),
                            valueToString: (value: DataSourceWriteMode) => getDataSourceWriteModeLabel(value)
                        }
                    }
                }
            )
        ])

        if (defaultValue) {
            filterModel.partialPatchValue(defaultValue, false)
        }

        return filterModel
    }

}
