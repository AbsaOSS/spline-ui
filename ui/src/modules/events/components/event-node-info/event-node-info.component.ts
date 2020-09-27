/*
 * Copyright 2020 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { SplineDataWidgetEvent } from 'spline-common/data-view'
import { SgNodeCardDataView } from 'spline-shared/data-view'
import { BaseLocalStateComponent, GenericEventInfo } from 'spline-utils'

import { EventNodeInfo } from '../../models'
import NodeEventData = SgNodeCardDataView.NodeEventData


@Component({
    selector: 'event-node-info',
    templateUrl: './event-node-info.component.html',
    styleUrls: ['./event-node-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventNodeInfoComponent extends BaseLocalStateComponent<EventNodeInfo.NodeInfoViewState> implements OnChanges {

    @Input() nodeRelations: EventNodeInfo.NodeRelationsInfo

    @Output() focusNode$ = new EventEmitter<{ nodeId: string }>()
    @Output() launchNode$ = new EventEmitter<{ nodeId: string }>()
    @Output() highlightToggleRelations$ = new EventEmitter<{ nodeId: string }>()
    @Output() dataViewEvent$ = new EventEmitter<SplineDataWidgetEvent>()

    constructor() {
        super()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.nodeRelations && !!changes.nodeRelations.currentValue) {
            const nodeRelations: EventNodeInfo.NodeRelationsInfo = changes.nodeRelations.currentValue
            this.updateState({
                nodeDvs: EventNodeInfo.toDataSchema(nodeRelations.node),
                childrenDvs: nodeRelations.children.map((node) => EventNodeInfo.toDataSchema(node)),
                parentsDvs: nodeRelations.parents.map((node) => EventNodeInfo.toDataSchema(node)),
                parentsNumber: nodeRelations?.parents?.length ?? 0,
                childrenNumber: nodeRelations?.children?.length ?? 0,
            })
        }
    }

    onDataViewEvent($event: SplineDataWidgetEvent): void {
        switch ($event.type) {
            case EventNodeInfo.WidgetEvent.LaunchExecutionEvent:
                this.launchNode$.next({ nodeId: ($event as GenericEventInfo<NodeEventData>).data.nodeId })
                break

            case SgNodeCardDataView.WidgetEvent.FocusNode:
                this.focusNode$.next({ nodeId: ($event as GenericEventInfo<NodeEventData>).data.nodeId })
                break

            case SgNodeCardDataView.WidgetEvent.HighlightNodeRelations:
                this.highlightToggleRelations$.next({ nodeId: ($event as GenericEventInfo<NodeEventData>).data.nodeId })
                break
        }

        this.dataViewEvent$.next($event)
    }
}
