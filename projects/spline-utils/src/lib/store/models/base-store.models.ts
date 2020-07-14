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

import { BehaviorSubject, Observable, Subject } from 'rxjs'


export abstract class BaseStore<State> {

    readonly state$: Observable<State>

    protected readonly _defaultState: State
    protected readonly _state$: BehaviorSubject<State>
    protected readonly disconnected$ = new Subject<void>()

    constructor(defaultState: State) {
        this._defaultState = defaultState
        this._state$ = new BehaviorSubject<State>(this._defaultState)
        this.state$ = this._state$.asObservable()
    }

    get state(): State {
        return this._state$.getValue()
    }

    resetState() {
        this.updateState(this._defaultState)
    }

    disconnect(): void {
        this._state$.complete()
        this.disconnected$.next()
        this.disconnected$.complete()
    }

    protected updateState(state: Partial<State>): State {

        const newValue = {
            ...this.state,
            ...state,
        } as State

        this._state$.next(newValue)

        return newValue
    }

}
