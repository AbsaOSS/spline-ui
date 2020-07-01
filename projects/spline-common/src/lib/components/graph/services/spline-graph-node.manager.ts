import { Inject, Injectable, InjectionToken, Injector, Optional, Type } from '@angular/core'
import { DynamicComponentManager } from 'spline-utils'

import { SgNodeDefaultComponent } from '../components/graph-node-control/type'
import { ISgNodeControl, ISgNodeControlFactory } from '../models'


export const SG_NODE_CONTROL_FACTORY = new InjectionToken<ISgNodeControlFactory<any>[]>('SG_NODE_CONTROL_FACTORY')


@Injectable()
export class SplineGraphNodeManager extends DynamicComponentManager<ISgNodeControlFactory<any>, ISgNodeControl<any>> {

    readonly defaultCellTypesMap: { [type: string]: Type<ISgNodeControl<any>> } = {}

    constructor(
        @Optional() @Inject(SG_NODE_CONTROL_FACTORY) protected readonly factoriesProvidersList: Type<ISgNodeControlFactory<any>>[],
        protected readonly injector: Injector,
    ) {
        super(injector)
    }

    getComponentType(type?: string): Type<ISgNodeControl<any, any>> | null {
        // in case if type is not specified return the default one.
        if (!type) {
            return SgNodeDefaultComponent
        }

        // default types
        if (this.defaultCellTypesMap[type]) {
            return this.defaultCellTypesMap[type]
        }

        return super.getComponentType(type)
    }

    protected getFactoriesProvidersList(): Type<ISgNodeControlFactory<any>>[] {
        return this.factoriesProvidersList
    }


}
