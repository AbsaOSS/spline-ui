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

import { EventEmitter, Type } from '@angular/core'
import { DynamicValueProvider, IDynamicComponentFactory } from 'spline-utils'


export type SdWidgetSchema<TData extends object = {}, TOptions extends object = {}> = {
    type: string
    data?: DynamicValueProvider<TData>
    options?: DynamicValueProvider<TOptions>
}

export interface SplineDataWidgetEvent<TData extends {} = {}> {
    type: string
    data?: TData
}

export interface ISplineDataWidget<TData extends object = {}, TOptions extends object = {}> {
    schema: SdWidgetSchema<TData, TOptions>
    event$: EventEmitter<SplineDataWidgetEvent>
}

export interface ISplineDataWidgetFactory<TData extends object, TOptions extends object = {}> extends IDynamicComponentFactory {
    readonly componentType: Type<ISplineDataWidget<TData, TOptions>>
}
