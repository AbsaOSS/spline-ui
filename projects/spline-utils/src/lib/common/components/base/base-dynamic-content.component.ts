import { ComponentFactoryResolver, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core'
import { Subscription } from 'rxjs'

import { BaseComponent } from './base-component'


export abstract class BaseDynamicContentComponent<TComponent> extends BaseComponent {

    @ViewChild('componentViewContainer', { read: ViewContainerRef, static: true })
    componentViewContainerRef: ViewContainerRef

    protected componentRef: ComponentRef<TComponent>
    protected eventsSubscriptionRefs: Subscription[] = []

    constructor(protected readonly componentFactoryResolver: ComponentFactoryResolver) {
        super()
    }

    abstract get componentType(): Type<TComponent>;

    protected rebuildComponent(): void {
        this.destroyComponent()
        this.componentRef = this.createComponent()
        this.initCreatedComponent(this.componentRef)
    }

    protected createComponent(): ComponentRef<TComponent> {
        const componentType = this.componentType
        // get component factory
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType)
        // clear view
        this.componentViewContainerRef.clear()
        // create component and attache to the relevant view container
        return this.componentViewContainerRef.createComponent(componentFactory)
    }

    protected destroyComponent(): void {

        if (this.eventsSubscriptionRefs.length > 0) {
            this.eventsSubscriptionRefs
                .forEach(
                    item => item.unsubscribe(),
                )
            this.eventsSubscriptionRefs = []
        }

        if (this.componentRef) {
            this.componentRef.destroy()

        }
    }

    protected abstract initCreatedComponent(componentRef: ComponentRef<TComponent>): void;
}
