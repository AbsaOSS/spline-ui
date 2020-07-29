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


import { AfterViewInit, Directive, forwardRef, Host, Inject, Input, OnChanges, SimpleChanges } from '@angular/core'
import { GraphComponent } from '@swimlane/ngx-graph'
import { AttributeLineage, AttributeLineageType } from 'spline-api'
import { SplineGraphComponent } from 'spline-common'

import { extractAttributeLineageNodesMap } from '../../models/attribute'


@Directive({
    selector: 'spline-graph[sgAttributeLineage]',
})
export class SgAttributeLineageDirective implements AfterViewInit, OnChanges {

    @Input() sgAttributeLineage: AttributeLineage | null

    constructor(
        @Host() @Inject(forwardRef(() => SplineGraphComponent)) private splineGraph: SplineGraphComponent,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.sgAttributeLineage && !changes.sgAttributeLineage.isFirstChange()) {
            this.applyLineageStyles(changes.sgAttributeLineage.currentValue, this.splineGraph.ngxGraphComponent)
        }
    }

    ngAfterViewInit(): void {
        this.applyLineageStyles(this.sgAttributeLineage, this.splineGraph.ngxGraphComponent)
    }

    private applyLineageStyles(attributeLineage: AttributeLineage | null, ngxGraphComponent: GraphComponent): void {
        const attributesLineageNodesMap = extractAttributeLineageNodesMap(attributeLineage)

        const cssClassesMap = {
            [AttributeLineageType.Usage]: 'sg-attribute-lineage--usage',
            [AttributeLineageType.Lineage]: 'sg-attribute-lineage--lineage',
            [AttributeLineageType.Impact]: 'sg-attribute-lineage--impact',
            none: 'sg-attribute-lineage--none',
        }

        const lineageTypesList = Object.values(AttributeLineageType)

        function applyStylesToDomElm(selector: string,
                                     rootElmRef: HTMLElement,
                                     evaluationFn: (lineageType: AttributeLineageType) => boolean,
        ): void {
            const elementRef = rootElmRef.querySelector(selector)
            if (elementRef) {
                let hasAnyType = false
                lineageTypesList
                    .forEach(lineageType => {
                        const refCssClassName = cssClassesMap[lineageType]
                        if (evaluationFn(lineageType)) {
                            elementRef.classList.add(refCssClassName)
                            hasAnyType = true
                        }
                        else {
                            elementRef.classList.remove(refCssClassName)
                        }
                    })

                // no type styles
                if (hasAnyType || attributeLineage === null) {
                    elementRef.classList.remove(cssClassesMap.none)
                }
                else {
                    elementRef.classList.add(cssClassesMap.none)
                }
            }
        }

        ngxGraphComponent.nodes
            .forEach(item =>
                applyStylesToDomElm(
                    `[id="${item.id}"]`,
                    ngxGraphComponent.chart.nativeElement,
                    (lineageType) => attributesLineageNodesMap[lineageType].has(item.id),
                ),
            )

        ngxGraphComponent.links
            .forEach(item =>
                applyStylesToDomElm(
                    `#${item.id}.link-group`,
                    ngxGraphComponent.chart.nativeElement,
                    (lineageType) => {
                        switch (lineageType) {
                            case AttributeLineageType.Lineage:
                                return attributesLineageNodesMap[lineageType].has(item.source)
                                    && (
                                        attributesLineageNodesMap[lineageType].has(item.target)
                                        || attributesLineageNodesMap[AttributeLineageType.Usage].has(item.target)
                                    )

                            case AttributeLineageType.Impact:
                                return attributesLineageNodesMap[lineageType].has(item.target)
                                    && (
                                        attributesLineageNodesMap[lineageType].has(item.source)
                                        || attributesLineageNodesMap[AttributeLineageType.Usage].has(item.source)
                                    )

                            default:
                                return attributesLineageNodesMap[lineageType].has(item.source)
                        }
                    },
                ),
            )
    }
}
