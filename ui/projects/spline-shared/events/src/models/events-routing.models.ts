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

export namespace EventsRouting {

    export const BASE_PATH = '/events'

    export function getEventsListPageUrl(): any[] {
        return [BASE_PATH, 'list']
    }

    export function getEventOverviewPageUrl(eventId: string): any[] {
        return [BASE_PATH, 'overview', eventId]
    }

}
