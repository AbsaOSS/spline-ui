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



export type DataSourceInfo = {
    name: string
    uri: string
    type: string
}


export type DataSourceInfoDto = {
    source: string
    sourceType: string
}

export function toDataSourceInfo(entity: DataSourceInfoDto): DataSourceInfo {
    return {
        name: dataSourceUriToName(entity.source),
        uri: entity.source,
        type: entity.sourceType
    }
}

export function dataSourceUriToName(uri: string): string {
    return uri.split('/').slice(-1)[0]
}

export enum DataSourceWriteMode {
    Append = 'append',
    Overwrite = 'overwrite',
}
