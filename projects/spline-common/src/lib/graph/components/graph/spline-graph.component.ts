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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core'
import { GraphComponent } from '@swimlane/ngx-graph'
import * as fromD3Shape from 'd3-shape'
import { Observable } from 'rxjs'

import {
    SgData,
    SgLayoutSettings,
    SgNativeNode,
    SgNodeControlEvent,
    SgNodeEvent,
    SgNodeSchema,
    SG_DEFAULT_LAYOUT_SETTINGS,
    toSgNativeNode,
} from '../../models'


@Component({
    selector: 'spline-graph',
    templateUrl: './spline-graph.component.html',
})
export class SplineGraphComponent implements OnChanges {

    @ViewChild(GraphComponent) ngxGraphComponent: GraphComponent

    @Input() graphData: SgData

    @Output() substrateClick$ = new EventEmitter<{ mouseEvent: MouseEvent }>()
    @Output() nodeClick$ = new EventEmitter<{ nodeSchema: SgNodeSchema; mouseEvent: MouseEvent }>()
    @Output() nodeEvent$ = new EventEmitter<SgNodeEvent>()
    @Output() nodeSelectionChange$ = new EventEmitter<{ nodeSchema: SgNodeSchema | null }>()

    @Input() curve: fromD3Shape.CurveFactoryLineOnly | fromD3Shape.CurveFactory = fromD3Shape.curveBasis
    @Input() layoutSettings: SgLayoutSettings = SG_DEFAULT_LAYOUT_SETTINGS

    @Input() focusNode$: Observable<string>

    @Input() set selectedNodeId(nodeId: string) {
        if (nodeId !== this._selectedNodeId) {
            this._selectedNodeId = nodeId
        }
    }

    _selectedNodeId: string

    readonly defaultNodeWidth = 350
    readonly defaultNodeHeight = 50

    nativeNodes: SgNativeNode[] = []

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.graphData && changes.graphData.currentValue) {
            const currentGraphData: SgData = changes.graphData.currentValue
            this.nativeNodes = currentGraphData.nodes.map(toSgNativeNode)
        }
    }

    onNodeEvent(node: SgNativeNode, event: SgNodeControlEvent<any>): void {
        this.nodeEvent$.emit({
            nodeSchema: node,
            event,
        })
    }

    onNodeClicked(node: SgNativeNode, mouseEvent: MouseEvent): void {
        mouseEvent.stopPropagation()

        this.selectNode(node)

        this.nodeClick$.emit({
            nodeSchema: node.schema,
            mouseEvent,
        })
    }

    onGraphClicked($event: MouseEvent): void {
        this.substrateClick$.emit({ mouseEvent: $event })
    }

    private selectNode(node: SgNativeNode): void {
        if (this._selectedNodeId !== node.id) {
            this._selectedNodeId = node.id
            this.nodeSelectionChange$.emit({ nodeSchema: node.schema })
        }
        else {
            this.clearNodeSelection()
        }
    }

    private clearNodeSelection(): void {
        this._selectedNodeId = null
        this.nodeSelectionChange$.emit({ nodeSchema: null })
    }
}
