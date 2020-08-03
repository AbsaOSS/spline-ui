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
import { dataSourceUriToName, OperationDetails, OperationPropertiesWrite } from 'spline-api'
import { SdWidgetExpansionPanel, SdWidgetRecordsList, SplineDataViewSchema } from 'spline-common'

import { SgNodeControl } from '../../sg-node-control.models'
import { EventOperationProperty } from '../operation-property.models'


export namespace OperationWrite {

    export function toDataViewSchema(operationDetails: OperationDetails): SplineDataViewSchema {

        const properties = operationDetails.operation.properties as OperationPropertiesWrite

        const defaultProps = [
            'name', 'outputSource',
        ]
        const extraPropsNative = _.omit(properties, defaultProps)
        const extraProps = EventOperationProperty.parseExtraOptions(extraPropsNative)
        const nodeStyles = SgNodeControl.getNodeStyles(SgNodeControl.NodeType.Write)
        return [
            SdWidgetExpansionPanel.toSchema(
                {
                    title: 'EVENTS.OPERATION__WRITE__WRITE_TO_TITLE',
                    icon: nodeStyles.icon,
                    iconColor: nodeStyles.color,
                },
                // INPUT DATA SOURCES & EXTRA PROPS :: PRIMITIVE
                [
                    SdWidgetRecordsList.toSchema(
                        [
                            {
                                value: dataSourceUriToName(properties.outputSource),
                                description: properties.outputSource,
                            },
                        ],
                        'EVENTS.OPERATION__WRITE__OUTPUT_DATA_SOURCE_TITLE',
                    ),
                    ...EventOperationProperty.primitivePropsToDvs(extraProps.primitive),
                ],
            ),
            // EXTRA PROPS :: JSON & EXPRESSION
            ...EventOperationProperty.jsonPropsToDvs(extraProps.json),
            ...EventOperationProperty.expressionPropsToDvs(extraProps.expression, operationDetails.schemasCollection),
        ]
    }

}
