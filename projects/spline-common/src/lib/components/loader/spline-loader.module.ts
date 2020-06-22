import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'

import { SplineLoaderComponent } from './spline-loader.component'


@NgModule({
    declarations: [
        SplineLoaderComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
    ],
    exports: [SplineLoaderComponent],
})
export class SplineLoaderModule {
}
