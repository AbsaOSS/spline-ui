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


import { SplineColors } from 'spline-common'


export namespace SgNodeControl {

    export type NodeStyles = {
        icon: string
        color: string
    }

    export enum NodeType {
        DataSource = 'DataSource',
        ExecutionPlan = 'ExecutionPlan',
    }

    export const NODE_STYLES_MAP: ReadonlyMap<NodeType, NodeStyles> =
        new Map<NodeType, NodeStyles>([
            [
                NodeType.DataSource,
                {
                    icon: 'description',
                    color: SplineColors.BLUE,
                },
            ],
            [
                NodeType.ExecutionPlan,
                {
                    icon: 'playlist_play',
                    color: SplineColors.ORANGE,
                },
            ],
        ])

    export function getNodeStyles(type: NodeType): NodeStyles | undefined {
        return NODE_STYLES_MAP.get(type)
    }

}

