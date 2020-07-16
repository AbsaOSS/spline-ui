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

import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RouterModule } from '@angular/router'
import { SplineApiModule } from 'spline-api'
import {
    SplineContentErrorModule,
    SplineDataRecordModule,
    SplineDataWidgetModule,
    SplineGraphModule,
    SplineLabelModule,
    SplineLayoutModule,
    SplineLoaderModule,
    SplineSidePanelModule,
    SplineSortHeaderModule,
    SplineTranslateModule,
} from 'spline-common'
import { SplineApiConfigModule } from 'spline-shared'


import * as fromComponents from './components'
import { EventsRoutingModule } from './events-routing.module'
import * as fromPages from './pages'


@NgModule({
    declarations: [
        ...fromPages.pageComponents,
        ...fromComponents.components,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        EventsRoutingModule,
        MatTableModule,
        MatSortModule,
        MatTooltipModule,
        SplineApiConfigModule,
        SplineApiModule,
        SplineLayoutModule,
        SplineLoaderModule,
        SplineContentErrorModule,
        SplineSortHeaderModule,
        MatPaginatorModule,
        RouterModule,
        SplineGraphModule,
        MatDividerModule,
        MatCardModule,
        MatIconModule,
        SplineSidePanelModule,
        SplineLabelModule,
        SplineTranslateModule.forChild({ moduleNames: ['events'] }),
        SplineDataRecordModule,
        SplineDataWidgetModule,
    ],
    exports: [
        ...fromPages.pageComponents,
    ],
    providers: [],
})
export class EventsModule {
}
