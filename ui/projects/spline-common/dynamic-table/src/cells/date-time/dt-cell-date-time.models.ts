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

import { DtCellLayout, DtCellValueSchema, TCellValue } from '../../core'


export namespace DtCellDateTime {

    export const TYPE = 'DateTime'

    export type Value = string | Date

    export type Options = {
        dateFormat: string
        secondaryDateFormat?: string
    }

    export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd'
    export const DEFAULT_SECONDARY_DATE_FORMAT = 'HH:mm:ss'

    export const DEFAULT_OPTIONS: Readonly<Options> = Object.freeze<Options>({
        dateFormat: DEFAULT_DATE_FORMAT,
        secondaryDateFormat: DEFAULT_SECONDARY_DATE_FORMAT
    })

    export const DEFAULT_LAYOUT: Readonly<DtCellLayout> = Object.freeze<DtCellLayout>({
        styles: {
            justifyContent: 'center',
            maxWidth: '160px'
        }
    })

    export function getColSchema(value: TCellValue<Value>, options?: Options): Partial<DtCellValueSchema<Value>> {
        return {
            type: TYPE,
            value,
            options
        }
    }

    export function getDefaultColSchema(): Partial<DtCellValueSchema<Value>> {
        return {
            type: TYPE,
            options: { ...DEFAULT_OPTIONS },
            layout: { ...DEFAULT_LAYOUT }
        }
    }

}
