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

import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatTooltipModule } from '@angular/material/tooltip'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { environment } from '@env/environment'
import { SplineIconModule, SplineSearchBoxModule } from 'spline-common'
import { SplineLayoutModule } from 'spline-common/layout'
import { SplineConfigModule, SplineConfigSettings, SPLINE_CONFIG_SETTINGS } from 'spline-shared'
import { SplineAttributesSharedModule } from 'spline-shared/attributes'
import { SplineTranslateCoreModule, SplineTranslateModule } from 'spline-utils/translate'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AppNotFoundComponent } from './pages/not-found/not-found.component'


@NgModule({
    declarations: [
        AppComponent,
        AppNotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatListModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        SplineTranslateCoreModule,
        SplineTranslateModule.forChild({ moduleNames: ['shared', 'shared-attributes', 'app'] }),
        SplineLayoutModule,
        SplineSearchBoxModule,
        SplineConfigModule,
        SplineAttributesSharedModule,
        SplineIconModule
    ],
    providers: [
        {
            provide: SPLINE_CONFIG_SETTINGS,
            useFactory: (): SplineConfigSettings => {
                return {
                    configFileUri: environment.splineConfigUri,
                }
            },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
