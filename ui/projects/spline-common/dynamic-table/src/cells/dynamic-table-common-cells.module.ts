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

import { DynamicTableModule } from '../core'

import { DtCellDateTimeModule } from './date-time'
import { DtCellLabelModule } from './label'
import { DtCellLinkModule } from './link'
import { DtCellLongTextModule } from './long-text'


@NgModule({
    imports: [
        CommonModule,
        DynamicTableModule,
        DtCellLongTextModule,
        DtCellLinkModule,
        DtCellDateTimeModule,
        DtCellLabelModule,
    ],
    exports: [
        DtCellLongTextModule,
        DtCellLinkModule,
        DtCellDateTimeModule,
        DtCellLabelModule,
    ]
})
export class DynamicTableCommonCellsModule {

}
