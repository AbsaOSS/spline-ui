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

import { differenceWith } from 'lodash-es'
import { ExecutionEventLineageNode, ExecutionEventLineageNodeType, Lineage } from 'spline-api'
import { SgData, SgNode, SgNodeCircleButton } from 'spline-common/graph'


export namespace EventNodeHistory {

    const LOAD_MORE_NODE_ID_PREFIX = '__loadMore__'

    export enum NodeControlEvent {
        LoadHistory = 'LoadHistory',
        LoadFuture = 'LoadFuture'
    }

    export function toLoadHistorySgNode(nodeId: string): SgNode {
        return SgNodeCircleButton.toNode(
            toLoadMoreNodeId(nodeId),
            {
                eventName: NodeControlEvent.LoadHistory,
                icon: 'history',
                tooltip: 'EVENTS.SG__LOAD_MORE__TOOLTIP',
            },
        )
    }

    export function toLoadMoreNodeId(nodeId: string): string {
        return `${LOAD_MORE_NODE_ID_PREFIX}${nodeId}`
    }

    export function loadMoreNodeToNativeNodeId(loadMoreNodeId: string): string {
        return loadMoreNodeId.replace(LOAD_MORE_NODE_ID_PREFIX, '')
    }

    export function toLoadFutureSgNode(nodeId: string): SgNode {
        return SgNodeCircleButton.toNode(
            toLoadMoreNodeId(nodeId),
            {
                eventName: NodeControlEvent.LoadFuture,
                icon: 'more_time',
                tooltip: 'EVENTS.SG__LOAD_MORE__TOOLTIP',
            },
        )
    }

    export function getLoadHistoryGraphData(lineageData: Lineage<ExecutionEventLineageNode>): SgData {
        // select DS nodes with no parents
        const dsNodesIds = lineageData.nodes
            .filter(item => item.type === ExecutionEventLineageNodeType.DataSource)
            .map(item => item.id)

        const dsNodesIdsWithParent = lineageData.links
            .filter(item => dsNodesIds.includes(item.target))
            .map(item => item.target)

        const dsNodesIdsNoParent = differenceWith(dsNodesIds, dsNodesIdsWithParent)

        // add new add button to the node with no parent

        return {
            links: dsNodesIdsNoParent.map(
                nodeId => ({
                    source: toLoadMoreNodeId(nodeId),
                    target: nodeId
                })
            ),
            nodes: dsNodesIdsNoParent.map(
                nodeId => toLoadHistorySgNode(nodeId)
            )
        }
    }

    export function getLoadFutureGraphData(lineageData: Lineage<ExecutionEventLineageNode>): SgData {
        // select DS nodes with no parents
        const dsNodesIds = lineageData.nodes
            .filter(item => item.type === ExecutionEventLineageNodeType.DataSource)
            .map(item => item.id)

        const dsNodesIdsWithChildren = lineageData.links
            .filter(item => dsNodesIds.includes(item.source))
            .map(item => item.source)

        const dsNodesIdsNoChildren = differenceWith(dsNodesIds, dsNodesIdsWithChildren)

        // add new add button to the node with no parent

        return {
            links: dsNodesIdsNoChildren.map(
                nodeId => ({
                    target: toLoadMoreNodeId(nodeId),
                    source: nodeId
                })
            ),
            nodes: dsNodesIdsNoChildren.map(
                nodeId => toLoadFutureSgNode(nodeId)
            )
        }
    }
}

