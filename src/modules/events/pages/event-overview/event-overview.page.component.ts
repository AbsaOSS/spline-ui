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

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ExecutionEventFacade } from 'spline-api'

import { EventOverviewPage } from './event-overview.page.models'


@Component({
    selector: 'event-overview-page',
    templateUrl: './event-overview.page.component.html',
    styleUrls: ['./event-overview.page.component.scss'],
})
export class EventOverviewPageComponent implements OnInit {

    executionEventId: string

    data$: Observable<EventOverviewPage.Data>

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly executionEventFacade: ExecutionEventFacade) {

    }

    ngOnInit(): void {
        this.executionEventId = this.activatedRoute.snapshot.params['id']
        this.data$ = this.executionEventFacade.fetchLineageOverview(this.executionEventId)
            .pipe(
                map(lineageData => EventOverviewPage.toData(lineageData)),
            )
    }
}
