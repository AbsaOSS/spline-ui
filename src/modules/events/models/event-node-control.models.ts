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
import { SgNode, SgNodeDefault, SplineColors } from 'spline-common'


export namespace EventNodeControl {

    export type NodeStyles = {
        icon: string
        color: string
    }

    export const NODE_STYLES_MAP: ReadonlyMap<ExecutionEventLineageNodeType, NodeStyles> =
        new Map<ExecutionEventLineageNodeType, NodeStyles>([
            [
                ExecutionEventLineageNodeType.DataSource,
                {
                    icon: 'insert_drive_file',
                    color: SplineColors.BLUE,
                },
            ],
            [
                ExecutionEventLineageNodeType.Execution,
                {
                    icon: 'settings',
                    color: SplineColors.ORANGE,
                },
            ],
        ])

    export function getNodeTitle(nodeSource: ExecutionEventLineageNode): string {
        return nodeSource.name.split('/').slice(-1)[0]
    }

    export function getNodeLabel(nodeSource: ExecutionEventLineageNode): string {
        return nodeSource.type === ExecutionEventLineageNodeType.DataSource
            ? 'EVENTS.EVENT_NODE_INFO__LABEL__DATA_SOURCE'
            : 'EVENTS.EVENT_NODE_INFO__LABEL__EXECUTION'
    }

    export function getNodeStyles(nodeSource: ExecutionEventLineageNode): NodeStyles {
        return NODE_STYLES_MAP.get(nodeSource.type)
    }

    export function toSgNode(nodeSource: ExecutionEventLineageNode): SgNode {
        const nodeStyles = getNodeStyles(nodeSource)

        return SgNodeDefault.toNode(
            nodeSource.id,
            {
                label: getNodeTitle(nodeSource),
                ...nodeStyles,
            },
        )
    }
}

