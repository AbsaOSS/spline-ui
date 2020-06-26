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

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core'
import cytoscape, { NodeDataDefinition, SingularData } from 'cytoscape'
import klay from 'cytoscape-klay'

import { SplineLineageGraph } from './spline-lineage-graph.models'


cytoscape.use(klay)

@Component({
    selector: 'spline-lineage-graph',
    templateUrl: './spline-lineage-graph.component.html',
})
export class SplineLineageGraphComponent<TGraphNodeData extends NodeDataDefinition> implements AfterViewInit, OnChanges {

    @Input() options: cytoscape.CytoscapeOptions = SplineLineageGraph.DEFAULT_OPTIONS
    @Input() data: SplineLineageGraph.GraphData<TGraphNodeData>

    @Output() substrateClick$ = new EventEmitter<void>()
    @Output() nodeClick$ = new EventEmitter<{ node: SplineLineageGraph.GraphNode<TGraphNodeData> }>()
    @Output() nodeDoubleClick$ = new EventEmitter<{ node: SplineLineageGraph.GraphNode<TGraphNodeData> }>()

    @ViewChild('graphContainer', { static: false, read: ElementRef }) graphContainer: ElementRef<HTMLDivElement>

    cytoscapeInstance: cytoscape.Core

    ngAfterViewInit(): void {
        this.cytoscapeInstance = this.createAndInitGraph(this.options, this.data)
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data && !changes.data.isFirstChange()) {
            this.setGraphData(changes.data.currentValue)
        }
    }

    private createAndInitGraph(options: cytoscape.CytoscapeOptions, data: SplineLineageGraph.GraphData<TGraphNodeData>): cytoscape.Core {
        const cytoscapeInstance = cytoscape({
            ...options,
            container: this.graphContainer.nativeElement,
            elements: data,
        })

        cytoscapeInstance.on('mouseover', 'node', e => (e.originalEvent.target as HTMLElement).style.cursor = 'pointer')
        cytoscapeInstance.on('mouseout', 'node', e => (e.originalEvent.target as HTMLElement).style.cursor = '')

        cytoscapeInstance.on('tap', (event) => {
            console.log('tap', event)
            const target = event.target
            const nodeId = this.extractNodeId(target)

            if (nodeId === null) {
                this.substrateClick$.emit()
            }
            else {
                const node = this.getNode(nodeId)
                if (node) {
                    this.nodeClick$.emit({ node })
                }
            }
        })

        cytoscapeInstance.on('doubleTap', (event) => {
            console.log('doubleTap', event)
            const target = event.target
            const nodeId = this.extractNodeId(target)
            const node = this.getNode(nodeId)
            if (node) {
                this.nodeClick$.emit({ node })
            }

        })

        return cytoscapeInstance
    }

    private setGraphData(data: SplineLineageGraph.GraphData<TGraphNodeData>): void {
        this.cytoscapeInstance.elements().remove()
        this.cytoscapeInstance.add(data as any) // TODO: adjust types definition.
        this.cytoscapeInstance.layout(this.options.layout).run()
    }

    private extractNodeId(target: SingularData): string | null {
        return target.isNode()
            ? target.id()
            : null
    }

    private getNode(nodeId: string): SplineLineageGraph.GraphNode<TGraphNodeData> | undefined {
        return this.data.nodes.find(currentNode => currentNode.data.id === nodeId) as SplineLineageGraph.GraphNode<TGraphNodeData>
    }

}
