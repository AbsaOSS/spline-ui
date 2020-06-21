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

import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatSort } from '@angular/material/sort'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ExecutionEvent, ExecutionEventFacade, ExecutionEventsPageResponse } from 'spline-api'
import { ProcessingStore } from 'spline-utils'

import { ExecutionEventsDataSource } from '../../data-sources'


@Component({
    selector: 'events-list',
    templateUrl: './events-list.component.html',
    styleUrls: ['./events-list.component.scss'],
    providers: [
        {
            provide: ExecutionEventsDataSource,
            useFactory: (executionEventFacade: ExecutionEventFacade) => {
                return new ExecutionEventsDataSource(executionEventFacade)
            },
            deps: [ExecutionEventFacade],
        },
    ],
})
export class EventsListComponent implements OnInit, AfterContentInit {

    @ViewChild(MatSort, { static: true }) sortControl: MatSort
    readonly loadingProcessing$: Observable<ProcessingStore.EventProcessingState>
    readonly data$: Observable<ExecutionEventsPageResponse>

    readonly visibleColumns = [
        'applicationId',
        'applicationName',
        'dataSource',
        'dataSourceType',
        'append',
        'timestamp',
    ]

    constructor(readonly dataSource: ExecutionEventsDataSource) {
        this.loadingProcessing$ = this.dataSource.loadingProcessing$
        this.data$ = this.dataSource.dataState$.pipe(map(dataState => dataState.data))
    }

    ngOnInit(): void {
        this.dataSource.load()
    }

    ngAfterContentInit(): void {
        this.sortControl.sort({
            id: 'timestamp',
            start: 'desc',
            disableClear: false,
        })
    }

}
