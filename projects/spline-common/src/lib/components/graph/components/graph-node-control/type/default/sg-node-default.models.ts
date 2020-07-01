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

import { SgNodeSchema } from '../../../../models'


export namespace SgNodeDefault {

    export type Data = {
        label: string
        icon?: string
        color?: string // valid CSS color
    }

    export type Options = {}

    export function toSchema(id: string, nodeData: Data): SgNodeSchema<Data, Options> {
        return {
            id,
            data: {
                ...nodeData,
            },
        }
    }

    export function decorateDefaultSchema(schema: SgNodeSchema<any>): SgNodeSchema<any> {
        return {
            ...schema,
            data: {
                label: schema.id,
                ...(schema?.data ?? {}),
            },
        }
    }
}
