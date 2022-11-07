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
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { AttributeSearchRecord } from 'spline-api'
import { SplineConfig, SplineConfigApiService } from 'spline-shared'
import { BaseLocalStateComponent } from 'spline-utils'

import { AppStateManagement } from './store'


@Component({
    selector: 'spline-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseLocalStateComponent<AppStateManagement.State> {

    constructor(private readonly router: Router,
                private readonly splineConfigApiService: SplineConfigApiService
    ) {
        super()
        this.updateState(
            AppStateManagement.getDefaultState()
        )

        this.splineConfigApiService.config$
            .pipe(
                take(1)
            )
            .subscribe((splineConfig) => {
                this.init(splineConfig)
            })
    }

    onAttributeSearchSelected(attributeInfo: AttributeSearchRecord): void {
        this.router.navigate(
            ['/plans/overview', attributeInfo.executionEventId],
            {
                queryParams: {
                    attributeId: attributeInfo.id
                }
            }
        )
    }

    onSideNavExpanded(isExpanded: boolean): void {
        this.updateState(
            AppStateManagement.reduceSideNavExpanded(this.state, isExpanded)
        )
    }

    private init(splineConfig: SplineConfig): void {
        this.updateState({
            isInitialized: true,
            isEmbeddedMode: !!splineConfig.isEmbeddedMode
        })
    }

}
