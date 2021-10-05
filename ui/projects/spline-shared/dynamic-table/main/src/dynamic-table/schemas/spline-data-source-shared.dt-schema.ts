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
import { SplineLabel } from 'spline-common'
import {
    DtCellLabel,
    DtCellLayout,
    DtLayoutBuilder,
    DtLayoutSize,
    DynamicTableColumnSchema,
    TCellValueFn
} from 'spline-common/dynamic-table'


export namespace SplineDataSourceSharedDtSchema {

    export function getWriteModeDefaultLayout(): DtCellLayout {
        return (new DtLayoutBuilder())
            .alignCenter()
            .setWidth('160px')
            .visibleAfter(DtLayoutSize.sm)
            .toLayout()
    }


    export function getWriteModeColSchema(
        getWriteModeFn: TCellValueFn<DataSourceWriteMode>
    ): Partial<DynamicTableColumnSchema<DtCellLabel.Value, unknown, unknown, DtCellLabel.Options>> {

        return {
            type: DtCellLabel.TYPE,
            value: (rowData) => {
                switch (getWriteModeFn(rowData)) {
                    case DataSourceWriteMode.Append:
                        return 'SHARED.DYNAMIC_TABLE.DS_WRITE_MODE__APPEND'
                    case DataSourceWriteMode.Overwrite:
                        return 'SHARED.DYNAMIC_TABLE.DS_WRITE_MODE__OVERWRITE'
                    default:
                        return null
                }
            },
            options: (rowData) => {
                const writeMode = getWriteModeFn(rowData)
                const color: SplineLabel.Color = writeMode === DataSourceWriteMode.Append
                    ? SplineLabel.Color.platinum
                    : SplineLabel.Color.human

                return {
                    color
                }
            },
            layout: getWriteModeDefaultLayout()
        }
    }
}
