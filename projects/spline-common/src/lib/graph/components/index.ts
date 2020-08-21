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

import { SgControlPanelComponent } from './control-panel/sg-control-panel.component'
import { SgNodeDefaultComponent, SplineGraphNodeControlComponent } from './graph-node-control'
import { SgNodeViewDefaultComponent } from './graph-node-view'
import { SplineGraphComponent } from './graph/spline-graph.component'
import { SgZoomControlComponent } from './zoom-control/sg-zoom-control.component'


export const splineGraphComponents: any[] = [
    SplineGraphComponent,
    SplineGraphNodeControlComponent,
    SgNodeDefaultComponent,
    SgNodeViewDefaultComponent,
    SgControlPanelComponent,
    SgZoomControlComponent,
]

export * from './public-api'
