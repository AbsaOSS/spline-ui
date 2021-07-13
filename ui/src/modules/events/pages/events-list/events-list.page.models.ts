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
import { SplineDateRangeFilter, SplineDateRangeFilterConsumerStore, SplineListBox } from 'spline-common'
import { SplineDateRangeValue } from 'spline-utils'


export namespace EventsListPage {

    export type State = {
        dateRangeFilter: SplineDateRangeFilterConsumerStore.State
    }

    export function getDefaultState(): State {
        return {
            dateRangeFilter: SplineDateRangeFilterConsumerStore.getDefaultState()
        }
    }

    export function reduceDateRangeFilterChanged(state: State, value: SplineDateRangeFilter.Value | null): State {
        return {
            ...state,
            dateRangeFilter: SplineDateRangeFilterConsumerStore.reduceValueChanged(state.dateRangeFilter, value)
        }
    }

    export function reduceDateRangeFilterBoundsChanged(state: State, value: SplineDateRangeValue | null): State {
        return {
            ...state,
            dateRangeFilter: SplineDateRangeFilterConsumerStore.reduceBoundsChanged(state.dateRangeFilter, value)
        }
    }


    export const listBoxRecords: SplineListBox.SimpleListRecord<DataSourceWriteMode>[] = [
        {
            value: DataSourceWriteMode.Append,
            label: 'Append'
        },
        {
            value: DataSourceWriteMode.Overwrite,
            label: 'Overwrite'
        }
    ]

    export const listBoxDataMap: SplineListBox.DataMap<SplineListBox.SimpleListRecord<DataSourceWriteMode>, DataSourceWriteMode> = {
        ...SplineListBox.getDefaultSimpleDataMap(),
        trackBy: value => value
    }


}
