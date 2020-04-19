import { AfterContentInit, Component, ContentChildren, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';

import { SplineLayoutSectionDirective } from '../../directives';
import { SplineLayoutSection } from '../../models';


@Component({
    selector: 'spline-layout-common',
    templateUrl: './spline-layout-common.component.html',
    styleUrls: ['./spline-layout-common.component.scss'],
})
export class SplineLayoutCommonComponent implements AfterContentInit {

    @ContentChildren(SplineLayoutSectionDirective) sectionTemplatesQueryList: QueryList<SplineLayoutSectionDirective>;

    sectionsTemplatesCollection: Partial<{ [K in SplineLayoutSection.SectionName]: TemplateRef<any> }> = {};

    readonly SectionName = SplineLayoutSection.SectionName;

    ngAfterContentInit(): void {
        // calculate templates collection
        this.sectionsTemplatesCollection = this.sectionTemplatesQueryList
            .reduce(
                (result, item) => {
                    const templateName = item.sectionName;
                    result[templateName] = item.template;
                    return result;
                },
                {},
            );
    }

}
