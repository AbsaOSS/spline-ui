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
import _ from 'lodash'
import { Observable } from 'rxjs'


export type SgValueProviderFn<T> = () => T;
export type SgValueProvider<T> = T | SgValueProviderFn<T> | SgValueProviderFn<Observable<T>> | Observable<T>;

export type SgNodeSchema<TData extends object = {}, TOptions extends object = {}> = {
    id: string
    type?: string
    data?: SgValueProvider<TData>
    options?: SgValueProvider<TOptions>
}

export type SgNode<TData extends object = {}, TOptions extends object = {}> =
    & SgNodeSchema<TData, TOptions>
    &
    {
        nativeOptions?: Omit<Node, 'id'>
    }

export type SgNativeNode<TData extends object = {}, TOptions extends object = {}> =
    & Node
    &
    {
        schema: SgNodeSchema<TData, TOptions>
    }

export type SgNodeLink = Edge

export type SgData = {
    nodes: SgNode<any>[]
    links: SgNodeLink[]
}

export function toSgNativeNode(node: SgNode): SgNativeNode {
    return {
        id: node.id,
        label: '', // it is needed for graph rendering
        ...(node?.nativeOptions ?? {}),
        schema: _.omit(node, ['nativeOptions']),
    }
}

export type SgLayoutSettings = DagreSettings

export const SG_DEFAULT_LAYOUT_SETTINGS: Readonly<SgLayoutSettings> = Object.freeze<SgLayoutSettings>({
    orientation: 'TB',
    marginX: 50,
    marginY: 250,
    edgePadding: 120,
} as SgLayoutSettings)
