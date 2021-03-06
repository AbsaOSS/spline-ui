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
import { RouterModule, Routes } from '@angular/router'
import { SplineFakePageContentComponent } from 'spline-common/layout'

import { DataSourceOverviewPageComponent, DataSourcesListPageComponent, DsOverviewHistoryPageComponent } from './pages'


const routes: Routes = [
    {
        path: 'list',
        component: DataSourcesListPageComponent,
    },
    {
        path: 'overview/:dataSourceId',
        component: DataSourceOverviewPageComponent,
        children: [
            {
                path: 'history',
                component: DsOverviewHistoryPageComponent,
            },
            {
                path: 'overview',
                component: SplineFakePageContentComponent
            },
            {
                path: 'impact',
                component: SplineFakePageContentComponent,
            },
            {
                path: 'lineage',
                component: SplineFakePageContentComponent,
            },
            {
                path: '',
                redirectTo: 'history',
                pathMatch: 'full',
            },
            {
                path: '**',
                redirectTo: '/404',
            },
        ]
    },

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
    },
    {
        path: '**',
        redirectTo: '/404',
    },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class SplineDataSourcesRoutingModule {
}
