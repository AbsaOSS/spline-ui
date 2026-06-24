/*
 * Copyright 2021 ABSA Group Limited
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

import { SimpleChange } from '@angular/core'

import { SplineContentErrorComponent } from '../spline-content-error.component'


describe('SplineContentErrorComponent', () => {

    function setStatusCode(component: SplineContentErrorComponent, statusCode: number): void {
        component.ngOnChanges({
            statusCode: new SimpleChange(undefined, statusCode, true)
        })
    }

    test('returns a service unavailable message for HTTP 503', () => {
        const component = new SplineContentErrorComponent()

        setStatusCode(component, 503)

        expect(component.errorMessage).toEqual('COMMON.SERVER_COMMUNICATION_ERROR__MESSAGE__SERVICE_UNAVAILABLE')
    })

    test('keeps generic server error message for other HTTP 5xx errors', () => {
        const component = new SplineContentErrorComponent()

        setStatusCode(component, 500)

        expect(component.errorMessage).toEqual('COMMON.SERVER_COMMUNICATION_ERROR__MESSAGE')
    })
})
