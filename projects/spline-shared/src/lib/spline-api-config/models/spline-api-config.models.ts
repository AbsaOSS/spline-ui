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

import { environment } from '@env/environment'


export const API_SPLINE_CONSUMER = '@splineConsumerApi'

export const API_BASE_PATH_MAP = Object.freeze({
    [API_SPLINE_CONSUMER]: environment.splineConsumerApi.fullPath,
})

export function getApiBasePath(alias: string): string {
    return API_BASE_PATH_MAP[alias]
        ? API_BASE_PATH_MAP[alias]
        : ''
}
