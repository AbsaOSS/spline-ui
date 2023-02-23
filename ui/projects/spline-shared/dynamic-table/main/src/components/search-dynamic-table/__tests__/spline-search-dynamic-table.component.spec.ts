/*
 * Copyright 2021 ABSA Group Limited
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

import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NavigationEnd, Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Observable, of } from 'rxjs'
import { filter, take } from 'rxjs/operators'
import { LabelApiService } from 'spline-api'
import { SplineSearchDynamicTableComponent, SplineSearchDynamicTableStoreNs } from 'spline-shared/dynamic-table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatIconModule } from '@angular/material/icon'
import { SplineTranslateTestingModule } from 'spline-utils/translate'
import { MockModule } from 'ng-mocks'
import { PageResponse, QuerySorter, SearchDataSourceConfigInput, SearchFactoryStore, SearchQuery } from 'spline-utils'
import { Component, Input } from '@angular/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { SplineDateRangeFilterModule } from 'spline-common'
import SortDir = QuerySorter.SortDir
import SearchParams = SearchQuery.SearchParams
import DEFAULT_SEARCH_PARAMS = SearchQuery.DEFAULT_SEARCH_PARAMS


@Component({
    selector: 'spline-loader',
    template: '<div></div>'
})
class SplineLoaderComponentMock {}

@Component({
    selector: 'dynamic-table',
    template: '<div></div>'
})
class DynamicTableComponentMock {
    @Input() dataSource
    @Input() dataMap
    @Input() sorting
    @Input() options
}

@Component({
    selector: 'spline-search-box-with-filter',
    template: '<div></div>'
})
class SplineSearchBoxComponentMock {
    @Input() searchTerm
    @Input() dataSource
    @Input() labelApiService
    @Input() searchDefaultString
}

@Component({
    selector: 'spline-no-result',
    template: '<div></div>'
})
class SplineNoResultComponentMock {
}

@Component({
    selector: 'spline-content-error',
    template: '<div></div>'
})
class SplineContentErrorComponentMock {
    @Input() statusCode
    @Input() errorId
    @Input() floating
}

@Component({
    selector: 'ngx-daterangepicker-material',
    template: '<div></div>'
})
class DaterangepickerComponentMock {
}

describe('SplineSearchDynamicTableComponent', () => {

    let componentFixture: ComponentFixture<SplineSearchDynamicTableComponent<any>>
    let componentInstance: SplineSearchDynamicTableComponent<any>
    let router: Router

    beforeEach(async () =>
        TestBed.configureTestingModule({
            declarations: [
                SplineSearchDynamicTableComponent,
                DynamicTableComponentMock,
                SplineLoaderComponentMock,
                SplineSearchBoxComponentMock,
                SplineNoResultComponentMock,
                SplineContentErrorComponentMock,
                DaterangepickerComponentMock
            ],
            imports: [
                BrowserAnimationsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                SplineTranslateTestingModule,
                MockModule(MatPaginatorModule),
                MockModule(MatTableModule),
                MockModule(MatSortModule),
                MockModule(MatIconModule),
                MockModule(MatTooltipModule),
                MockModule(MatDatepickerModule),
                MockModule(SplineDateRangeFilterModule)
                // MockModule(SplineLoaderModule)
                // SplineSearchBoxModule,
                // SplineSortHeaderModule,
                // DynamicTableModule,
                // SplineDynamicTableSharedModule,
            ],
            providers: [LabelApiService]
        })
            .compileComponents()
    )

    beforeEach(() => {
        componentFixture = TestBed.createComponent<SplineSearchDynamicTableComponent>(SplineSearchDynamicTableComponent)
        componentInstance = componentFixture.componentInstance
        router = TestBed.inject<Router>(Router)
    })

    describe('Init Default State', () => {

        type FakeItem = {
            id: number
        }

        const dataMap = [{ id: 'id' }]

        const fakeData: FakeItem[] = [{ id: 1 }, { id: 2 }]

        class FakeFactoryStore extends SearchFactoryStore<FakeItem> {

            constructor(config: SearchDataSourceConfigInput<any, any>) {
                super(config)
            }

            protected getDataObserver(searchParams: SearchQuery.SearchParams): Observable<PageResponse<FakeItem>> {
                return of({
                    totalCount: fakeData.length,
                    items: [...fakeData]
                })
            }
        }

        let fakeDataSource: FakeFactoryStore

        const defaultSortBy: QuerySorter.FieldSorter = {
            field: 'id',
            dir: SortDir.DESC
        }

        beforeEach(() => {
            fakeDataSource = new FakeFactoryStore({
                defaultSearchParams: {
                    sortBy: [{ ...defaultSortBy }]
                },
                pollingInterval: -1
            })
            componentInstance.dataSource = fakeDataSource
            componentInstance.dataMap = dataMap
        })

        test('Init Sorting from DataSource', (done) => {

            componentFixture.detectChanges()

            componentInstance.state$
                .subscribe((state) => {
                    expect(state.sorting).toEqual(defaultSortBy)
                    done()
                })

        })

        test('Init SearchParams from Router QueryParams', (done) => {
            // define init router state
            const urlSorting: QuerySorter.FieldSorter = {
                field: 'id',
                dir: SortDir.ASC
            }

            const urlSearchParams: SearchParams = {
                ...DEFAULT_SEARCH_PARAMS,
                sortBy: [
                    urlSorting
                ]
            }

            const queryParams = SplineSearchDynamicTableStoreNs.applySearchParams(
                {},
                componentInstance.defaultUrlStateQueryParamAlias,
                urlSearchParams
            )

            // fake router init state
            router.navigate([], {
                queryParams,
                replaceUrl: true
            })

            router.events
                .pipe(
                    filter(event => event instanceof NavigationEnd),
                    take(1)
                )
                .subscribe(() => {
                    // init component after router state is init
                    componentFixture.detectChanges()

                    componentInstance.state$
                        .subscribe((state) => {
                            // expect comp state was initialized from router
                            expect(state.sorting).toEqual(urlSorting)

                            // expect DataSource search Params were sync with a Router state
                            expect(urlSearchParams.sortBy).toEqual([urlSorting])
                            done()
                        })
                })

        })

    })
})
