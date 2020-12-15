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

import keyBy from 'lodash/keyBy'
import { AttributeLineage, AttributeLineageNode, AttributeLineageType } from 'spline-api'
import { SplineColors } from 'spline-common'


export const LINEAGE_TYPE_COLOR_MAP: Readonly<Record<AttributeLineageType, string>>
    = Object.freeze<Record<AttributeLineageType, string>>({
        [AttributeLineageType.Usage]: SplineColors.BLACK,
        [AttributeLineageType.Lineage]: SplineColors.GREEN_LIGHT,
        [AttributeLineageType.Impact]: SplineColors.SMILE,
    })

// TODO: write some tests
export function extractImpactRootAttributeNode(graph: AttributeLineage): AttributeLineageNode {
    const impactedAttrIds = keyBy(graph.impact.links, item => item.source)
    return graph.impact.nodes.find(node => !impactedAttrIds[node.id])
}

// TODO: write some tests
export function getLineageAttributesNodes(graph: AttributeLineage): AttributeLineageNode[] {
    const primaryAttribute = extractImpactRootAttributeNode(graph)
    return graph?.lineage?.nodes?.length
        ? graph.lineage.nodes.filter(node => node.id !== primaryAttribute.id)
        : []
}

// TODO: write some tests
export function getImpactAttributesNodes(graph: AttributeLineage): AttributeLineageNode[] {
    const primaryAttribute = extractImpactRootAttributeNode(graph)
    return graph?.impact?.nodes?.length
        ? graph.impact.nodes.filter(node => node.id !== primaryAttribute.id)
        : []
}

export type AttributeLineageNodesMap = Record<AttributeLineageType, Set<string>>

// TODO: write some tests
export function extractAttributeLineageNodesMap(graph: AttributeLineage | null): AttributeLineageNodesMap {

    if (graph === null) {
        return {
            [AttributeLineageType.Usage]: new Set(),
            [AttributeLineageType.Lineage]: new Set(),
            [AttributeLineageType.Impact]: new Set(),
        }
    }

    const primaryAttribute = extractImpactRootAttributeNode(graph)
    const impactAttributes = getImpactAttributesNodes(graph)
    const lineageAttributes = getLineageAttributesNodes(graph)

    const primaryNodeIds = [primaryAttribute.originOpId, ...primaryAttribute.transOpIds]
    const impactNodesIds = impactAttributes
        .reduce((acc, current) => [
            ...acc,
            current.originOpId,
            ...current.transOpIds,
        ], [])

    const lineageNodesIds = lineageAttributes
        .reduce((acc, current) => [
            ...acc,
            current.originOpId,
            ...current.transOpIds,
        ], [])

    return {
        [AttributeLineageType.Usage]: new Set(primaryNodeIds),
        [AttributeLineageType.Lineage]: new Set(lineageNodesIds),
        [AttributeLineageType.Impact]: new Set(impactNodesIds),
    }
}
