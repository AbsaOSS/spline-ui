import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'

import { SplineContentErrorComponent } from './spline-content-error.component'


@NgModule({
    declarations: [
        SplineContentErrorComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
    ],
    exports: [SplineContentErrorComponent],
})
export class SplineContentErrorModule {
}
