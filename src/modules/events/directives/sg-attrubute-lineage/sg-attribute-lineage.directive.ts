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
import { AttributeLineage } from 'spline-api'
import { SplineGraphComponent } from 'spline-common'


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
            this.applyLineageStyles(this.sgAttributeLineage, this.splineGraph.ngxGraphComponent)
        }
    }

    ngAfterViewInit(): void {
        this.applyLineageStyles(this.sgAttributeLineage, this.splineGraph.ngxGraphComponent)
    }

    private applyLineageStyles(attributeLineage: AttributeLineage | null, ngxGraphComponent: GraphComponent): void {

    }
}
