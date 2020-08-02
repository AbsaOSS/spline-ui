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
import { dataSourceUriToName, OperationDetails, OperationPropertiesRead } from 'spline-api'
import { SdWidgetExpansionPanel, SdWidgetRecordsList, SplineColors, SplineDataViewSchema } from 'spline-common'

import { EventOperationProperty } from '../operation-property.models'


export namespace OperationRead {

    export function toDataViewSchema(operationDetails: OperationDetails): SplineDataViewSchema {

        const properties = operationDetails.operation.properties as OperationPropertiesRead

        const defaultProps = [
            'name', 'inputSources',
        ]
        const extraPropsNative = _.omit(properties, defaultProps)
        const extraProps = EventOperationProperty.parseExtraOptions(extraPropsNative, operationDetails.schemas[0])
        return [
            SdWidgetExpansionPanel.toSchema(
                {
                    title: 'EVENTS.OPERATION__READ__READ_FROM_TITLE',
                    icon: 'database',
                    iconColor: SplineColors.ORANGE
                },
                // INPUT DATA SOURCES & EXTRA PROPS :: PRIMITIVE
                [
                    SdWidgetRecordsList.toSchema(
                        properties.inputSources
                            .map(uri => ({
                                value: dataSourceUriToName(uri),
                                description: uri,
                            })),
                        'EVENTS.OPERATION__READ__INPUT_DATA_SOURCES_TITLE',
                    ),
                    ...EventOperationProperty.primitivePropsToDvs(extraProps.primitive),
                ],
            ),
            // EXTRA PROPS :: JSON & EXPRESSION
            ...EventOperationProperty.jsonPropsToDvs(extraProps.json),
            ...EventOperationProperty.expressionPropsToDvs(extraProps.expression),
        ]
    }

}
