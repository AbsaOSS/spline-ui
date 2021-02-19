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

import { ExecutionEventLineageNode, ExecutionEventLineageNodeType, OperationDetails, operationIdToExecutionPlanId } from 'spline-api'
import { SplineCardHeader } from 'spline-common'
import { SdWidgetCard, SdWidgetSchema, SdWidgetSimpleRecord, SplineDataViewSchema } from 'spline-common/data-view'
import { SdWidgetAttributesTree } from 'spline-shared/attributes'
import { SgEventNodeInfoShared, SgNodeCardDataView } from 'spline-shared/data-view'
import { ProcessingStore } from 'spline-utils'

import { EventNodeControl } from './event-node-control.models'


export namespace EventNodeInfo {

    export enum WidgetEvent {
        LaunchExecutionEvent = 'LaunchExecutionEvent'
    }

    export function getNodeInfoTooltip(nodeSource: ExecutionEventLineageNode): string {
        return nodeSource.type === ExecutionEventLineageNodeType.DataSource
            ? 'EVENTS.EVENT_NODE_INFO__TOOLTIP__DATA_SOURCE'
            : 'EVENTS.EVENT_NODE_INFO__TOOLTIP__EXECUTION_PLAN'
    }

    export function toDataSchema(nodeSource: ExecutionEventLineageNode): SdWidgetSchema<SdWidgetCard.Data> {
        const nodeStyles = EventNodeControl.getNodeStyles(nodeSource)
        const contentDataSchema: SplineDataViewSchema = nodeSource.type === ExecutionEventLineageNodeType.DataSource
            ? [
                SdWidgetSimpleRecord.toSchema({
                    label: 'URI',
                    value: nodeSource.name,
                }),
            ]
            : []

        const defaultActions = [
            SgNodeCardDataView.getNodeRelationsHighlightToggleAction(nodeSource.id),
            SgNodeCardDataView.getNodeFocusAction(nodeSource.id),
        ]

        const actions: SplineCardHeader.Action[] = nodeSource.type === ExecutionEventLineageNodeType.Execution
            ? [
                ...defaultActions,
                {
                    icon: 'launch',
                    tooltip: 'EVENTS.EVENT_NODE_CONTROL__ACTION__LAUNCH',
                    event: SgNodeCardDataView.toNodeWidgetEventInfo(WidgetEvent.LaunchExecutionEvent, nodeSource.id)
                },
            ]
            : [...defaultActions]
        return SdWidgetCard.toSchema(
            {
                color: nodeStyles.color,
                icon: nodeStyles.icon,
                title: EventNodeControl.extractNodeName(nodeSource),
                iconTooltip: getNodeInfoTooltip(nodeSource),
                actions,
            },
            contentDataSchema,
        )
    }

    export type NodeRelationsInfo = {
        node: ExecutionEventLineageNode
        parents: ExecutionEventLineageNode[]
        children: ExecutionEventLineageNode[]
    }

    export type DataSourceSchemaDetails = {
        executionPlansIds: string[]
        dataViewSchema: SplineDataViewSchema
    }

    export type NodeInfoViewState = {
        nodeDvs: SplineDataViewSchema | null
        parentsDvs: SplineDataViewSchema | null
        childrenDvs: SplineDataViewSchema | null
        parentsNumber: number
        childrenNumber: number
        dataSourceSchemaDetailsList: DataSourceSchemaDetails[]
        loadingProcessing: ProcessingStore.EventProcessingState
    }

    export function getDefaultState(): NodeInfoViewState {
        return {
            nodeDvs: null,
            parentsDvs: null,
            childrenDvs: null,
            parentsNumber: 0,
            childrenNumber: 0,
            dataSourceSchemaDetailsList: [],
            loadingProcessing: ProcessingStore.getDefaultProcessingState(true)
        }
    }

    export function getOperationsDataSourceSchemasDvs(operationsDetailsList: OperationDetails[]): DataSourceSchemaDetails[] {

        const operationsDetailsTreeMap = SgEventNodeInfoShared.toOperationDetailsAttrTreeMap(operationsDetailsList)

        return Object.values(operationsDetailsTreeMap)
            .map(currentOperationsInfoList => {

                // as all schemas are the same we can take just the first operation as a reference to build schema.
                const treeData = currentOperationsInfoList[0].attrTree

                const executionPlansIds = currentOperationsInfoList
                    .map(
                        ({ operationInfo }) => operationIdToExecutionPlanId(operationInfo.operation.id)
                    )

                return {
                    executionPlansIds,
                    dataViewSchema: SdWidgetCard.toContentOnlySchema(
                        SdWidgetAttributesTree.toSchema(
                            treeData,
                            {
                                allowAttrSelection: false,
                                actionIcon: 'eye-outline'
                            }
                        ),
                    )
                }
            })
    }

    export function reduceNodeRelationsState(state: NodeInfoViewState,
                                             nodeRelations: EventNodeInfo.NodeRelationsInfo,
                                             operationsInfoList: OperationDetails[] = []): NodeInfoViewState {
        return {
            ...state,
            nodeDvs: toDataSchema(nodeRelations.node),
            childrenDvs: nodeRelations.children.map((node) => toDataSchema(node)),
            parentsDvs: nodeRelations.parents.map((node) => toDataSchema(node)),
            parentsNumber: nodeRelations?.parents?.length ?? 0,
            childrenNumber: nodeRelations?.children?.length ?? 0,
            dataSourceSchemaDetailsList: operationsInfoList.length > 0 ? getOperationsDataSourceSchemasDvs(operationsInfoList) : [],
        }
    }

}
