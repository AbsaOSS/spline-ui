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

import { of } from 'rxjs'
import { delay, tap } from 'rxjs/operators'


export function Cacheable(target: any, name: string, descriptor: PropertyDescriptor): void {
    const cache = new Map()
    const method = descriptor.value
    descriptor.value = function(...args) {
        const requestId = args.reduce((result, value) => {
            if (typeof value === 'string') {
                return result + value
            }
            else if (typeof value === 'number') {
                return result + value.toString()
            }
            else if (typeof value === 'object') {
                return result + JSON.stringify(value)
            }
        }, '')

        if (cache.has(requestId)) {
            const fakeResponseDelay = 80
            return of(cache.get(requestId))
                .pipe(
                    delay(fakeResponseDelay)
                )
        }
        else {
            return method.apply(this, args)
                .pipe(
                    tap(result => cache.set(requestId, result))
                )
        }
    }
}
