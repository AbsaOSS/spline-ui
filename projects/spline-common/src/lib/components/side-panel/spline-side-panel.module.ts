import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import * as fromComponents from './components'


@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
    ],
    declarations: [
        ...fromComponents.sideDialogComponents
    ],
    providers: [],
    exports: [
        ...fromComponents.sideDialogComponents
    ],
})
export class SplineSidePanelModule {
}
