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

import _ from 'lodash'
import { OperationDetails, OperationPropertiesFilter } from 'spline-api'
import { SdWidgetExpansionPanel, SplineDataViewSchema } from 'spline-common'
import { SdWidgetExpression } from 'spline-shared'

import { SgNodeControl } from '../../sg-node-control.models'
import { EventOperationProperty } from '../operation-property.models'
import NodeType = SgNodeControl.NodeType


export namespace OperationFilter {

    export function toDataViewSchema(operationDetails: OperationDetails): SplineDataViewSchema {

        const properties = operationDetails.operation.properties as OperationPropertiesFilter
        console.log(properties)
        const defaultProps = [
            'name', 'condition',
        ]
        const extraPropsNative = _.omit(properties, defaultProps)
        const extraProps = EventOperationProperty.parseExtraOptions(extraPropsNative)
        const nodeStyles = SgNodeControl.getNodeStyles(NodeType.Filter)

        return [
            SdWidgetExpansionPanel.toSchema(
                {
                    title: 'EVENTS.OPERATION__FILTER__FILTER_ON_TITLE',
                    icon: nodeStyles.icon,
                    iconColor: nodeStyles.color,
                },
                [
                    SdWidgetExpression.toSchema({
                        expression: properties.condition,
                        attrSchemasCollection: operationDetails.schemasCollection,
                    }),
                ],
                // INPUT DATA SOURCES & EXTRA PROPS :: PRIMITIVE
            ),
            // EXTRA PROPS :: JSON & EXPRESSION
            ...EventOperationProperty.jsonPropsToDvs(extraProps.json),
            ...EventOperationProperty.expressionPropsToDvs(extraProps.expression, operationDetails.schemasCollection),
        ]
    }

}
