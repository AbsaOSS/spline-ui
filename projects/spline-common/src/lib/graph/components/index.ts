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

import { SgRelationsControlComponent } from 'spline-common'

import { SgZoomControlComponent } from './control-panel/controls/zoom-control/sg-zoom-control.component'
import { SgControlPanelComponent } from './control-panel/sg-control-panel.component'
import { SplineGraphComponent } from './graph/spline-graph.component'
import { SgNodeControlComponent, SgNodeDefaultComponent } from './node-control'
import { SgNodeViewDefaultComponent } from './node-view'
import { SgToolbarComponent } from './toolbar/sg-toolbar.component'


export const splineGraphComponents: any[] = [
    SplineGraphComponent,
    SgNodeControlComponent,
    SgNodeDefaultComponent,
    SgNodeViewDefaultComponent,
    SgControlPanelComponent,
    SgZoomControlComponent,
    SgToolbarComponent,
    SgRelationsControlComponent
]

export * from './public-api'
