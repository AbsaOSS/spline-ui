import { Inject, Injectable, InjectionToken, Injector, Optional, Type } from '@angular/core'
import { DynamicComponentManager } from 'spline-utils'

import { SplineGraphNodeDefaultComponent } from '../components/graph-node-control/type'
import { SplineGraphNodeControl } from '../models'
import INodeControl = SplineGraphNodeControl.INodeControl
import INodeControlFactory = SplineGraphNodeControl.INodeControlFactory


export const SPLINE_GRAPH_NODE_CONTROL_FACTORY = new InjectionToken<INodeControlFactory<any>[]>('SPLINE_GRAPH_NODE_CONTROL_FACTORY')


@Injectable()
export class SplineGraphNodeManager extends DynamicComponentManager<INodeControlFactory<any>, INodeControl<any>> {

    readonly defaultCellTypesMap: { [type: string]: Type<INodeControl<any>> } = {}

    constructor(
        @Optional() @Inject(SPLINE_GRAPH_NODE_CONTROL_FACTORY) protected readonly factoriesProvidersList: Type<INodeControlFactory<any>>[],
        protected readonly injector: Injector,
    ) {
        super(injector)
    }

    getComponentType(type?: string): Type<INodeControl<any, any>> | null {
        // in case if type is not specified return the default one.
        if (!type) {
            return SplineGraphNodeDefaultComponent
        }

        // default types
        if (this.defaultCellTypesMap[type]) {
            return this.defaultCellTypesMap[type]
        }

        return super.getComponentType(type)
    }

    protected getFactoriesProvidersList(): Type<INodeControlFactory<any>>[] {
        return this.factoriesProvidersList
    }


}
