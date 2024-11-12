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
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatTreeModule } from '@angular/material/tree'
import { SD_WIDGET_FACTORY } from 'spline-common/data-view'
import { SplineTranslateModule } from 'spline-utils/translate'

import * as fromComponents from './components'
import { SdWidgetExpressionFactory } from './services'


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatChipsModule,
        MatDialogModule,
        MatDividerModule,
        SplineTranslateModule,
    ],
    declarations: [
        ...fromComponents.attributesTreeComponents,
    ],
    exports: [
        ...fromComponents.attributesTreeComponents,
    ],
    providers: [
        SdWidgetExpressionFactory,
        {
            provide: SD_WIDGET_FACTORY,
            useValue: SdWidgetExpressionFactory,
            multi: true,
        },
    ],
})
export class SplineExpressionSharedModule {
}
