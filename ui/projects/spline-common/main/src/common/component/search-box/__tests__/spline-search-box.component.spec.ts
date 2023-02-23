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
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { By } from '@angular/platform-browser'
import { SplineTranslateTestingModule } from 'spline-utils/translate'

import { SplineSearchBoxComponent } from '../spline-search-box.component'


describe('SplineSearchComponent', () => {
    let component: SplineSearchBoxComponent
    let fixture: ComponentFixture<SplineSearchBoxComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatIconModule,
                MatTooltipModule,
                HttpClientTestingModule,
                SplineTranslateTestingModule,
                MatAutocompleteModule
            ],
            declarations: [SplineSearchBoxComponent]
        })
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SplineSearchBoxComponent)
        component = fixture.componentInstance
    })

    function extractInputNativeElm(componentFixture: ComponentFixture<SplineSearchBoxComponent>): HTMLInputElement {
        return componentFixture.debugElement.query(By.css('.spline-search-box__input')).nativeElement
    }

    test('component should be created', () => {
        expect(component).toBeTruthy()
    })

    test('default search term settings', fakeAsync(() => {
        jest.spyOn(component.search$, 'emit')
        const defaultValue = 'default search value'
        component.searchTerm = defaultValue

        fixture.detectChanges()
        tick(component.emitSearchEventDebounceTimeInUs)

        expect(component.searchControl.value).toEqual(defaultValue)
        const inputDomElm = extractInputNativeElm(fixture)
        expect(inputDomElm.value).toEqual(defaultValue)
        // do not emit event for default value initialization
        expect(component.search$['emit']).toHaveBeenCalledTimes(1)
        expect(component.search$['emit']).toHaveBeenCalledWith(defaultValue)
    }))

    test('value changed => emit value', fakeAsync(() => {
        jest.spyOn(component.search$, 'emit')

        // set new value
        const newValue = 'new value'
        component.searchControl.setValue(newValue)

        fixture.detectChanges()
        tick(component.emitSearchEventDebounceTimeInUs + 1)

        expect(component.searchControl.value).toEqual(newValue)
        expect(component.search$['emit']).toHaveBeenCalledTimes(1)
        expect(component.search$['emit']).toHaveBeenCalledWith(newValue)
    }))
})
