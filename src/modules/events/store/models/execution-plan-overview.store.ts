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

import { AttributeLineage, ExecutionPlan, ExecutionPlanLineageNode, ExecutionPlanLineageOverview, LineageNodeLink } from 'spline-api'
import { ProcessingStore, SplineEntityStore } from 'spline-utils'


export namespace ExecutionPlanOverviewStore {

    export type State = {
        nodes: SplineEntityStore.EntityState<ExecutionPlanLineageNode>
        executionPlanId: string | null
        links: LineageNodeLink[]
        executionPlan: ExecutionPlan | null
        loadingProcessing: ProcessingStore.EventProcessingState

        selectedNodeId: string | null
        selectedAttributeId: string | null

        attributeLineage: AttributeLineage | null
        attributeLineageLoadingProcessing: ProcessingStore.EventProcessingState
    }

    export function getDefaultState(): State {
        return {
            nodes: SplineEntityStore.getDefaultState<ExecutionPlanLineageNode>(),
            executionPlanId: null,
            links: [],
            executionPlan: null,
            loadingProcessing: ProcessingStore.getDefaultProcessingState(),

            selectedNodeId: null,
            selectedAttributeId: null,

            attributeLineage: null,
            attributeLineageLoadingProcessing: ProcessingStore.getDefaultProcessingState(),
        }
    }

    export function reduceLineageOverviewData(state: State,
                                              executionEventId: string,
                                              executionPlanOverview: ExecutionPlanLineageOverview): State {
        return {
            ...state,
            nodes: SplineEntityStore.addAll(executionPlanOverview.lineage.nodes, state.nodes),
            links: executionPlanOverview.lineage.links,
            executionPlan: executionPlanOverview.executionPlan,
        }
    }

    export function selectAllNodes(state: State): ExecutionPlanLineageNode[] {
        return SplineEntityStore.selectAll(state.nodes)
    }

    export function selectNode(state: State, nodeId: string): ExecutionPlanLineageNode | undefined {
        return SplineEntityStore.selectOne(nodeId, state.nodes)
    }

}
