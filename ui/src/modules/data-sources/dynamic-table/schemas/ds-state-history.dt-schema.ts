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

import { ExecutionEvent, ExecutionEventField } from 'spline-api'
import { DtCellDateTime, DtCellLink, DynamicTableDataMap } from 'spline-common/dynamic-table'
import { SplineDataSourceSharedDtSchema } from 'spline-shared/dynamic-table'
import { EventsRouting } from 'spline-shared/events'


export namespace DsStateHistoryDtSchema {

    export enum Column {
        applicationName = ExecutionEventField.applicationName,
        executionPlanId = ExecutionEventField.executionPlanId,
        dataSourceUri = ExecutionEventField.dataSourceUri,
        dataSourceType = ExecutionEventField.dataSourceType,
        writeMode = ExecutionEventField.append,
        timestamp = ExecutionEventField.timestamp,
    }

    export function getSchema(): DynamicTableDataMap<Column> {
        return [
            {
                ...DtCellLink.getColSchema(
                    (rowData: ExecutionEvent) => ({
                        title: rowData.applicationName,
                        routerLink: EventsRouting.getEventOverviewPageUrl(rowData.executionEventId),
                        description: rowData.applicationId
                    })
                ),
                id: Column.applicationName,
                header: 'DATA_SOURCES.DS_STATE_HISTORY__COL__APPLICATION',
                isSortable: true,
            },
            {
                ...DtCellLink.getColSchema(
                    (rowData: ExecutionEvent) => ({
                        title: rowData.executionPlanId,
                        routerLink: ['/plans/overview', rowData.executionPlanId],
                    })
                ),
                id: Column.executionPlanId,
                header: 'DATA_SOURCES.DS_STATE_HISTORY__COL__EXECUTION_PLAN',
                isSortable: true,
            },
            {
                ...SplineDataSourceSharedDtSchema.getWriteModeColSchema(
                    (rowData: ExecutionEvent) => rowData.writeMode
                ),
                id: Column.writeMode,
                header: 'DATA_SOURCES.DS_STATE_HISTORY__COL__WRITE_MODE',
                isSortable: true
            },
            {
                ...DtCellDateTime.getDefaultColSchema(),
                id: Column.timestamp,
                header: 'DATA_SOURCES.DS_STATE_HISTORY__COL__TIMESTAMP',
                isSortable: true,
                layout: {
                    styles: {
                        justifyContent: 'center',
                        maxWidth: '160px',
                        textAlign: 'center'
                    }
                }
            },
        ]
    }

}
