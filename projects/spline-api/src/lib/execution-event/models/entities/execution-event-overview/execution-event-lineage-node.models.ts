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

import { LineageNode } from '../lineage'

import { ExecutionEventLineageNodeType } from './execution-event-lineage-node-type.models'


export type ExecutionEventLineageNode =
    & LineageNode
    & {
        name: string
        type: ExecutionEventLineageNodeType
    }

export type ExecutionEventLineageNodeDto = {
    _id: string
    name: string
    _type: ExecutionEventLineageNodeType
}

export function toExecutionEventLineageNode(entity: ExecutionEventLineageNodeDto): ExecutionEventLineageNode {
    return {
        id: entity._id,
        name: entity.name,
        type: entity._type
    }
}
