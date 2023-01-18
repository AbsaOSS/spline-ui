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
import { Edge, GraphComponent, Node } from '@swimlane/ngx-graph'
import { OperationAttributeLineage, OperationAttributeLineageType } from 'spline-api'
import { SplineGraphComponent } from 'spline-common/graph'

import { extractAttributeLineageNodesMap } from '../../models/attribute'


@Directive({
    selector: 'sg-container[sgAttributeLineage]'
})
export class SgAttributeLineageDirective implements OnChanges {

    @Input() sgAttributeLineage: OperationAttributeLineage | null
    @Input() splineGraph: SplineGraphComponent

    get ngxGraphComponent(): GraphComponent {
        return this.splineGraph?.ngxGraphComponent
    }

    ngOnChanges(changes: { sgAttributeLineage: SimpleChange }): void {
        const sgAttributeLineage = changes.sgAttributeLineage
        if (this.ngxGraphComponent && sgAttributeLineage && !sgAttributeLineage?.firstChange) {
            this.applyLineageStyles()
        }
    }

    private applyLineageStyles(): void {
        const attributeLineage: OperationAttributeLineage | null = this.sgAttributeLineage
        const ngxGraphComponent = this.ngxGraphComponent
        const attributesLineageNodesMap = extractAttributeLineageNodesMap(attributeLineage)

        const cssClassesMap = {
            [OperationAttributeLineageType.Usage]: 'sg-attribute-lineage--usage',
            [OperationAttributeLineageType.Lineage]: 'sg-attribute-lineage--lineage',
            [OperationAttributeLineageType.Impact]: 'sg-attribute-lineage--impact',
            none: 'sg-attribute-lineage--none'
        }

        const lineageTypesList = Object.values(OperationAttributeLineageType)

        function applyStylesToDomElm(elementRef: ElementRef<HTMLElement>,
                                     evaluationFn: (lineageType: OperationAttributeLineageType) => boolean
        ): void {
            if (elementRef) {
                let hasAnyType = false
                lineageTypesList
                    .forEach(lineageType => {
                        const refCssClassName = cssClassesMap[lineageType]
                        if (evaluationFn(lineageType)) {
                            elementRef.nativeElement.classList.add(refCssClassName)
                            hasAnyType = true
                        }
                        else {
                            elementRef.nativeElement.classList.remove(refCssClassName)
                        }
                    })

                // no type styles
                if (hasAnyType || attributeLineage === null) {
                    elementRef.nativeElement.classList.remove(cssClassesMap.none)
                }
                else {
                    elementRef.nativeElement.classList.add(cssClassesMap.none)
                }
            }
        }

        ngxGraphComponent.nodes.forEach((item: Node, index) =>
            applyStylesToDomElm(
                (ngxGraphComponent.nodeElements as QueryList<ElementRef<HTMLElement>>).get(index),
                (lineageType) => attributesLineageNodesMap[lineageType].has(item.id)
            )
        )

        ngxGraphComponent.links.forEach((item: Edge, index) =>
            applyStylesToDomElm(
                (ngxGraphComponent.linkElements as QueryList<ElementRef<HTMLElement>>).get(index),
                (lineageType) => {
                    switch (lineageType) {
                        case OperationAttributeLineageType.Lineage:
                            return attributesLineageNodesMap[lineageType].has(item.source)
                                   && (
                                       attributesLineageNodesMap[lineageType].has(item.target)
                                       || attributesLineageNodesMap[OperationAttributeLineageType.Usage].has(item.target)
                                   )

                        case OperationAttributeLineageType.Impact:
                            return attributesLineageNodesMap[lineageType].has(item.target)
                                   && (
                                       attributesLineageNodesMap[lineageType].has(item.source)
                                       || attributesLineageNodesMap[OperationAttributeLineageType.Usage].has(item.source)
                                   )

                        default:
                            return attributesLineageNodesMap[lineageType].has(item.source)
                    }
                }
            )
        )
    }
}
