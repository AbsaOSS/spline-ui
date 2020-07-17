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

import { ExecutionEventLineageNodeType, ExecutionPlanLineageNode } from 'spline-api'
import { SdWidgetSimpleRecord, SplineDataSchema } from 'spline-common'

import { ExecutionPlanNodeControl } from './execution-plan-node-control.models'
import { GraphNodeInfo } from './graph-node-info.models'


export namespace ExecutionPlanNodeInfo {

    export function getNodeInfoLabel(nodeSource: ExecutionPlanLineageNode): string {
        return 'EVENTS.EVENT_NODE_INFO__LABEL__DATA_SOURCE'
    }

    export function toNodeInfo(nodeSource: ExecutionPlanLineageNode): GraphNodeInfo {
        const nodeStyles = ExecutionPlanNodeControl.getNodeStyles(nodeSource)

        const data: SplineDataSchema = nodeSource.type === ExecutionEventLineageNodeType.DataSource
            ? [
                SdWidgetSimpleRecord.toSchema({
                    label: 'Name',
                    value: nodeSource.name,
                }),
            ]
            : []

        return {
            title: ExecutionPlanNodeControl.extractNodeName(nodeSource),
            label: getNodeInfoLabel(nodeSource),
            ...nodeStyles,
            dataSchema: data,
        }
    }
}
