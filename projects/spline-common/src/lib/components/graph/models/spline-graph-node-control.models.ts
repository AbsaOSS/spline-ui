import { EventEmitter, Type } from '@angular/core'
import { IDynamicComponentFactory } from 'spline-utils'

import { SgNodeSchema } from './spline-graph.models'


export type SgNodeControlEvent<TData extends {} = {}> = {
    type: string
    data?: TData
}

export interface ISgNodeControl<TData extends object, TOptions extends object = {}> {
    schema: SgNodeSchema<TData, TOptions>
    event$: EventEmitter<SgNodeControlEvent>
}

export interface ISgNodeControlFactory<TData extends object, TOptions extends object = {}> extends IDynamicComponentFactory {
    readonly componentType: Type<ISgNodeControl<TData, TOptions>>
}
