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

import { ExecutionEventLineageNode, ExecutionEventLineageOverview, ExecutionEventLineageOverviewDepth, LineageNodeLink } from 'spline-api'
import { ProcessingStore, SplineEntityStore } from 'spline-utils'

import { EventInfo } from '../../models'


export namespace EventOverviewStore {

    export type State = {
        nodes: SplineEntityStore.EntityState<ExecutionEventLineageNode>
        links: LineageNodeLink[]
        executionEventId: string | null
        eventInfo: EventInfo | null
        loadingProcessing: ProcessingStore.EventProcessingState
        graphLoadingProcessing: ProcessingStore.EventProcessingState
        selectedNodeId: string | null
        targetNodeId: string | null
        lineageDepth: ExecutionEventLineageOverviewDepth
        graphHasMoreDepth: boolean
    }

    export const GRAPH_DEFAULT_DEPTH = 2

    const DEFAULT_LINEAGE_DEPTH = Object.freeze<ExecutionEventLineageOverviewDepth>({
        depthComputed: GRAPH_DEFAULT_DEPTH,
        depthRequested: GRAPH_DEFAULT_DEPTH,
    })

    export function getDefaultState(): State {
        return {
            nodes: SplineEntityStore.getDefaultState<ExecutionEventLineageNode>(),
            links: [],
            executionEventId: null,
            eventInfo: null,
            loadingProcessing: ProcessingStore.getDefaultProcessingState(),
            graphLoadingProcessing: ProcessingStore.getDefaultProcessingState(),
            selectedNodeId: null,
            targetNodeId: null,
            lineageDepth: {...DEFAULT_LINEAGE_DEPTH},
            graphHasMoreDepth: calculateHasMoreDepth(DEFAULT_LINEAGE_DEPTH)
        }
    }

    export function reduceLineageOverviewData(state: State,
                                              executionEventId: string,
                                              lineageOverview: ExecutionEventLineageOverview): State {

        const targetEdge = lineageOverview.lineage.links
            .find(
                x => x.target === lineageOverview.executionEventInfo.targetDataSourceId,
            )
        const eventNode = targetEdge
            ? lineageOverview.lineage.nodes.find(x => x.id === targetEdge.source)
            : undefined

        const nodesState = SplineEntityStore.addAll(lineageOverview.lineage.nodes, state.nodes)

        return {
            ...state,
            nodes: nodesState,
            links: lineageOverview.lineage.links,
            eventInfo: {
                id: executionEventId,
                name: eventNode ? eventNode.name : 'NaN',
                applicationId: lineageOverview.executionEventInfo.applicationId,
                executedAt: new Date(lineageOverview.executionEventInfo.timestamp),
            },
            lineageDepth: lineageOverview.executionEventInfo.lineageDepth,
            graphHasMoreDepth: calculateHasMoreDepth(lineageOverview.executionEventInfo.lineageDepth),
            targetNodeId: lineageOverview.executionEventInfo.targetDataSourceId
        }
    }

    export function selectAllNodes(state: State): ExecutionEventLineageNode[] {
        return SplineEntityStore.selectAll(state.nodes)
    }

    export function selectNode(state: State, nodeId: string): ExecutionEventLineageNode | undefined {
        return SplineEntityStore.selectOne(nodeId, state.nodes)
    }

    export function selectChildrenNodes(state: State, nodeId: string): ExecutionEventLineageNode[] {
        return state.links
            .filter(link => link.source === nodeId)
            .map(link => SplineEntityStore.selectOne(link.target, state.nodes))
    }

    export function selectParentNodes(state: State, nodeId: string): ExecutionEventLineageNode[] {
        return state.links
            .filter(link => link.target === nodeId)
            .map(link => SplineEntityStore.selectOne(link.source, state.nodes))
    }

    function calculateHasMoreDepth(lineageDepth: ExecutionEventLineageOverviewDepth): boolean {
        return lineageDepth.depthRequested < lineageDepth.depthComputed
    }

}
