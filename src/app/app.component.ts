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

import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AttributeSearchRecord } from 'spline-api'


@Component({
    selector: 'spline-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    constructor(private readonly router: Router) {
    }

    onAttributeSearchSelected(attributeInfo: AttributeSearchRecord): void {
        this.router.navigate(
            ['/events/plan-overview', attributeInfo.executionEventId],
            {
                queryParams: {
                    attributeId: attributeInfo.id,
                },
            },
        )
    }
}
