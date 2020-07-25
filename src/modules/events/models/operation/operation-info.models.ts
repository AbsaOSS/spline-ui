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

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AttributeDataType, AttributeSchema, Operation, OperationDetails, OperationType } from 'spline-api'
import { SdWidgetCard, SdWidgetSchema, SplineDataViewSchema } from 'spline-common'
import { SdWidgetAttributesTree, SplineAttributesTree } from 'spline-shared'

import { attributesSchemaToDataViewSchema } from '../attribute/attributes-schema.models'
import { SgNodeControl } from '../sg-node-control.models'

import { OperationRead } from './type'


export namespace OperationInfo {

    import NodeStyles = SgNodeControl.NodeStyles


    export function extractLabel(operation: Operation): string {
        return operation.type
    }

    export function getNodeStyles(operationType: OperationType | string, name: string): NodeStyles {
        switch (operationType) {
            case OperationType.Transformation:
                switch (name) {
                    case 'Join':
                        return SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Join)
                    default:
                        return SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Transformation)
                }

            case OperationType.Read:
                return SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Read)

            case OperationType.Write:
                return SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Write)

            default:
                return { ...SgNodeControl.DEFAULT_NODE_STYLES }
        }
    }

    export function toDataViewSchema(operation: Operation): SplineDataViewSchema {
        const nodeStyles = getNodeStyles(operation.type, operation.name)

        return [
            SdWidgetCard.toSchema(
                {
                    color: nodeStyles.color,
                    icon: nodeStyles.icon,
                    title: operation.name,
                    label: extractLabel(operation),
                },
            ),
        ]
    }

    export function toInputsDvs(operationDetails: OperationDetails,
                                selectedAttributeId$: Observable<string | null>): SplineDataViewSchema | null {

        if (!operationDetails.inputs || !operationDetails.inputs?.length) {
            return null
        }

        return operationDetails.inputs
            .map(
                index => attributesSchemaToDataViewSchema(
                    operationDetails.schemas[index], operationDetails.dataTypes, selectedAttributeId$,
                ),
            )
    }

    export function toOutputsDvs(operationDetails: OperationDetails,
                                 selectedAttributeId$: Observable<string | null>): SplineDataViewSchema | null {

        if (operationDetails.output === null) {
            return null
        }

        return attributesSchemaToDataViewSchema(
            operationDetails.schemas[operationDetails.output], operationDetails.dataTypes, selectedAttributeId$,
        )
    }

    export function toDetailsDvs(operationDetails: OperationDetails): SplineDataViewSchema | null {
        switch (operationDetails.operation.type) {
            case OperationType.Read:
                return OperationRead.toDataViewSchema(operationDetails)
            default:
                return null
        }
    }

}
