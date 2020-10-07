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

import { DataSourceInfo, ExecutionPlan } from 'spline-api'
import { SdWidgetCard, SdWidgetSchema, SdWidgetSimpleRecord, SplineColors, SplineDataViewSchema } from 'spline-common'
import { SgNodeControl } from 'spline-shared'


export namespace PlanInfo {

    import getNodeStyles = SgNodeControl.getNodeStyles


    export function toDataViewSchema(data: ExecutionPlan): SplineDataViewSchema {
        return [
            SdWidgetCard.toSchema(
                {
                    color: SplineColors.ORANGE,
                    icon: 'cog-transfer-outline',
                    title: data?.extraInfo?.appName ? data?.extraInfo?.appName : 'PLANS.PLAN_INFO__DEFAULT_NAME',
                    iconTooltip: 'PLANS.PLAN_INFO__LABEL',
                },
                [
                    SdWidgetSimpleRecord.toSchema([
                        {
                            label: 'PLANS.PLAN_INFO__DETAILS__SYSTEM_INFO',
                            value: `${data.systemInfo.name} ${data.systemInfo.version}`,
                        },
                        {
                            label: 'PLANS.PLAN_INFO__DETAILS__AGENT_INFO',
                            value: `${data.agentInfo.name} ${data.agentInfo.version}`,
                        },
                    ]),
                ],
            ),
        ]
    }

    export function getInputsDataViewSchema(data: ExecutionPlan): SplineDataViewSchema {
        return data.inputDataSources.map(dataSourceInfoToDataViewSchema)
    }

    export function getOutputDataViewSchema(data: ExecutionPlan): SplineDataViewSchema {
        const dataSourceInfo = data.outputDataSource
        return dataSourceInfoToDataViewSchema(dataSourceInfo)
    }

    function dataSourceInfoToDataViewSchema(dataSourceInfo: DataSourceInfo): SdWidgetSchema {
        return SdWidgetCard.toSchema(
            {
                ...getNodeStyles(SgNodeControl.NodeType.DataSource),
                title: dataSourceInfo.name,
                iconTooltip: dataSourceInfo.type
            },
            [
                SdWidgetSimpleRecord.toSchema([
                    {
                        label: 'URI',
                        value: dataSourceInfo.uri,
                    },
                ]),
            ],
        )
    }
}
