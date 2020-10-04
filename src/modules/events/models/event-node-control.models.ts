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

import { dataSourceUriToName, ExecutionEventLineageNode, ExecutionEventLineageNodeType } from 'spline-api'
import { SgNode, SgNodeDefault } from 'spline-common'
import { SgNodeControl } from 'spline-shared'
import NodeType = SgNodeControl.NodeType;


export namespace EventNodeControl {

    import NodeStyles = SgNodeControl.NodeStyles;


    export function extractNodeName(nodeSource: ExecutionEventLineageNode): string {
        return dataSourceUriToName(nodeSource.name)
    }

    export function getNodeStyles(nodeSource: ExecutionEventLineageNode): NodeStyles {
        switch (nodeSource.type) {
            case ExecutionEventLineageNodeType.DataSource:
                return SgNodeControl.getNodeStyles(NodeType.DataSource)
            case ExecutionEventLineageNodeType.Execution:
                return SgNodeControl.getNodeStyles(NodeType.ExecutionPlan)
            default:
                throw new Error(`Unknown node type ${nodeSource.type}`)
        }
    }

    export function toSgNode(nodeSource: ExecutionEventLineageNode,
                             onExecutionPlanLaunchAction: (nodeId: string) => void,
                             onNodeHighlightToggleRelations: (nodeId: string) => void): SgNode {

        const nodeStyles = getNodeStyles(nodeSource)

        const defaultActions = [
            ...SgNodeControl.getNodeRelationsHighlightActions(
                () => onNodeHighlightToggleRelations(nodeSource.id)
            ),
        ]

        return SgNodeDefault.toNode(
            nodeSource.id,
            {
                label: extractNodeName(nodeSource),
                ...nodeStyles,
                inlineActions: nodeSource.type === ExecutionEventLineageNodeType.DataSource
                    ? [
                        ...defaultActions
                    ]
                    : [
                        {
                            icon: 'launch',
                            onClick: () => {
                                onExecutionPlanLaunchAction(nodeSource.id)
                            },
                            tooltip: 'EVENTS.EVENT_NODE_CONTROL__ACTION__LAUNCH',
                        },
                        ...defaultActions
                    ],
            },
        )
    }
}

