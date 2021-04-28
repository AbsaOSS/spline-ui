/*
 * Copyright 2021 ABSA Group Limited
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

import { Component, OnInit } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/internal/operators'
import { SplineTaxonomyFacade } from 'spline-api'
import { SlBreadcrumbs } from 'spline-common/layout'
import { BaseLocalStateComponent } from 'spline-utils'

import { TaxonomyTree } from '../../models'

import { TaxonomyTreePage } from './taxonomy-tree.page.models'


@Component({
    selector: 'taxonomy-tree-page',
    templateUrl: './taxonomy-tree.page.component.html',
    styleUrls: ['./taxonomy-tree.page.component.scss'],
})
export class TaxonomyTreePageComponent extends BaseLocalStateComponent<TaxonomyTreePage.State> implements OnInit {

    readonly breadcrumbs$: Observable<SlBreadcrumbs.Breadcrumbs>
    readonly taxonomyTree$: Observable<TaxonomyTree.TreeNode[]>

    selectedNode: TaxonomyTree.TreeNode = null

    constructor(protected readonly splineTaxonomyFacade: SplineTaxonomyFacade) {
        super()
        this.updateState(
            TaxonomyTreePage.getDefaultState()
        )

        this.breadcrumbs$ = of([
            {
                label: 'Taxonomy'
            },
            {
                label: 'Tree'
            },
        ])

        this.taxonomyTree$ = this.splineTaxonomyFacade.fetchTree()
            .pipe(
                map(voltronTree => TaxonomyTree.createTreeFromVoltronTree(voltronTree))
            )
    }

    ngOnInit(): void {

    }

    onSideDialogClosed(): void {
        this.selectedNode = null
    }

    onNodeClicked($event: { node: TaxonomyTree.TreeNode }): void {
        this.selectedNode = $event.node
    }
}
