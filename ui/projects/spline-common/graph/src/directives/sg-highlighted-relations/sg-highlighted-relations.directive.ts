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

import { Directive, ElementRef, Input, OnChanges, QueryList, SimpleChange } from '@angular/core'
import { GraphComponent, Node } from '@swimlane/ngx-graph'
import { Edge } from '@swimlane/ngx-graph/lib/models/edge.model'

import { SplineGraphComponent } from '../../components'


@Directive({
    selector: 'spline-graph[sgHighlightedRelations]'
})
export class SgHighlightedRelationsDirective implements OnChanges {

    @Input() sgHighlightedRelations: string[] | null = null // node ids
    @Input() splineGraph: SplineGraphComponent

    get ngxGraphComponent(): GraphComponent {
        return this.splineGraph?.ngxGraphComponent
    }

    ngOnChanges(changes: { sgHighlightedRelations: SimpleChange }): void {
        const sgHighlightedRelations = changes.sgHighlightedRelations
        if (this.ngxGraphComponent && sgHighlightedRelations && !sgHighlightedRelations?.firstChange) {
            this.applyNodeStyles()
        }
    }

    private applyNodeStyles(): void {
        const highlightedNodes = this.sgHighlightedRelations
        const ngxGraphComponent = this.ngxGraphComponent
        const highlightedNodesSet = new Set<string>(highlightedNodes)

        const cssClassesMap = {
            highlighted: 'sg-node-relation--highlighted',
            hidden: 'sg-node-relation--hidden'
        }

        const cssClassesList = Object.values(cssClassesMap)

        function applyStylesToDomElm(elementRef: ElementRef<HTMLElement>,
                                     ifHighlighted: boolean | null
        ): void {
            if (elementRef) {
                // remove all styles
                if (ifHighlighted === null) {
                    cssClassesList
                        .forEach(
                            className => elementRef.nativeElement.classList.remove(className)
                        )
                }
                else {
                    elementRef.nativeElement.classList.add(ifHighlighted ? cssClassesMap.highlighted : cssClassesMap.hidden)
                    elementRef.nativeElement.classList.remove(!ifHighlighted ? cssClassesMap.highlighted : cssClassesMap.hidden)
                }
            }
        }

        ngxGraphComponent.nodes.forEach((item: Node, index) =>
            applyStylesToDomElm(
                (ngxGraphComponent.nodeElements as QueryList<ElementRef<HTMLElement>>).get(index),
                highlightedNodes ? highlightedNodesSet.has(item.id) : null
            )
        )

        ngxGraphComponent.links.forEach((item: Edge, index) =>
            applyStylesToDomElm(
                (ngxGraphComponent.linkElements as QueryList<ElementRef<HTMLElement>>).get(index),
                highlightedNodes ? highlightedNodesSet.has(item.source) && highlightedNodesSet.has(item.target) : null
            )
        )
    }

}
