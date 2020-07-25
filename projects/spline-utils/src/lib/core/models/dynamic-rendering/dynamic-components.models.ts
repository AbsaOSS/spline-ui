import { Observable } from 'rxjs'


export type DynamicValueProviderFn<T> = () => T
export type DynamicValueProvider<T> = T | DynamicValueProviderFn<T> | DynamicValueProviderFn<Observable<T>> | Observable<T>
