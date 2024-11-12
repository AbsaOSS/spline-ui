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

import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatTreeModule } from '@angular/material/tree'
import { SplineApiModule } from 'spline-api'
import { SplineDividerModule, SplineIconModule, SplineLoaderModule, SplineSearchBoxModule } from 'spline-common'
import { SD_WIDGET_FACTORY } from 'spline-common/data-view'
import { SplineApiConfigModule } from 'spline-shared'
import { SplineTranslateModule } from 'spline-utils/translate'

import * as fromComponents from './components'
import { SdWidgetAttributesTreeFactory } from './services/sd-widget-attributes-tree.factory'


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatAutocompleteModule,
        SplineTranslateModule,
        SplineSearchBoxModule,
        SplineDividerModule,
        SplineLoaderModule,
        SplineApiConfigModule,
        SplineApiModule,
        SplineIconModule
    ],
    declarations: [
        ...fromComponents.attributesComponents
    ],
    exports: [
        ...fromComponents.attributesComponents
    ],
    providers: [
        SdWidgetAttributesTreeFactory,
        {
            provide: SD_WIDGET_FACTORY,
            useValue: SdWidgetAttributesTreeFactory,
            multi: true
        }
    ]
})
export class SplineAttributesSharedModule {}
