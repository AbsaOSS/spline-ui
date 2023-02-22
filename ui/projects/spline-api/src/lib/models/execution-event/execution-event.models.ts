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

import { isBoolean } from 'lodash-es'

import { DataSourceWriteMode, SplineDataSourceInfo, uriToDatasourceInfo } from '../data-source'


export enum ExecutionEventField {
    append = 'append',
    applicationName = 'applicationName',
    applicationId = 'applicationId',
    dataSourceType = 'dataSourceType',
    dataSourceName = 'dataSourceName',
    dataSourceUri = 'dataSourceUri',
    executionEventId = 'executionEventId',
    executionPlanId = 'executionPlanId',
    frameworkName = 'frameworkName',
    timestamp = 'timestamp',
    duration = 'durationNs',
}

export type ExecutionEventDto = {
    append: boolean
    applicationName: string
    applicationId: string
    dataSourceType: string
    dataSourceUri: string
    dataSourceName: string
    executionEventId: string
    executionPlanId: string
    frameworkName: string
    timestamp: number
    error: ExecutionError
}

export type ExecutionError = any

export type ExecutionEvent =
    & ExecutionEventDto
    &
    {
        executedAt: Date
        dataSourceInfo: SplineDataSourceInfo
        writeMode: DataSourceWriteMode
    }

export function toExecutionEvent(entity: ExecutionEventDto): ExecutionEvent {
    const append = entity[ExecutionEventField.append]
    let writeMode = null
    
    if (isBoolean(append) && !append) {
        writeMode = DataSourceWriteMode.Overwrite
    }

    if (isBoolean(append) && append) {
        writeMode = DataSourceWriteMode.Append
    }

    return {
        ...entity,
        applicationName: entity.applicationName ?? entity.executionEventId,
        executedAt: new Date(entity.timestamp),
        dataSourceInfo: uriToDatasourceInfo(entity[ExecutionEventField.dataSourceUri], entity.dataSourceName),
        writeMode: writeMode
    }
}
