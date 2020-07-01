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

import { Component, Input } from '@angular/core'
import { BaseComponent } from 'spline-utils'


@Component({
    selector: 'sg-node-view-default',
    templateUrl: './sg-node-view-default.component.html',
})
export class SgNodeViewDefaultComponent extends BaseComponent {

    readonly defaultIcon = 'scatter_plot'
    readonly defaultColor = '#7a7a7d'

    @Input() icon: string
    @Input() color: string
    @Input() showActions = false

}
