/*
 * Copyright 2020 ABSA Group Limited
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


import { Params } from '@angular/router'
import { QueryPager } from 'spline-api'
import { RouterHelpers } from 'spline-utils'


export namespace EventsListUrlState {

    export const URL_QUERY_PARAM__PAGER = 'pager'

    export type PagerState = {
        pager: QueryPager
        initialRequestTime: Date
    }

    export function extractPager(queryParams: Params): PagerState | null {
        if (!queryParams[URL_QUERY_PARAM__PAGER]) {
            return null
        }
        return decodePagerState(queryParams[URL_QUERY_PARAM__PAGER])
    }

    export function applyPager(queryParams: Params, pager: PagerState | null): Params {
        return RouterHelpers.setQueryParam(
            queryParams,
            URL_QUERY_PARAM__PAGER,
            pager !== null ? encodePagerState(pager) : null,
        )
    }

    export function encodePagerState(pagerState: PagerState): string {
        return window.btoa(JSON.stringify(pagerState))
    }

    export function decodePagerState(pagerStateUrlString: string): PagerState {
        const pagerState = JSON.parse(window.atob(pagerStateUrlString))
        return {
            ...pagerState,
            initialRequestTime: new Date(pagerState.initialRequestTime),
        }
    }

}
