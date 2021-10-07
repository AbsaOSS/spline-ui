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

import { ExecutionEventsQuery } from 'spline-api'
import { DynamicFilterSchema } from 'spline-common/dynamic-filter'
import { DataSourceWithDynamicFilter, ExecutionEventsDynamicFilter } from 'spline-shared'


export namespace DataSourcesListPage {

    export const FilterId = { ...ExecutionEventsDynamicFilter.FilterId }
    export type Filter = ExecutionEventsDynamicFilter.Filter

    export function getDynamicFilterSchema(): DynamicFilterSchema<Filter> {
        return [
            {
                ...ExecutionEventsDynamicFilter.getExecutedAtFilterSchema(),
                label: 'DATA_SOURCES.DS_LIST__FILTER__LAST_MODIFIED_AT'
            },
            {
                ...ExecutionEventsDynamicFilter.getWriteModeFilterSchema(),
                label: 'DATA_SOURCES.DS_LIST__FILTER__LAST_WRITE_MODE'
            }
        ]
    }

    export function getFiltersMapping(): DataSourceWithDynamicFilter.FiltersMapping<ExecutionEventsQuery.QueryFilter, Filter> {
        return ExecutionEventsDynamicFilter.getFilterMapping()
    }

}
