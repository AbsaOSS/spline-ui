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

import { NestedTreeControl } from '@angular/cdk/tree'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { MatTreeNestedDataSource } from '@angular/material/tree'
import cloneDeep from 'lodash/cloneDeep'
import { BehaviorSubject } from 'rxjs'
import { skip, takeUntil } from 'rxjs/operators'
import { BaseComponent } from 'spline-utils'

import { TaxonomyTree } from '../../models'


@Component({
    selector: 'taxonomy-tree',
    templateUrl: './taxonomy-tree.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxonomyTreeComponent extends BaseComponent implements OnChanges, OnInit {

    @Input() initExpandLevel = 1
    @Input() tree: TaxonomyTree.TreeNode[]

    @Output() nodeClicked$ = new EventEmitter<{ node: TaxonomyTree.TreeNode }>()

    readonly NodeEntityType = TaxonomyTree.NodeEntityType
    readonly NODE_ENTITY_TYPE_INFO_MAP = { ...TaxonomyTree.NODE_ENTITY_TYPE_INFO_MAP }
    readonly treeControl = new NestedTreeControl<TaxonomyTree.TreeNode>(node => node.children)
    readonly treeDataSource = new MatTreeNestedDataSource<TaxonomyTree.TreeNode>()
    readonly searchTerm$ = new BehaviorSubject<string>('')

    constructor() {
        super()
        this.searchTerm$
            .pipe(
                skip(1),
                takeUntil(this.destroyed$)
            )
            .subscribe((searchTerm) => {
                this.treeDataSource.data = searchTerm?.length > 0
                    ? this.tree.filter(treeNode => treeNode.entity.name.toLowerCase().includes(searchTerm))
                    : this.tree
            })
    }

    @Input() set searchTerm(value: string) {
        this.searchTerm$.next(value)
    }

    hasChild = (_: number, node: TaxonomyTree.TreeNode) => !!node.children && node.children?.length > 0

    ngOnChanges(changes: SimpleChanges): void {

        const { tree, initExpandLevel } = changes

        if (tree.currentValue) {
            this.treeDataSource.data = tree.currentValue
            this.treeControl.dataNodes = tree.currentValue
        }

        if (initExpandLevel && initExpandLevel.currentValue && !initExpandLevel.isFirstChange()) {
            this.expandLevel(tree.currentValue, this.initExpandLevel)
        }
    }

    ngOnInit(): void {
        this.expandLevel(this.tree, this.initExpandLevel)
    }

    onSearch(searchTerm: string): void {
        this.searchTerm$.next(searchTerm)
    }

    onNodeClicked(node: TaxonomyTree.TreeNode): void {
        this.nodeClicked$
            .emit({
                node: cloneDeep(node)
            })
    }

    private expandLevel(tree: TaxonomyTree.TreeNode[], level: number): void {
        tree.forEach(node => {
            this.treeControl.expand(node)
            if (level > 1 && node?.children?.length) {
                this.expandLevel(node?.children, level - 1)
            }
        })
    }
}
