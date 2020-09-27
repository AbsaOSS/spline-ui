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
import { SplineCardHeader } from 'spline-common'
import { SdWidgetCard, SdWidgetSchema, SdWidgetSimpleRecord, SplineDataViewSchema } from 'spline-common/data-view'
import { SgNodeCardDataView } from 'spline-shared/data-view'

import { EventNodeControl } from './event-node-control.models'


export namespace EventNodeInfo {

    export enum WidgetEvent {
        LaunchExecutionEvent = 'LaunchExecutionEvent'
    }

    export function getNodeInfoTooltip(nodeSource: ExecutionEventLineageNode): string {
        return nodeSource.type === ExecutionEventLineageNodeType.DataSource
            ? 'EVENTS.EVENT_NODE_INFO__TOOLTIP__DATA_SOURCE'
            : 'EVENTS.EVENT_NODE_INFO__TOOLTIP__EXECUTION_PLAN'
    }

    export function toDataSchema(nodeSource: ExecutionEventLineageNode): SdWidgetSchema<SdWidgetCard.Data> {
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
            SgNodeCardDataView.getNodeRelationsHighlightToggleAction(nodeSource.id),
            SgNodeCardDataView.getNodeFocusAction(nodeSource.id),
        ]

        const actions: SplineCardHeader.Action[] = nodeSource.type === ExecutionEventLineageNodeType.Execution
            ? [
                ...defaultActions,
                {
                    icon: 'launch',
                    tooltip: 'EVENTS.EVENT_NODE_CONTROL__ACTION__LAUNCH',
                    event: SgNodeCardDataView.toNodeWidgetEventInfo(WidgetEvent.LaunchExecutionEvent, nodeSource.id)
                },
            ]
            : [...defaultActions]
        return SdWidgetCard.toSchema(
            {
                color: nodeStyles.color,
                icon: nodeStyles.icon,
                title: EventNodeControl.extractNodeName(nodeSource),
                iconTooltip: getNodeInfoTooltip(nodeSource),
                actions,
            },
            contentDataSchema,
        )
    }

    export type NodeRelationsInfo = {
        node: ExecutionEventLineageNode
        parents: ExecutionEventLineageNode[]
        children: ExecutionEventLineageNode[]
    }

    export type NodeInfoViewState = {
        nodeDvs: SplineDataViewSchema
        parentsDvs: SplineDataViewSchema | null
        childrenDvs: SplineDataViewSchema | null
        parentsNumber: number
        childrenNumber: number
    }

}
