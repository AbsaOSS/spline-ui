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

import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { RouterModule } from '@angular/router'
import { SplineCommonModule } from 'spline-common'
import { SplineTranslateModule } from 'spline-utils/translate'

import { layoutComponents } from './components'
import { layoutDirectives } from './directives'


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatSidenavModule,
        MatInputModule,
        MatIconModule,
        MatTooltipModule,
        MatCardModule,
        MatButtonModule,
        SplineCommonModule,
        SplineTranslateModule,
    ],
    declarations: [
        ...layoutComponents,
        ...layoutDirectives,
    ],
    exports: [
        ...layoutComponents,
        ...layoutDirectives,
    ]
})
export class SplineLayoutModule {

}
