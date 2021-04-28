/*
 * Copyright 2021 ABSA Group Limited
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

import { VoltronEntity, VoltronEntityHierarchy, VoltronTaxonomyTree } from 'spline-api'
import { SplineColors } from 'spline-common'


export namespace TaxonomyTree {

    export enum NodeEntityType {
        Taxonomy = 'Taxonomy',
        Term = 'Term',
    }

    export type NodeEntityTypeInfo = {
        type: NodeEntityType
        name: string
        icon: string
        color: string
    }

    export const NODE_ENTITY_TYPE_INFO_MAP: Readonly<Record<NodeEntityType, NodeEntityTypeInfo>> = Object.freeze({
        [NodeEntityType.Taxonomy]: {
            type: NodeEntityType.Taxonomy,
            name: NodeEntityType.Taxonomy as string,
            icon: 'style',
            color: SplineColors.ORANGE
        },
        [NodeEntityType.Term]: {
            type: NodeEntityType.Taxonomy,
            name: NodeEntityType.Taxonomy as string,
            icon: 'label_important',
            color: SplineColors.PINK
        }
    })

    export type IdNameInfo = {
        id: string
        name: string
    }

    export type NodeEntity = {
        id: number
        name: string
        type: NodeEntityType
        isCde: boolean
        isBcbs: boolean
        owners: IdNameInfo[]
    }

    export type TreeNode = {
        entity: NodeEntity
        children?: TreeNode[]
    }

    export function createTreeFromVoltronTree(voltronTree: VoltronTaxonomyTree): TreeNode[] {
        return voltronTree.map((x) => voltronEntityHierarchyToTreeNode(x))
    }

    export function voltronEntityHierarchyToTreeNode(voltronEntityHierarchy: VoltronEntityHierarchy): TreeNode {
        return {
            entity: voltronEntityToNodeEntity(voltronEntityHierarchy.entity),
            children: (voltronEntityHierarchy?.children || []).map(x => voltronEntityHierarchyToTreeNode(x))
        }
    }

    export function voltronEntityToNodeEntity(voltronEntity: VoltronEntity): NodeEntity {
        return {
            id: voltronEntity.graphEntityId,
            name: voltronEntity.name,
            isBcbs: voltronEntity.isBcbs,
            isCde: voltronEntity.isCde,
            type: voltronEntity.label as NodeEntityType,
            owners: (voltronEntity.owner || '')
                .split('|')
                .map(item => {
                    const [id, name] = item.split('#')
                    return { id, name }
                })
        }
    }


}

