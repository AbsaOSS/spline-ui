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

import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatTooltipModule } from '@angular/material/tooltip'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { environment } from '@env/environment'
import { EffectsModule } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { MetaReducer, StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { storeFreeze } from 'ngrx-store-freeze'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material'
import { SplineIconModule, SplineSearchBoxModule } from 'spline-common'
import { SplineLayoutModule } from 'spline-common/layout'
import { SplineConfigModule, SplineConfigSettings, SPLINE_CONFIG_SETTINGS } from 'spline-shared'
import { SplineAttributesSharedModule } from 'spline-shared/attributes'
import { SplineUtilsCommonModule } from 'spline-utils'
import {
    COMMON_ASSETS,
    SplineTranslateCoreModule,
    SplineTranslateModule,
    SPLINE_TRANSLATE_COMMON_ASSETS,
    toAssetsFilePath
} from 'spline-utils/translate'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SplineSidebarMenuComponent } from './components'
import { AppNotFoundComponent } from './pages/not-found/not-found.component'


export const metaReducers: MetaReducer<any>[] =
    !environment.production
        ? [storeFreeze]
        : []

@NgModule({
    declarations: [
        AppComponent,
        AppNotFoundComponent,
        SplineSidebarMenuComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatListModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        StoreModule.forRoot({}, { metaReducers }),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router'
        }),
        SplineTranslateCoreModule,
        SplineTranslateModule.forChild({ moduleNames: ['app'] }),
        SplineLayoutModule,
        SplineSearchBoxModule,
        SplineConfigModule,
        SplineAttributesSharedModule,
        SplineIconModule,
        SplineUtilsCommonModule,
        NgxDaterangepickerMd.forRoot(),
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
        {
            provide: SPLINE_TRANSLATE_COMMON_ASSETS,
            useValue: [
                ...COMMON_ASSETS,
                toAssetsFilePath('shared'),
                toAssetsFilePath('shared-graph'),
                toAssetsFilePath('shared-attributes'),
                toAssetsFilePath('shared-data-view'),
                toAssetsFilePath('shared-dynamic-table'),
                toAssetsFilePath('shared-expression'),
                toAssetsFilePath('common-graph'),
            ]
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
