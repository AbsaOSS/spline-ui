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
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTooltipModule } from '@angular/material/tooltip'
import { SplineCommonModule } from 'spline-common'
import { DynamicTableModule } from 'spline-common/dynamic-table'
import { SplineTranslateModule } from 'spline-utils/translate'

import { splineDtSharedComponents } from './components'


@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatTooltipModule,
        MatPaginatorModule,
        DynamicTableModule,
        SplineCommonModule,
        SplineTranslateModule.forChild({}),
        MatAutocompleteModule
    ],
    providers: [],
    declarations: [
        ...splineDtSharedComponents
    ],
    exports: [
        ...splineDtSharedComponents
    ]
})
export class SplineDynamicTableSharedModule {

}
