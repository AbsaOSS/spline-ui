import { Injector, Type } from '@angular/core'


export interface IDynamicComponentFactory<TComponent = any> {
    readonly type: string
    readonly componentType: Type<TComponent>
}

export abstract class DynamicComponentManager<TFactory extends IDynamicComponentFactory, TComponent> {

    protected factoriesMap = new Map<string, TFactory>()

    constructor(protected readonly injector: Injector) {
    }

    getFactory(type: string): TFactory | null {

        if (this.factoriesMap.has(type)) {
            return this.factoriesMap.get(type)
        }

        this.factoriesMap = this.toFactoriesMap(this.getFactoriesProvidersList())

        // in case if cell factory was not found try to refresh factories list
        return this.factoriesMap.has(type)
            ? this.factoriesMap.get(type)
            : null
    }

    getComponentType(cellType: string): Type<TComponent> | null {
        const factory = this.getFactory(cellType)
        return factory
            ? factory.componentType
            : null
    }

    protected toFactoriesMap(factoriesListProvider: Type<TFactory>[]): Map<string, TFactory> {
        if (factoriesListProvider === null) {
            throw new Error('No factory provider found')
        }
        return factoriesListProvider
            .reduce((map, currentFactory) => {
                const factoryInstance = this.injector.get<any>(currentFactory)
                return map.set(factoryInstance.type, factoryInstance)
            }, new Map<string, TFactory>())
    }

    protected abstract getFactoriesProvidersList(): Type<TFactory>[];

}
