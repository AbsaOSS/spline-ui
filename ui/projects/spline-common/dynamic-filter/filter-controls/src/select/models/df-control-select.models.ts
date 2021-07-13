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

import { SplineListBox } from 'spline-common'
import { BaseDynamicFilterControlModel, DynamicFilterControlModelConfig } from 'spline-common/dynamic-filter'


export namespace DfControlSelect {

    export const TYPE = 'DfControlSelect'

    export type Value<TValue = unknown> = TValue[]

    export type Options<TRecord = unknown, TValue = unknown> = {
        label: string
        icon: string
        records: TRecord[]
        dataMap: SplineListBox.DataMap<TRecord, TValue>
    }

    export type Config<TRecord = unknown, TValue = unknown> =
        & DynamicFilterControlModelConfig<Value<TValue>, Options<TRecord, TValue>>
        &
        {
            options: Options<TRecord, TValue>
        }

    export class Model<TId = string, TRecord = unknown, TValue = unknown>
        extends BaseDynamicFilterControlModel<Value<TValue>, Options<TRecord, TValue>, TId> {
        readonly type = TYPE

        constructor(id: TId, config: Config<TRecord, TValue>) {
            super(id, config)
        }
    }

}
