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

import { AttributeLineageType } from 'spline-api'
import { SplineColors } from 'spline-common'

import { SgLegend } from '../sg-legend.models'


export const LINAGE_TYPE_LEGENDS_MAP: Readonly<Record<AttributeLineageType, SgLegend>>
    = Object.freeze<Record<AttributeLineageType, SgLegend>>({
        [AttributeLineageType.Usage]: {
            title: 'EVENTS.ATTRIBUTE_LINEAGE__LEGEND__USAGE__TITLE',
            description: 'EVENTS.ATTRIBUTE_LINEAGE__LEGEND__USAGE__DESCRIPTION',
            color: SplineColors.BLACK,
        },
        [AttributeLineageType.Lineage]: {
            title: 'EVENTS.ATTRIBUTE_LINEAGE__LEGEND__LINEAGE__TITLE',
            description: 'EVENTS.ATTRIBUTE_LINEAGE__LEGEND__LINEAGE__DESCRIPTION',
            color: SplineColors.PINK,
        },
        [AttributeLineageType.Impact]: {
            title: 'EVENTS.ATTRIBUTE_LINEAGE__LEGEND__IMPACT__TITLE',
            description: 'EVENTS.ATTRIBUTE_LINEAGE__LEGEND__IMPACT__DESCRIPTION',
            color: SplineColors.GREEN,
        },
    })

export function getAttributeLineageTypeLegend(type: AttributeLineageType): SgLegend {
    return LINAGE_TYPE_LEGENDS_MAP[type]
}

