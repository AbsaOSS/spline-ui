import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'


@Component({
    selector: 'spline-side-dialog-container',
    templateUrl: './spline-side-panel-container.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplineSidePanelContainerComponent implements OnInit {

    @Input() set visible(isVisible: boolean) {
        if (isVisible !== this._isVisible) {
            this.processVisibilityChange(isVisible)
        }
    }

    @Input() zIndex = 100

    @Output() closed$ = new EventEmitter<void>()
    @Output() opened$ = new EventEmitter<void>()

    _isVisible = false

    constructor(public changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    onCloseButtonClicked(): void {
        this.hide()
    }

    show(): void {
        this.processVisibilityChange(true)
    }

    hide(): void {
        this.processVisibilityChange(false)
    }

    private processVisibilityChange(isVisible: boolean): void {
        if (isVisible !== this._isVisible) {
            this._isVisible = isVisible
            this.changeDetectorRef.detectChanges()

            if (this._isVisible) {
                this.opened$.emit()
            }
            else {
                setTimeout(() => {
                    this.closed$.emit()
                })
            }
        }
    }

}
