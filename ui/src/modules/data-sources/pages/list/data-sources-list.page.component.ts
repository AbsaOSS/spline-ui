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

import { Component, OnDestroy, OnInit } from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { ExecutionEventApiService, ExecutionEventsQuery } from 'spline-api'
import { DynamicFilterFactory, DynamicFilterModel } from 'spline-common/dynamic-filter'
import { DynamicFilterStoreExtras, SplineConfigApiService } from 'spline-shared'
import { BaseComponent } from 'spline-utils'

import { SplineDataSourcesFactoryStore } from '../../data-sources'
import { DataSourcesListDtSchema } from '../../dynamic-table'

import { DataSourcesListPageConfig } from './data-sources-list.page-config'


@Component({
    selector: 'data-sources-list-page',
    templateUrl: './data-sources-list.page.component.html',
    styleUrls: ['./data-sources-list.page.component.scss'],
    providers: [
        {
            provide: SplineDataSourcesFactoryStore,
            useFactory: (
                executionEventApiService: ExecutionEventApiService,
                configApiService: SplineConfigApiService
            ) => {
                return new SplineDataSourcesFactoryStore(executionEventApiService, configApiService)
            },
            deps: [
                ExecutionEventApiService,
                SplineConfigApiService
            ]
        }
    ]
})
export class DataSourcesListPageComponent extends BaseComponent implements OnDestroy, OnInit {

    readonly dataMap = DataSourcesListDtSchema.getSchema()

    filterModel: DynamicFilterModel<DataSourcesListPageConfig.Filter>

    constructor(readonly dataSource: SplineDataSourcesFactoryStore,
                private readonly dynamicFilterFactory: DynamicFilterFactory
    ) {
        super()
    }

    ngOnInit(): void {
        this.dynamicFilterFactory
            .schemaToModel<DataSourcesListPageConfig.Filter>(
                DataSourcesListPageConfig.getDynamicFilterSchema()
            )
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe(model => {
                this.filterModel = model
                DynamicFilterStoreExtras.bindDynamicFilter<ExecutionEventsQuery.QueryFilter, DataSourcesListPageConfig.Filter>(
                    this.dataSource,
                    this.filterModel,
                    DataSourcesListPageConfig.getFiltersMapping()
                )
            })
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.dataSource.disconnect()
    }

}
