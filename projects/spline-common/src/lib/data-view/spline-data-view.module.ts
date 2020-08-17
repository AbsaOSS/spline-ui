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
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RouterModule } from '@angular/router'
import { NgxJsonViewerModule } from 'ngx-json-viewer'

import { SplineCardModule, SplineDataRecordModule, SplineIconModule } from '../common'
import { SplineTranslateModule } from '../translate'

import * as fromComponents from './components'
import { SplineDataWidgetManager } from './services'


@NgModule({
    imports: [
        CommonModule,
        MatSidenavModule,
        MatInputModule,
        MatIconModule,
        MatTooltipModule,
        RouterModule,
        MatButtonModule,
        SplineDataRecordModule,
        MatCardModule,
        SplineCardModule,
        SplineTranslateModule,
        MatDividerModule,
        MatExpansionModule,
        SplineIconModule,
        NgxJsonViewerModule,
    ],
    declarations: [
        ...fromComponents.widgetComponents,
    ],
    exports: [
        ...fromComponents.widgetComponents,
    ],
    providers: [
        SplineDataWidgetManager,
    ],
})
export class SplineDataViewModule {

}
