import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatSortHeader } from '@angular/material/sort'


@Component({
    selector: 'spline-sort-header, [spline-sort-header]',
    templateUrl: './spline-sort-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplineSortHeaderComponent extends MatSortHeader {

}
