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


import { DEFAULT_PAGER, PageResponse, QueryPager, QuerySorter } from 'spline-api'

import { ProcessingStore } from '../store'


export namespace SearchQuery {

    export interface SearchParams<TFilter extends object = {}, TSortableField = string> {
        pager: QueryPager
        filter: TFilter
        staticFilter: TFilter // filter which will be always applied
        sortBy: QuerySorter.FieldSorter<TSortableField>[]
        searchTerm: string
    }

    export const DEFAULT_SEARCH_PARAMS: SearchParams<any, any> = Object.freeze({
        pager: DEFAULT_PAGER,
        filter: {},
        staticFilter: {},
        sortBy: [],
        searchTerm: '',
    })

    export type DataState<TData extends PageResponse<any>> = {
        data: TData | null
        loadingProcessing: ProcessingStore.EventProcessingState
    }

    export const DEFAULT_RENDER_DATA: DataState<any> = {
        data: null,
        loadingProcessing: ProcessingStore.getDefaultProcessingState()
    }

}
