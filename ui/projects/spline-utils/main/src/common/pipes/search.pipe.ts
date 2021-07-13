import { Pipe, PipeTransform } from '@angular/core'
import { get } from 'lodash-es'

import { TypeHelpers } from '../models'


@Pipe({
    name: 'splineSearch',
})
export class SplineSearchPipe implements PipeTransform {

    transform(value: Record<string, any>[] | string[], searchTerm: string, fieldAlias?: string): Record<string, any>[] | string[] {

        const decoratedSearchTerm = searchTerm.trim().toLowerCase()
        console.log(decoratedSearchTerm)
        if (decoratedSearchTerm?.length === 0) {
            return value
        }

        return (value as any[] || [])
            .filter((item) => {
                const targetDataSource = TypeHelpers.isString(item)
                    ? item
                    : get<string>(item, fieldAlias, '')
                return targetDataSource.trim().toLowerCase().includes(decoratedSearchTerm)
            }) as (Record<string, any>[] | string[])
    }

}
