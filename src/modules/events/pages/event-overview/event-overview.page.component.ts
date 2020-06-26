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
import { map, tap } from 'rxjs/operators'
import { ExecutionEventFacade, ExecutionEventLineageNode } from 'spline-api'
import { SplineLineageGraph } from 'spline-common'


@Component({
    selector: 'event-overview-page',
    templateUrl: './event-overview.page.component.html',
    styleUrls: ['./event-overview.page.component.scss'],
})
export class EventOverviewPageComponent implements OnInit {

    executionEventId: string

    graphData$: Observable<SplineLineageGraph.GraphData<ExecutionEventLineageNode>>

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly executionEventFacade: ExecutionEventFacade) {


    }

    ngOnInit(): void {
        this.executionEventId = this.activatedRoute.snapshot.params['id']
        this.graphData$ = this.executionEventFacade.fetchLineageOverview(this.executionEventId)
            .pipe(
                map(lineageData => {
                    return {
                        nodes: lineageData.lineage.nodes
                            .map(node => ({
                                data: {
                                    ...node,
                                    name: node.name.split('/').slice(-1)[0],
                                },
                            })),
                        edges: lineageData.lineage.transitions
                            .map(transition => ({
                                data: {
                                    target: transition.targetNodeId,
                                    source: transition.sourceNodeId,
                                },
                            })),
                    }
                }),
                tap(x => console.log(x)),
            )
    }
}
