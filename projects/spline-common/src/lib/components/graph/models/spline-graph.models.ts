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


import { DagreSettings, Edge, Node } from '@swimlane/ngx-graph'


export namespace SplineGraph {

    export type GraphNode<TData extends object = {}> =
        & Node
        &
        {
            extraData: TData
        }

    export type GraphNodeLink = Edge

    export type GraphData<TData extends object = {}> = {
        nodes: GraphNode<TData>[]
        links: GraphNodeLink[]
    }

    export type LayoutSettings = DagreSettings

    export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = Object.freeze<LayoutSettings>({
        orientation: 'TB',
        marginX: 50,
        marginY: 250,
        edgePadding: 120,
    } as LayoutSettings)
}
