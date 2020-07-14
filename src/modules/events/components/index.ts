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

import { EventCardContentComponent } from './card/card-content/event-card-content.component'
import { EventCardHeaderComponent } from './card/card-header/event-card-header.component'
import { DataRecordComponent } from './data-record/data-record.component'
import { EventInfoComponent } from './event-info/event-info.component'
import { EventNodeInfoComponent } from './event-node-info/event-node-info.component'


export const components: any[] = [
    EventInfoComponent,
    EventCardContentComponent,
    EventCardHeaderComponent,
    DataRecordComponent,
    EventNodeInfoComponent
]

export * from './card/card-content/event-card-content.component'
export * from './data-record/data-record.component'
export * from './event-info/event-info.component'
export * from './event-node-info/event-node-info.component'
