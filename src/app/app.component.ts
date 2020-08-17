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

import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { AttributeSearchRecord } from 'spline-api'
import { SplineConfig, SplineConfigService } from 'spline-shared'


@Component({
    selector: 'spline-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    readonly splineConfig$: Observable<SplineConfig>

    constructor(private readonly router: Router, private readonly splineConfigService: SplineConfigService) {

        this.splineConfig$ = this.splineConfigService.config$
    }

    onAttributeSearchSelected(attributeInfo: AttributeSearchRecord): void {
        this.router.navigate(
            ['/app/events/plan-overview', attributeInfo.executionEventId],
            {
                queryParams: {
                    attributeId: attributeInfo.id,
                },
            },
        )
    }
}
