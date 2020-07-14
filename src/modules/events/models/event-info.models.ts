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

import { ExecutionEventLineageNode, ExecutionEventLineageNodeType } from 'spline-api'

import { EventNodeControl } from './event-node-control.models'


export type EventNodeInfo = {
    title: string
    label: string
    icon: string
    color: string
    data: EventNodeInfoDataRecord[]
}

export type EventNodeInfoDataRecord = {
    label: string
    value: string
}

export type EventNodeInfoData = EventNodeInfoDataRecord[];

export function toEventNodeInfo(nodeSource: ExecutionEventLineageNode): EventNodeInfo {
    const nodeStyles = EventNodeControl.getNodeStyles(nodeSource)

    const data: EventNodeInfoData = nodeSource.type === ExecutionEventLineageNodeType.DataSource
        ? [
            {
                label: 'URI',
                value: nodeSource.name,
            },
        ]
        : []

    return {
        title: EventNodeControl.getNodeTitle(nodeSource),
        label: EventNodeControl.getNodeLabel(nodeSource),
        ...nodeStyles,
        data,
    }
}
