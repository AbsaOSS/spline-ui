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

import { ScrollingModule } from '@angular/cdk/scrolling'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatTreeModule } from '@angular/material/tree'
import { RouterModule } from '@angular/router'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { SplineApiModule } from 'spline-api'
import { SplineCommonModule } from 'spline-common'
import { SplineDataViewModule } from 'spline-common/data-view'
import { DynamicFilterModule } from 'spline-common/dynamic-filter'
import { DfControlDateRangeModule, DfControlSelectModule } from 'spline-common/dynamic-filter/filter-controls'
import { DynamicTableCommonCellsModule, DynamicTableModule } from 'spline-common/dynamic-table'
import { SplineLayoutModule } from 'spline-common/layout'
import { SplineApiConfigModule } from 'spline-shared'
import { SplineDynamicTableSharedModule } from 'spline-shared/dynamic-table'
import { SplineEventsSharedModule } from 'spline-shared/events'
import { SplineTranslateModule } from 'spline-utils/translate'

import { components } from './components'
import * as fromPages from './pages'
import { services } from './services'
import { SplineDataSourcesRoutingModule } from './spline-data-sources-routing.module'
import { effects } from './store'
import { SplineDataSourceStoreNs } from './store/state-managements/spline-data-source-store.ns'


@NgModule({
    declarations: [
        ...fromPages.pageComponents,
        ...components
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
        StoreModule.forFeature(SplineDataSourceStoreNs.STORE_FEATURE_NAME, SplineDataSourceStoreNs.reducers),
        EffectsModule.forFeature(effects),
        SplineDataSourcesRoutingModule,
        SplineApiConfigModule,
        SplineDataViewModule,
        SplineApiModule,
        SplineLayoutModule,
        SplineTranslateModule.forChild({ moduleNames: ['data-sources'] }),
        SplineCommonModule,
        SplineEventsSharedModule,
        DynamicTableModule,
        DynamicTableCommonCellsModule,
        SplineDynamicTableSharedModule,
        ScrollingModule,
        DynamicFilterModule,
        DfControlSelectModule,
        DfControlDateRangeModule
    ],
    exports: [
        ...fromPages.pageComponents
    ],
    providers: [
        ...services
    ]
})
export class SplineDataSourcesModule {
}
