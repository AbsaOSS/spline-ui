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

import { EventEmitter, Type } from '@angular/core'
import { IDynamicComponentFactory } from 'spline-utils'

import { SgNodeSchema } from './spline-graph.models'


export type SgNodeControlEvent<TData extends Record<string, any> = Record<string, any>> = {
    type: string
    data?: TData
}

export interface ISgNodeControl<TData extends Record<string, any>, TOptions extends Record<string, any> = Record<string, any>> {
    schema: SgNodeSchema<TData, TOptions>
    isSelected: boolean
    isFocused: boolean
    isTarget: boolean
    event$: EventEmitter<SgNodeControlEvent>
}

export interface ISgNodeControlFactory<TData extends Record<string, any>, TOptions extends Record<string, any> = Record<string, any>>
    extends IDynamicComponentFactory {
    readonly componentType: Type<ISgNodeControl<TData, TOptions>>
}

export type SgNodeEvent = {
    nodeSchema: SgNodeSchema
    event: SgNodeControlEvent<any>
}
