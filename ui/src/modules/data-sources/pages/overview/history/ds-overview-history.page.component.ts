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

import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { takeUntil, withLatestFrom } from 'rxjs/internal/operators'
import { filter } from 'rxjs/operators'
import { ExecutionEventFacade, SplineDataSourceInfo } from 'spline-api'
import { BaseComponent } from 'spline-utils'

import { DsStateHistoryDataSource } from '../../../data-sources'
import { DsStateHistoryDtSchema } from '../../../dynamic-table'
import { DsOverviewStoreFacade } from '../../../services'


@Component({
    selector: 'data-sources-overview-history-page',
    templateUrl: './ds-overview-history.page.component.html',
    styleUrls: ['./ds-overview-history.page.component.scss'],
    providers: [
        {
            provide: DsStateHistoryDataSource,
            useFactory: (executionEventFacade: ExecutionEventFacade) => {
                return new DsStateHistoryDataSource(executionEventFacade)
            },
            deps: [ExecutionEventFacade],
        },
    ],

})
export class DsOverviewHistoryPageComponent extends BaseComponent {

    readonly dataMap = DsStateHistoryDtSchema.getSchema()
    readonly dataSourceInfo$: Observable<SplineDataSourceInfo>

    constructor(readonly dataSource: DsStateHistoryDataSource,
                private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                private readonly store: DsOverviewStoreFacade) {
        super()

        this.dataSourceInfo$ = this.store.dataSourceInfo$

        this.store.isInitialized$
            .pipe(
                takeUntil(this.destroyed$),
                withLatestFrom(this.store.dataSourceInfo$),
                filter(([isInitialized, dataSourceInfo]) => isInitialized && !!dataSourceInfo),
            )
            .subscribe(([isInitialized, dataSourceInfo]) => {
                this.dataSource.updateAndApplyDefaultSearchParams({
                    filter: {
                        dataSourceUri: dataSourceInfo.uri
                    }
                })
            })
    }
}
