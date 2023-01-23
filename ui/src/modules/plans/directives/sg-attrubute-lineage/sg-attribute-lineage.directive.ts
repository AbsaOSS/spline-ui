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

import { AttributeLineageNodesMap, extractAttributeLineageNodesMap } from '../../models'


@Directive({
    selector: 'sg-container[sgAttributeLineage]'
})
export class SgAttributeLineageDirective implements OnChanges {

    @Input() sgAttributeLineage: OperationAttributeLineage | null
    @Input() splineGraph: SplineGraphComponent

    cssClassesMap = {
        [OperationAttributeLineageType.Usage]: 'sg-attribute-lineage--usage',
        [OperationAttributeLineageType.Lineage]: 'sg-attribute-lineage--lineage',
        [OperationAttributeLineageType.Impact]: 'sg-attribute-lineage--impact',
        none: 'sg-attribute-lineage--none'
    }

    get ngxGraphComponent(): GraphComponent | unknown {
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

        if (ngxGraphComponent instanceof GraphComponent && attributeLineage) {
            this.updateGraphComponent(ngxGraphComponent, attributeLineage)
        }
    }

    private updateGraphComponent(ngxGraphComponent: GraphComponent, attributeLineage: OperationAttributeLineage): void {
        const attributesNodesMap: AttributeLineageNodesMap = extractAttributeLineageNodesMap(attributeLineage)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const nodes = ngxGraphComponent.nodes
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const nodeElements = ngxGraphComponent.nodeElements as QueryList<ElementRef<HTMLElement>>

        nodes.forEach((item: Node, index) => {
            const elementRef: ElementRef<HTMLElement> = nodeElements.get(index)
            const evaluationFn = (lineageType: OperationAttributeLineageType): boolean => {
                const lineageNodesMap = attributesNodesMap[lineageType]

                return lineageNodesMap.has(item.id)
            }

            if (elementRef) {
                this.applyStylesToDomElm(elementRef, attributeLineage, evaluationFn)
            }
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const links = ngxGraphComponent.links
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const linkElements = ngxGraphComponent.linkElements as QueryList<ElementRef<HTMLElement>>
        links.forEach((item: Edge, index) => {
            const elementRef = linkElements.get(index)
            const evaluationFn = (lineageType: OperationAttributeLineageType): boolean => {
                const lineageNodesMap = attributesNodesMap[lineageType]
                const usageNodeMap = attributesNodesMap[OperationAttributeLineageType.Usage]

                switch (lineageType) {
                    case OperationAttributeLineageType.Lineage:
                        return lineageNodesMap.has(item.source) && (lineageNodesMap.has(item.target) || usageNodeMap.has(item.target))

                    case OperationAttributeLineageType.Impact:
                        return lineageNodesMap.has(item.target) && (lineageNodesMap.has(item.source) || usageNodeMap.has(item.source))

                    default:
                        return lineageNodesMap.has(item.source)
                }
            }

            if (elementRef) {
                this.applyStylesToDomElm(elementRef, attributeLineage, evaluationFn)
            }
        })
    }

    private applyStylesToDomElm(
        elementRef: ElementRef<HTMLElement>,
        attributeLineage,
        evaluationFn: (lineageType: OperationAttributeLineageType) => boolean
    ): void {
        const lineageTypesList = Object.values(OperationAttributeLineageType)

        let hasAnyType = false
        lineageTypesList
            .forEach(lineageType => {
                const refCssClassName = this.cssClassesMap[lineageType]
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
            elementRef.nativeElement.classList.remove(this.cssClassesMap.none)
        }
        else {
            elementRef.nativeElement.classList.add(this.cssClassesMap.none)
        }
    }
}
