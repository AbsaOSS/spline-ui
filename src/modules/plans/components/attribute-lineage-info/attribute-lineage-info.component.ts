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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { AttributeLineage, AttributeSchema, evaluateAttributeLineageTypes } from 'spline-api'
import { SplineColors } from 'spline-common'
import { SgLegend } from 'spline-shared'

import { getAttributeLineageTypeLegend } from '../../models'


@Component({
    selector: 'spline-attribute-lineage-info',
    templateUrl: './attribute-lineage-info.component.html',
    styleUrls: ['./attribute-lineage-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeLineageInfoComponent {

    readonly color = SplineColors.ORANGE

    @Input() attribute: AttributeSchema

    @Input() loading = false

    @Input() set attributeLineage(value: AttributeLineage | null) {
        if (value) {
            const lineageTypes = evaluateAttributeLineageTypes(value)
            this.legendsList = lineageTypes.map(getAttributeLineageTypeLegend)
        }
        else {
            this.legendsList = []
        }
    }

    @Output() close$ = new EventEmitter<void>()

    legendsList: SgLegend[]

    onRemoveIconClicked(): void {
        this.close$.emit()
    }
}
