import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'


@Component({
    selector: 'spline-side-dialog-container',
    templateUrl: './spline-side-dialog-container.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplineSideDialogContainerComponent implements OnInit {

    @Input() isVisible = false
    @Input() zIndex = 100

    @Output() close$: EventEmitter<any> = new EventEmitter<any>()

    constructor(public changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    onCloseButtonClicked(): void {
        this.hide()
    }

    show(): void {
        this.isVisible = true
        this.changeDetectorRef.detectChanges()
    }

    hide(): void {
        this.isVisible = false
        this.changeDetectorRef.detectChanges()
        setTimeout(() => {
            this.close$.emit()
        })
    }

}
