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

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter, takeUntil } from 'rxjs/operators'
import { BaseComponent } from 'spline-utils'

import { SplineTabsNavBar } from './spline-tabs-nav-bar.models'
import NavTabInfo = SplineTabsNavBar.NavTabInfo


@Component({
    selector: 'spline-tabs-nav-bar',
    templateUrl: './spline-tabs-nav-bar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplineTabsNavBarComponent extends BaseComponent implements OnInit {

    @Input() set tabs(tabs: NavTabInfo[]) {
        const currentUrl = this.activatedRoute.snapshot.url.toString()
        this.decoratedTabs = tabs.map(
            currentTab => SplineTabsNavBar.decorateNavTabActive(currentTab, currentUrl)
        )
    }

    decoratedTabs: NavTabInfo[]

    constructor(private readonly router: Router,
                private readonly activatedRoute: ActivatedRoute) {

        super()

        this.router.events
            .pipe(
                takeUntil(this.destroyed$),
                filter(navObj => navObj instanceof NavigationEnd)
            )
            .subscribe((navObj: NavigationEnd) => {
                this.decoratedTabs = this.decoratedTabs.map(
                    currentTab => SplineTabsNavBar.decorateNavTabActive(currentTab, navObj.url)
                )
            })
    }

    ngOnInit(): void {

    }

}
