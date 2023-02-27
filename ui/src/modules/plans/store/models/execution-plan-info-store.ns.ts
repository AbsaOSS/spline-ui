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

import _ from 'lodash'
import { Observable } from 'rxjs'
import { ExecutionPlan } from 'spline-api'
import { SplineDataViewSchema } from 'spline-common/data-view'

import { attributesSchemaToDataViewSchema } from '../../models'
import { PlanInfoService } from '../../models/plan/plan-info.service'


export namespace ExecutionPlanInfoStoreNs {

    //TODO: refactor namespace to service class and remove new keyword
    const planInfoService: PlanInfoService = new PlanInfoService()

    export type State = {
        executionPlan: ExecutionPlan
        executionPlanVs: SplineDataViewSchema
        inputsVs: SplineDataViewSchema
        outputVs: SplineDataViewSchema
        outputAndInputsVs: SplineDataViewSchema
        attributesSchema: SplineDataViewSchema
        inputsNumber: number
    }

    export function toState(executionPlan: ExecutionPlan, selectedAttributeId$: Observable<string | null>): State {
        const allAttributesSorted = _.sortBy(executionPlan.extraInfo.attributes, a => a.name)
        const allDataTypes = executionPlan.extraInfo.dataTypes
        return {
            executionPlan: executionPlan,
            executionPlanVs: planInfoService.toDataViewSchema(executionPlan),
            inputsVs: planInfoService.getInputsDataViewSchema(executionPlan),
            outputVs: planInfoService.getOutputDataViewSchema(executionPlan),
            outputAndInputsVs: planInfoService.getOutputAndInputsDvs(executionPlan),
            inputsNumber: executionPlan.inputDataSources.length,
            attributesSchema: attributesSchemaToDataViewSchema(
                allAttributesSorted,
                allDataTypes,
                selectedAttributeId$
            )
        }
    }

}
