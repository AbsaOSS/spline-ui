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

import { ExecutionEventLineageNode, ExecutionEventLineageNodeType } from 'spline-api'
import { SdWidgetCard, SdWidgetSimpleRecord, SplineCardHeader, SplineDataViewSchema } from 'spline-common'

import { SgNodeControl } from '../sg-node-control.models'

import { EventNodeControl } from './event-node-control.models'


export namespace EventNodeInfo {

    export function getNodeInfoLabel(nodeSource: ExecutionEventLineageNode): string {
        return nodeSource.type === ExecutionEventLineageNodeType.DataSource
            ? 'EVENTS.EVENT_NODE_INFO__LABEL__DATA_SOURCE'
            : 'EVENTS.EVENT_NODE_INFO__LABEL__EXECUTION_PLAN'
    }

    export function toDataSchema(nodeSource: ExecutionEventLineageNode,
                                 onExecutionPlanLaunchAction: (nodeId: string) => void,
                                 onNodeFocus: (nodeId: string) => void): SplineDataViewSchema {
        const nodeStyles = EventNodeControl.getNodeStyles(nodeSource)
        const contentDataSchema: SplineDataViewSchema = nodeSource.type === ExecutionEventLineageNodeType.DataSource
            ? [
                SdWidgetSimpleRecord.toSchema({
                    label: 'URI',
                    value: nodeSource.name,
                }),
            ]
            : []

        const defaultActions = [
            SgNodeControl.getNodeFocusAction(() => onNodeFocus(nodeSource.id))
        ]

        const actions: SplineCardHeader.Action[] = nodeSource.type === ExecutionEventLineageNodeType.Execution
            ? [
                ...defaultActions,
                {
                    icon: 'launch',
                    onClick: () => {
                        onExecutionPlanLaunchAction(nodeSource.id)
                    },
                    tooltip: 'EVENTS.EVENT_NODE_CONTROL__ACTION__LAUNCH',
                },
            ]
            : [...defaultActions]
        return [
            SdWidgetCard.toSchema(
                {
                    color: nodeStyles.color,
                    icon: nodeStyles.icon,
                    title: EventNodeControl.extractNodeName(nodeSource),
                    label: getNodeInfoLabel(nodeSource),
                    actions
                },
                contentDataSchema,
            ),
        ]
    }
}
