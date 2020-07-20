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

import { OnDestroy } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

import { BaseComponent } from './base.component'


export abstract class BaseLocalStateComponent<TState> extends BaseComponent implements OnDestroy {
    readonly state$: BehaviorSubject<TState | null>

    constructor(defaultState: TState = null) {
        super()
        this.state$ = new BehaviorSubject<TState | null>(defaultState)
    }

    get state(): TState {
        return this.state$.getValue()
    }

    protected updateState(state: Partial<TState>): TState {

        const newValue = {
            ...this.state,
            ...state,
        } as TState

        this.state$.next(newValue)

        return newValue
    }

}
