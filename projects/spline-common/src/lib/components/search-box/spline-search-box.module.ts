import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

import { SplineSearchComponent } from './spline-search-box.component'


@NgModule({
    declarations: [
        SplineSearchComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatTooltipModule,
    ],
    exports: [SplineSearchComponent],
})
export class SplineSearchBoxModule {
}
