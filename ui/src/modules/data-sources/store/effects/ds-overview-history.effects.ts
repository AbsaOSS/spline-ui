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

import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { switchMap } from 'rxjs/internal/operators'
import { catchError, filter, map } from 'rxjs/operators'
import { ExecutionEventFacade } from 'spline-api'

import { DsOverviewHistoryStoreActions } from '../actions'
import fromActions = DsOverviewHistoryStoreActions


@Injectable()
export class DsOverviewHistoryEffects {
    //
    // [ACTION] :: FETCH HISTORY :: REQUEST
    //
    @Effect()
    fetchRequest$ = this.actions$
        .pipe(
            ofType<fromActions.FetchHistoryRequest>(fromActions.ActionTypes.FetchHistoryRequest),
            switchMap(({ payload }) =>
                this.executionEventFacade.fetchList(payload.queryParams)
                    .pipe(
                        catchError((error) => {
                            this.store.dispatch(
                                new fromActions.FetchHistoryError({ error })
                            )
                            return of(null)
                        })
                    )
            ),
            filter(entity => entity !== null),
            map(result => {
                return new fromActions.FetchHistorySuccess({ executionEventsPage: result })
            })
        )

    constructor(protected readonly actions$: Actions,
                protected readonly store: Store<any>,
                protected readonly executionEventFacade: ExecutionEventFacade) {

    }

}
