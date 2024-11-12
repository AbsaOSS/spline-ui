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
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
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
import { SplineCommonModule, SplineListBoxModule } from 'spline-common'
import { SplineDataViewModule } from 'spline-common/data-view'
import { DynamicFilterModule } from 'spline-common/dynamic-filter'
import { DfControlDateRangeModule, DfControlSelectModule } from 'spline-common/dynamic-filter/filter-controls'
import { DynamicTableCommonCellsModule, DynamicTableModule } from 'spline-common/dynamic-table'
import { SplineGraphModule } from 'spline-common/graph'
import { SplineLayoutModule } from 'spline-common/layout'
import { SplineApiConfigModule } from 'spline-shared'
import { SplineAttributesSharedModule } from 'spline-shared/attributes'
import { SplineDynamicTableSharedModule } from 'spline-shared/dynamic-table'
import { SplineExpressionSharedModule } from 'spline-shared/expression'
import { SplineGraphSharedModule } from 'spline-shared/graph'
import { SplineTranslateModule } from 'spline-utils/translate'

import * as fromComponents from './components'
import * as fromPages from './pages'
import { SplineEventsRoutingModule } from './spline-events-routing.module'
import { EventOverviewStore } from './store'


@NgModule({
    declarations: [
        ...fromPages.pageComponents,
        ...fromComponents.components
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
        MatSlideToggleModule,
        SplineEventsRoutingModule,
        SplineApiConfigModule,
        SplineApiModule,
        SplineLayoutModule,
        SplineTranslateModule.forChild({
            moduleNames: ['events']
        }),
        SplineGraphModule,
        SplineAttributesSharedModule,
        SplineDataViewModule,
        SplineExpressionSharedModule,
        SplineCommonModule,
        SplineGraphSharedModule,
        DynamicTableModule,
        DynamicTableCommonCellsModule,
        SplineDynamicTableSharedModule,
        SplineListBoxModule,
        DynamicFilterModule,
        DfControlSelectModule,
        DfControlDateRangeModule
    ],
    exports: [
        ...fromPages.pageComponents
    ],
    providers: [
        EventOverviewStore
    ]
})
export class SplineEventsModule {
}
