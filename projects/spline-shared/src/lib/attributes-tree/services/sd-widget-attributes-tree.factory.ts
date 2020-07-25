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

import { Injectable, Type } from '@angular/core'
import { ISplineDataWidget, ISplineDataWidgetFactory } from 'spline-common'

import { SdWidgetAttributesTreeComponent } from '../components'
import { SdWidgetAttributesTree } from '../models'


@Injectable()
export class SdWidgetAttributesTreeFactory implements ISplineDataWidgetFactory<SdWidgetAttributesTree.Data> {

    readonly type = SdWidgetAttributesTree.TYPE

    get componentType(): Type<ISplineDataWidget<SdWidgetAttributesTree.Data>> {
        return SdWidgetAttributesTreeComponent
    }

}
