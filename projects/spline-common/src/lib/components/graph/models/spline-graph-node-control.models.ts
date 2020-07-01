import { EventEmitter, Type } from '@angular/core'
import { IDynamicComponentFactory } from 'spline-utils'

import { SplineGraph } from './spline-graph.models'


export namespace SplineGraphNodeControl {

    export type Schema<TData extends object, TOptions extends object = {}> = {
        id: string
        type?: string
        data: SplineGraph.ValueProvider<TData>
        options?: SplineGraph.ValueProvider<TOptions>
    }

    export type Event<TData extends {} = {}> = {
        type: string
        data?: TData
    }

    export interface INodeControl<TData extends object, TOptions extends object = {}> {
        schema: Schema<TData, TOptions>
        event$: EventEmitter<Event>
    }

    export interface INodeControlFactory<TData extends object, TOptions extends object = {}> extends IDynamicComponentFactory {
        readonly componentType: Type<INodeControl<TData, TOptions>>
    }

    export function extractSchema<TData extends object, TOptions extends object = {}>(
        node: SplineGraph.GraphNode<TData, TOptions>): Schema<TData, TOptions> {
        return {
            id: node.id,
            type: node?.type ?? undefined,
            data: node?.splineData ?? undefined,
            options: node?.splineOptions ?? undefined
        }
    }
}
