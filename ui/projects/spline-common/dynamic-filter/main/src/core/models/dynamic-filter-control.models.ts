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

import { EventEmitter, InjectionToken } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { GenericEvent, IDynamicComponentFactory, SplineRecord } from 'spline-utils'


export type DynamicFilterItemValue<T = any, TOptions extends Record<string, any> = Record<string, unknown>> = {
    type: string
    value: T
}

export interface IDynamicFilterControlModel<TValue = unknown,
    TOptions extends Record<string, any> = Record<string, unknown>, TId = string> {
    readonly id: TId
    readonly type: string
    readonly options: TOptions
    readonly value: TValue
    readonly value$: Observable<TValue>
    readonly valueChanged$: Observable<TValue>
    patchValue: (value: TValue, emitEvent: boolean) => void
}

export interface DynamicFilterControlModelConfig<TValue, TOptions extends Record<string, any> = Record<string, unknown>, TId = string> {
    id: TId
    defaultValue?: TValue
    options?: TOptions
}

export abstract class BaseDynamicFilterControlModel<TValue, TOptions extends Record<string, any> = Record<string, unknown>, TId = string>
implements IDynamicFilterControlModel<TValue, TOptions, TId> {

    readonly id: TId
    readonly valueChanged$: Observable<TValue>
    readonly value$: Observable<TValue>

    protected _options: TOptions = {} as TOptions

    protected _state$ = new BehaviorSubject<{ value: TValue; emitEvent: boolean }>({
        value: null,
        emitEvent: true,
    })

    abstract readonly type: string

    constructor(config: DynamicFilterControlModelConfig<TValue, TOptions, TId>) {
        this.id = config.id

        if (config.options !== undefined) {
            this._options = config.options
        }

        if (config.defaultValue !== undefined) {
            this.patchValue(config.defaultValue, false)
        }

        this.value$ = this._state$.asObservable()
            .pipe(
                map(({ value }) => value),
            )

        this.valueChanged$ = this._state$.asObservable()
            .pipe(
                filter(({ emitEvent }) => emitEvent),
                map(({ value }) => value),
            )
    }

    get value(): TValue {
        return this._state$.getValue().value
    }

    get options(): TOptions {
        return this._options
    }

    patchValue(value: TValue, emitEvent = true): void {
        this._state$.next({ value, emitEvent })
    }
}

export type DynamicFilterControlsMap<TFilter extends SplineRecord> = {
    [TKey in keyof TFilter]: IDynamicFilterControlModel<TFilter[TKey], any, TKey>
}

export type DynamicFilterControlsCollection<TFilter extends SplineRecord, TKey extends keyof TFilter = keyof TFilter>
    = IDynamicFilterControlModel<TFilter[TKey], any, TKey>[]

export interface IDynamicFilterControlComponent<TValue = any, TOptions extends SplineRecord = SplineRecord, TId = string> {

    model: IDynamicFilterControlModel<TValue, TOptions, TId>
    event$: EventEmitter<GenericEvent>
}

export interface IDynamicFilterControlFactory<TValue = any, TOptions extends SplineRecord = SplineRecord, TId = string>
    extends IDynamicComponentFactory<IDynamicFilterControlComponent<TValue, TOptions, TId>> {

    createModel(
        config: DynamicFilterControlModelConfig<TValue, TOptions, TId>
    ): Observable<IDynamicFilterControlModel<TValue, TOptions, TId>>

}

export const DF_CONTROL_FACTORY = new InjectionToken<IDynamicFilterControlFactory<any>[]>('DF_CONTROL_FACTORY')
