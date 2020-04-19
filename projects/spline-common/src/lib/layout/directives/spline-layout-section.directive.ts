import { Directive, Input, TemplateRef } from '@angular/core';

import { SplineLayoutSection } from '../models';


@Directive({
    selector: '[splineLayoutSection]',
})
export class SplineLayoutSectionDirective {

    @Input('splineLayoutSection') sectionName: SplineLayoutSection.SectionName;

    constructor(public template: TemplateRef<any>) {
    }
}
