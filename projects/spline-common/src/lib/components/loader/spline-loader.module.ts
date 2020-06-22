import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { SplineLoaderComponent } from './spline-loader.component'


@NgModule({
    declarations: [
        SplineLoaderComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    exports: [SplineLoaderComponent],
})
export class SplineLoaderModule {
}
