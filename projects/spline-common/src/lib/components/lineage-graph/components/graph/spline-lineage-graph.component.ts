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

import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    Output,
    RendererFactory2,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { Core, CytoscapeOptions, NodeDataDefinition, SingularData } from 'cytoscape'
import { Subject } from 'rxjs'
import { buffer, debounceTime } from 'rxjs/operators'

import { SplineLineageGraph } from '../../models'
import { SplineLineageGraphNodeControlComponent } from '../graph-node-control/spline-lineage-graph-node-control.component'


declare let cytoscape: any


@Component({
    selector: 'spline-lineage-graph',
    templateUrl: './spline-lineage-graph.component.html',
})
export class SplineLineageGraphComponent<TGraphNodeData extends NodeDataDefinition> implements AfterViewInit, OnChanges {

    @Input() options: CytoscapeOptions = SplineLineageGraph.DEFAULT_OPTIONS
    @Input() data: SplineLineageGraph.GraphData<TGraphNodeData>

    @Output() substrateClick$ = new EventEmitter<void>()
    @Output() nodeClick$ = new EventEmitter<{ node: SplineLineageGraph.GraphNode<TGraphNodeData> }>()
    @Output() nodeDoubleClick$ = new EventEmitter<{ node: SplineLineageGraph.GraphNode<TGraphNodeData> }>()

    @ViewChild('graphContainer', { static: false, read: ElementRef }) graphContainer: ElementRef<HTMLDivElement>

    cytoscapeInstance: Core

    private nodeClicksStream$ = new Subject<{ node: SplineLineageGraph.GraphNode<TGraphNodeData> }>()

    constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
                private readonly injector: Injector,
                private readonly rendererFactory: RendererFactory2) {

        this.initNodeClicksEvents()
    }

    ngAfterViewInit(): void {
        this.cytoscapeInstance = this.createAndInitGraph(this.options, this.data)
        setTimeout(() => {
            this.initNodeControls()
        }, 100)

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
            const target = event.target
            const nodeId = this.extractNodeId(target)

            if (nodeId === null) {
                this.substrateClick$.emit()
            }
            else {
                const node = this.getNode(nodeId)
                if (node) {
                    this.nodeClicksStream$.next({ node })
                }
            }
        })

        cytoscapeInstance.nodeHtmlLabel([{
            tpl: (nodeData): string => {
                return `<div class="spline-lineage-graph__node-container" data-node-id="${nodeData.id}"></div>`
            },
        }])

        cytoscapeInstance.layout(options.layout).run()

        return cytoscapeInstance
    }

    private setGraphData(data: SplineLineageGraph.GraphData<TGraphNodeData>): void {
        this.cytoscapeInstance.elements().remove()
        this.cytoscapeInstance.add(data as any) // TODO: adjust types definition.
        this.cytoscapeInstance.layout(this.options.layout).run()
    }

    private extractNodeId(target: SingularData): string | null {
        return target?.isNode && target.isNode()
            ? target.id()
            : null
    }

    private getNode(nodeId: string): SplineLineageGraph.GraphNode<TGraphNodeData> | undefined {
        return this.data.nodes.find(currentNode => currentNode.data.id === nodeId) as SplineLineageGraph.GraphNode<TGraphNodeData>
    }

    private initNodeClicksEvents(): void {
        const doubleClickDelayInMs = 250
        const buff$ = this.nodeClicksStream$.pipe(
            debounceTime(doubleClickDelayInMs),
        )

        this.nodeClicksStream$
            .pipe(
                buffer(buff$),
            )
            .subscribe((bufferValue: Array<{ node: SplineLineageGraph.GraphNode<TGraphNodeData> }>) => {
                if (bufferValue.length === 1) {
                    this.nodeClick$.emit(bufferValue[0])
                }
                else if (bufferValue.length > 1) {
                    this.nodeDoubleClick$.emit(bufferValue[0])
                }
            })
    }

    private initNodeControls(): void {
        const modeContainersList = this.graphContainer.nativeElement.querySelectorAll('.spline-lineage-graph__node-container')
        // TODO: move that logic somewhere else.
        modeContainersList.forEach((nodeElm) => {
            const factory = this.componentFactoryResolver.resolveComponentFactory(SplineLineageGraphNodeControlComponent)
            const componentRef = factory.create(this.injector)
            componentRef.hostView.detectChanges()
            const { nativeElement } = componentRef.location
            const renderer = this.rendererFactory.createRenderer(null, null)
            renderer.appendChild(nodeElm, nativeElement)
        })
    }

}
