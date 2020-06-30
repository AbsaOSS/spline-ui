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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import * as fromD3Shape from 'd3-shape'

import { SplineGraph } from '../../models'


@Component({
    selector: 'spline-graph',
    templateUrl: './spline-graph.component.html',
})
export class SplineGraphComponent<TGraphNodeData extends object = {}> implements OnInit {

    @Input() graphData: SplineGraph.GraphData<TGraphNodeData>

    @Output() substrateClick$ = new EventEmitter<void>()
    @Output() nodeClick$ = new EventEmitter<{ node: SplineGraph.GraphNode<TGraphNodeData> }>()

    @Input() curve: fromD3Shape.CurveFactoryLineOnly | fromD3Shape.CurveFactory = fromD3Shape.curveBundle.beta(0)
    @Input() layoutSettings: SplineGraph.LayoutSettings = SplineGraph.DEFAULT_LAYOUT_SETTINGS

    ngOnInit(): void {
    }

}
