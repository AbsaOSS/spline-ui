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

import { NestedTreeControl } from '@angular/cdk/tree'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { BaseComponent } from 'spline-utils'

import { SplineAttributesTree } from '../../models'


@Component({
    selector: 'spline-attributes-tree',
    templateUrl: './spline-attributes-tree.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplineAttributesTreeComponent extends BaseComponent implements OnChanges {

    @Input() attributesTree: SplineAttributesTree.Tree
    @Input() selectedAttributeId: string

    @Output() selectedAttributeChanged$ = new EventEmitter<{ attributeId: string }>()

    treeControl = new NestedTreeControl<SplineAttributesTree.TreeRecord>(node => node.children)
    treeDataSource = new MatTreeNestedDataSource<SplineAttributesTree.TreeRecord>()

    constructor() {
        super()
    }

    hasChild = (_: number, node: SplineAttributesTree.TreeRecord) => !!node.children && node.children.length > 0

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.attributesTree?.currentValue) {
            this.treeDataSource.data = changes.attributesTree.currentValue
        }
    }

    onHighlightBtnClicked(nodeId: string): void {
        this.selectedAttributeId = nodeId
        this.selectedAttributeChanged$.emit({
            attributeId: nodeId
        })
    }
}
