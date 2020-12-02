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

import omit from 'lodash/omit'

import { AttributeDataType, AttributeDataTypeDto, toAttributeDataType } from './attribute-data-type.models'


export type AttributeSearchRecord = {
    id: string
    name: string
    executionEventId: string
    executionEventName: string
    attributeType?: AttributeDataType
}

export type AttributeSearchRecordDto = {
    id: string
    name: string
    executionEventId: string
    executionEventName: string
    attributeType?: AttributeDataTypeDto
}

export function toAttributeSearchRecord(entity: AttributeSearchRecordDto): AttributeSearchRecord {
    return {
        ...omit(entity, ['attributeType']),
        attributeType: toAttributeDataType(entity.attributeType)
    }
}
