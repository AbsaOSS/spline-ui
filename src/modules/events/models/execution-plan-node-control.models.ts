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

import { ExecutionPlanLineageNode, OperationType } from 'spline-api'
import { SgNode, SgNodeDefault } from 'spline-common'

import { SgNodeControl } from './sg-node-control.models'


export namespace ExecutionPlanNodeControl {

    import NodeStyles = SgNodeControl.NodeStyles


    export function extractNodeName(nodeSource: ExecutionPlanLineageNode): string {
        return nodeSource.name
    }

    export function getNodeStyles(nodeSource: ExecutionPlanLineageNode): NodeStyles {
        console.log(nodeSource.type)
        switch (nodeSource.type) {
            case OperationType.Transformation:
                switch(nodeSource.name) {
                    case 'Join':
                        return SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Join)
                    default:
                        return SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Transformation)
                }

            case OperationType.Read:
                return SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Read)

            case OperationType.Write:
                return SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Write)

            default:
                return { ...SgNodeControl.DEFAULT_NODE_STYLES }
        }
    }

    export function toSgNode(nodeSource: ExecutionPlanLineageNode): SgNode {
        const nodeStyles = getNodeStyles(nodeSource)

        return SgNodeDefault.toNode(
            nodeSource.id,
            {
                label: extractNodeName(nodeSource),
                ...nodeStyles,
            },
        )
    }
}

