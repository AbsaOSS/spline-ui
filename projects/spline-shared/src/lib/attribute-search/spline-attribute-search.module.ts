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
import { NgModule } from '@angular/core'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { SplineApiExecutionEventModule } from 'spline-api'
import { SplineLoaderModule, SplineSearchBoxModule, SplineTranslateModule } from 'spline-common'

import { SplineAttributesModule } from '../attributes'
import { SplineApiConfigModule } from '../spline-api-config'

import * as fromComponents from './components'


@NgModule({
    imports: [
        CommonModule,
        MatAutocompleteModule,
        SplineSearchBoxModule,
        SplineApiConfigModule,
        SplineApiExecutionEventModule,
        SplineTranslateModule.forChild({ moduleNames: ['events'] }),
        SplineLoaderModule,
        SplineAttributesModule,
    ],
    declarations: [
        ...fromComponents.attributeSearchComponents,
    ],
    exports: [
        ...fromComponents.attributeSearchComponents,
    ],
})
export class SplineAttributeSearchModule {
}