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
import { SgNode, SgNodeDefault } from 'spline-common'


export namespace EventNodeControl {

    export const NODE_STYLES_MAP: ReadonlyMap<ExecutionEventLineageNodeType, { icon: string; color: string }> =
        new Map<ExecutionEventLineageNodeType, { icon: string; color: string }>([
            [
                ExecutionEventLineageNodeType.DataSource,
                {
                    icon: 'insert_drive_file',
                    color: '#337AB7',
                },
            ],
            [
                ExecutionEventLineageNodeType.Execution,
                {
                    icon: 'settings',
                    color: '#e39255',
                },
            ],
        ])

    export function toNode(nodeSource: ExecutionEventLineageNode): SgNode {
        const nodeStyles = NODE_STYLES_MAP.get(nodeSource.type)

        return SgNodeDefault.toNode(
            nodeSource.id,
            {
                label: nodeSource.name.split('/').slice(-1)[0],
                ...nodeStyles,
            },
        )
    }
}

