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


import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { filter, map, skip, take } from 'rxjs/operators'

import { EventInfo } from '../models'
import { EventOverviewStoreFacade } from '../store/services'


@Injectable()
export class EventInfoResolver implements Resolve<EventInfo> {

    constructor(private readonly eventOverviewStoreFacade: EventOverviewStoreFacade) {
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<EventInfo> {

        const executionEventId = route.params['id']

        this.eventOverviewStoreFacade.init(executionEventId)

        return this.eventOverviewStoreFacade.state$
            .pipe(
                filter(state => !state.loadingProcessing.processing),
                map(state => state.eventInfo),
                skip(1),
                take(1)
            )
    }

}
