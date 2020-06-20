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

import { AfterContentInit, Component, ContentChildren, QueryList, TemplateRef } from '@angular/core'

import { SplineLayoutSectionDirective } from '../../directives'
import { SplineLayoutSection } from '../../models'


@Component({
    selector: 'spline-layout-common',
    templateUrl: './spline-layout-common.component.html',
    styleUrls: ['./spline-layout-common.component.scss'],
})
export class SplineLayoutCommonComponent implements AfterContentInit {

    @ContentChildren(SplineLayoutSectionDirective) sectionTemplatesQueryList: QueryList<SplineLayoutSectionDirective>

    sectionsTemplatesCollection: Partial<{ [K in SplineLayoutSection.SectionName]: TemplateRef<any> }> = {}

    readonly SectionName = SplineLayoutSection.SectionName

    ngAfterContentInit(): void {
        // calculate templates collection
        this.sectionsTemplatesCollection = this.sectionTemplatesQueryList
            .reduce(
                (result, item) => {
                    const templateName = item.sectionName
                    result[templateName] = item.template
                    return result
                },
                {},
            )
    }

}
