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

import { dataSourceUriToName, OperationDetails, OperationProperties } from 'spline-api'
import { SdWidgetCard, SdWidgetRecordsList, SplineDataViewSchema } from 'spline-common'

import { SgNodeControl } from '../../sg-node-control.models'


export namespace OperationRead {

    export type Properties =
        & OperationProperties
        &
        {
            inputSources: string[]
            sourceType: string
        }

    export function toDataViewSchema(operationDetails: OperationDetails): SplineDataViewSchema {

        const properties = operationDetails.operation.properties as Properties
        return [
            SdWidgetCard.toSchema(
                {
                    ...SgNodeControl.getNodeStyles(SgNodeControl.NodeType.DataSource),
                    title: 'Input Data Sources',
                    label: properties.sourceType,
                },
                [
                    SdWidgetRecordsList.toSchema(
                        properties.inputSources
                            .map(uri => ({
                                value: dataSourceUriToName(uri),
                                description: uri,
                            })),
                    ),
                ],
            ),
        ]
    }

}
