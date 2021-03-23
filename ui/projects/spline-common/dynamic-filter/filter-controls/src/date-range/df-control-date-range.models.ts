/*
 * Copyright 2021 ABSA Group Limited
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

import moment from 'moment'
import { BaseDynamicFilterControlModel, DynamicFilterControlModelConfig } from 'spline-common/dynamic-filter'


export namespace DfControlDateRange {

    export const TYPE = 'date_range'

    export type Value = {
        dateFrom: moment.Moment
        dateTo: moment.Moment
    }

    export type Options = {}

    export type Config<TId = string> = DynamicFilterControlModelConfig<Value, Options, TId>

    export class Model<TId = string> extends BaseDynamicFilterControlModel<Value, Options, TId> {
        readonly type = TYPE
    }

}
