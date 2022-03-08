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


import { AttributeDataType, AttributeDataTypeDto, AttributeSchema, toAttributeDataType } from '../attribute'
import { SplineDataSourceInfo, SplineDataSourceInfoDto, toDataSourceInfo } from '../data-source'


export type ExecutionPlan = {
    id: string
    name: string
    inputDataSources?: SplineDataSourceInfo[]
    outputDataSource?: SplineDataSourceInfo
    agentInfo?: ExecutionPlanAgentInfo
    systemInfo?: ExecutionPlanSystemInfo
    extraInfo?: ExecutionPlanExtraInfo
}

export type ExecutionPlanAgentInfo = {
    name: string
    version: string
}


export type ExecutionPlanSystemInfo =
    & Record<string, any>
    &
    {
        name: string
        version: string
    }

export type ExecutionPlanDto = {
    _id: string
    name?: string
    inputs?: SplineDataSourceInfoDto[]
    output?: SplineDataSourceInfoDto
    agentInfo?: ExecutionPlanAgentInfo
    systemInfo: ExecutionPlanSystemInfo
    extra?: ExecutionPlanExtraInfoDto
}

export type ExecutionPlanExtraInfo =
    &
    {
        attributes: AttributeSchema[]
        dataTypes: AttributeDataType[]
    }
    & Record<string, any>


export type ExecutionPlanExtraInfoDto =
    &
    {
        attributes?: AttributeSchema[]
        dataTypes?: AttributeDataTypeDto[]
    }
    & Record<string, any>

export function toExecutionPlan(entity: ExecutionPlanDto): ExecutionPlan {
    return {
        id: entity._id,
        name: entity.name?.length ? entity.name : planSystemInfoToName(entity.systemInfo),
        inputDataSources: entity.inputs.map(toDataSourceInfo),
        outputDataSource: toDataSourceInfo(entity.output),
        agentInfo: entity.agentInfo,
        systemInfo: entity.systemInfo,
        extraInfo: toExecutionPlanExtraInfo(entity.extra),
    }
}

export function planSystemInfoToName(systemInfo: ExecutionPlanSystemInfo): string {
    return `[${systemInfo.name} v${systemInfo.version}]`
}

export function toExecutionPlanExtraInfo(entity: ExecutionPlanExtraInfoDto): ExecutionPlanExtraInfo {
    return {
        ...entity,
        attributes: entity?.attributes || [],
        dataTypes: (entity?.dataTypes || []).map(toAttributeDataType),
    }
}

export function operationIdToExecutionPlanId(operationId: string): string {
    const idArray = operationId.split(':')

    if (idArray.length < 2) {
        throw new Error(`Invalid OperationId: ${operationId}`)
    }

    return idArray
        .slice(0, idArray.length - 1)
        .join(':')
}


