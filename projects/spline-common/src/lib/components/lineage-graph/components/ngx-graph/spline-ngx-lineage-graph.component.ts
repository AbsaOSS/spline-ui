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
import { Node } from '@swimlane/ngx-graph'
import { Edge } from '@swimlane/ngx-graph/lib/models/edge.model'
import { CytoscapeOptions, NodeDataDefinition } from 'cytoscape'
import * as shape from 'd3-shape'

import { SplineLineageGraph } from '../../models'


@Component({
    selector: 'spline-ngx-lineage-graph',
    templateUrl: './spline-ngx-lineage-graph.component.html',
})
export class SplineNgxLineageGraphComponent<TGraphNodeData extends NodeDataDefinition> implements OnInit {

    @Input() options: CytoscapeOptions = SplineLineageGraph.DEFAULT_OPTIONS
    @Input() data: SplineLineageGraph.GraphData<TGraphNodeData>

    @Output() substrateClick$ = new EventEmitter<void>()
    @Output() nodeClick$ = new EventEmitter<{ node: SplineLineageGraph.GraphNode<TGraphNodeData> }>()
    @Output() nodeDoubleClick$ = new EventEmitter<{ node: SplineLineageGraph.GraphNode<TGraphNodeData> }>()

    curve = shape.curveBundle.beta(0);
    layoutSettings = {
        orientation: 'TB',
        marginX: 50,
        marginY: 250,
        edgePadding: 120,
    }

    nodes: Node[]
    links: Edge[]

    ngOnInit(): void {
        this.links = this.data.edges.map(item => ({
            ...item.data,
        }))
        this.nodes = this.data.nodes.map(item => ({
            id: item.data.id,
            label: item.data.name,
            type: item.data.type,
        }))
    }

    onNodeClicked($event: MouseEvent) {
        console.log($event)
    }
}
