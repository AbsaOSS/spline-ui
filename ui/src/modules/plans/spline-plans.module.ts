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
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatSortModule } from '@angular/material/sort'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatTreeModule } from '@angular/material/tree'
import { RouterModule } from '@angular/router'
import { SplineApiModule } from 'spline-api'
import { SplineCommonModule } from 'spline-common'
import { SplineDataViewModule } from 'spline-common/data-view'
import { SplineGraphModule } from 'spline-common/graph'
import { SplineLayoutModule } from 'spline-common/layout'
import { SplineApiConfigModule } from 'spline-shared'
import { SplineAttributesSharedModule } from 'spline-shared/attributes'
import { SplineExpressionSharedModule } from 'spline-shared/expression'
import { SplineGraphSharedModule } from 'spline-shared/graph'
import { SplineTranslateModule } from 'spline-utils/translate'

import * as fromComponents from './components'
import * as fromDirectives from './directives'
import * as fromPages from './pages'
import { SplinePlansRoutingModule } from './spline-plans-routing.module'
import { PlanInfoModule } from './models/plan/plan-info.module'


@NgModule({
    declarations: [
        ...fromPages.pageComponents,
        ...fromComponents.components,
        ...fromDirectives.directives
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        MatTableModule,
        MatSortModule,
        MatTooltipModule,
        MatDividerModule,
        MatPaginatorModule,
        MatCardModule,
        MatIconModule,
        MatTreeModule,
        MatButtonModule,
        MatTabsModule,
        MatInputModule,
        MatMenuModule,
        MatChipsModule,
        SplinePlansRoutingModule,
        SplineApiConfigModule,
        SplineApiModule,
        SplineLayoutModule,
        SplineTranslateModule.forChild({
            moduleNames: [
                'plans'
            ]
        }),
        SplineGraphModule,
        SplineAttributesSharedModule,
        SplineDataViewModule,
        SplineExpressionSharedModule,
        SplineCommonModule,
        SplineGraphSharedModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDialogModule,
        PlanInfoModule
    ],
    exports: [
        ...fromPages.pageComponents
    ],
    providers: []
})
export class SplinePlansModule {
}
