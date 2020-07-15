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

import { ExecutionPlan, ExecutionPlanLineageNode, ExecutionPlanLineageOverview } from 'spline-api'
import { SgData } from 'spline-common'
import { ProcessingStore, SplineEntityStore } from 'spline-utils'

import { ExecutionPlanNodeControl } from '../../models'


export namespace ExecutionPlanOverviewStore {

    export type State = {
        nodes: SplineEntityStore.EntityState<ExecutionPlanLineageNode>
        executionPlanId: string | null
        graphData: SgData | null
        executionPlan: ExecutionPlan | null
        loadingProcessing: ProcessingStore.EventProcessingState
        selectedNodeId: string | null
    }

    export function getDefaultState(): State {
        return {
            nodes: SplineEntityStore.getDefaultState<ExecutionPlanLineageNode>(),
            executionPlanId: null,
            graphData: null,
            executionPlan: null,
            loadingProcessing: ProcessingStore.getDefaultProcessingState(),
            selectedNodeId: null,
        }
    }

    export function reduceLineageOverviewData(state: State,
                                              executionEventId: string,
                                              executionPlanOverview: ExecutionPlanLineageOverview): State {
        return {
            ...state,
            nodes: SplineEntityStore.addAll(executionPlanOverview.lineage.nodes, state.nodes),
            graphData: {
                nodes: executionPlanOverview.lineage.nodes.map(nodeSource => ExecutionPlanNodeControl.toSgNode(nodeSource)),
                links: executionPlanOverview.lineage.links,
            },
            executionPlan: executionPlanOverview.executionPlan,
        }
    }

    export function selectNode(state: State, nodeId: string): ExecutionPlanLineageNode | undefined {
        return SplineEntityStore.selectOne(nodeId, state.nodes)
    }

}
