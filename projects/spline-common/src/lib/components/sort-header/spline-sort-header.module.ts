import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatSortModule } from '@angular/material/sort'

import { SplineSortHeaderComponent } from './spline-sort-header.component'


@NgModule({
    declarations: [
        SplineSortHeaderComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatSortModule,
    ],
    exports: [SplineSortHeaderComponent],
})
export class SplineSortHeaderModule {
}
