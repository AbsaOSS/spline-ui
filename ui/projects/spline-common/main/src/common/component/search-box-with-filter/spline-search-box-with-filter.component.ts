/*
 * Copyright 2023 ABSA Group Limited
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
 * limitßtions under the License.
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import _ from 'lodash'
import { BehaviorSubject, distinctUntilChanged } from 'rxjs'
import { debounceTime, filter, takeUntil } from 'rxjs/operators'
import { ExecutionEventsQuery, LabelApiService } from 'spline-api'
import { BaseComponent, SearchFactoryStore } from 'spline-utils'

// `job user:test example` - search input
// `job example` - search token
// `job`, `example` - search token fragments

// `user:test` - filter token
// `user` - filter token key, filter token fragment (left)
// `test` - filter token value, filter token fragment (right)

enum AUTOCOMPLETE_STATE {
    LOADED = 'loaded',
    LOADING = 'loading',
    ERROR = 'error'
}

export interface SplineGenericToken {
    tokenIndex: number
    type: string
    startIndex: number
    endIndex: number
    rawTokenString?: string
}

export interface SplineSearchToken extends SplineGenericToken {
    searchToken: string
}

export interface SplineFilterToken extends SplineGenericToken {
    startValueIndex?: number
    keyFragment?: string
    valueFragment?: string
    rawFilterValue?: string
    isFilterCompleted: boolean
    isDoubleQuotesStartChar: boolean
}

export interface SplineMatchedTokens {
    matchedTokens: SplineSearchToken | SplineFilterToken[]
    filterTokens: SplineFilterToken[]
    searchTokens: SplineSearchToken[]
    lastToken: SplineFilterToken
    searchInput: string

}

const initFilterTokenFragment = {
    type: 'filter',
    tokenIndex: 0,
    startIndex: 0,
    endIndex: 0,
    keyFragment: null,
    isFilterCompleted: false,
    isDoubleQuotesStartChar: false
}

@Component({
    selector: 'spline-search-box-with-filter',
    templateUrl: './spline-search-box-with-filter.component.html'
})
export class SplineSearchBoxWithFilterComponent<TRowData = undefined> extends BaseComponent {
    @ViewChild('inputRef') inputRef: ElementRef<HTMLInputElement>
    @ViewChild(MatAutocompleteTrigger) matAutocompleteTrigger: MatAutocompleteTrigger

    @Input() placeholder = 'COMMON.SEARCH'
    @Input() dataSource: SearchFactoryStore<TRowData>
    @Input() labelApiService: LabelApiService
    @Input() searchDefaultString = ''
    @Output() clearSearch = new EventEmitter<string>()
    @Output() search = new EventEmitter<Partial<SplineMatchedTokens>>()
    autocompleteProcessing$ = new BehaviorSubject<AUTOCOMPLETE_STATE>(AUTOCOMPLETE_STATE.LOADED)
    autocompletedFilterFragments: string[] = []
    searchString = ''
    isSearchFocused = false
    emitSearchEventDebounceTimeInUs = 400
    autocompleteStateEnum = AUTOCOMPLETE_STATE
    formGroup: FormGroup
    lastFoundFilterTokenFragment: SplineFilterToken | SplineSearchToken = initFilterTokenFragment

    constructor() {
        super()
        this.formGroup = new FormGroup({
            searchControl: new FormControl(this.searchDefaultString)
        })

        this.formGroup.get('searchControl').valueChanges
            .pipe(
                // wait some time between keyUp events
                debounceTime(this.emitSearchEventDebounceTimeInUs),
                // emit only different value form the previous one
                distinctUntilChanged((a, b) => (a ?? '').toLocaleLowerCase() === (b ?? '').toLocaleLowerCase()),
                takeUntil(this.destroyed$)
            )
            .subscribe(value => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.searchString = value
                this.inputRef.nativeElement.value = value
                this.changeSearch(value)
            })

        this.autocompleteProcessing$
            .pipe(
                filter((value) => value === AUTOCOMPLETE_STATE.LOADING),
                takeUntil(this.destroyed$)
            )
            .subscribe((value) => {
                this.autocompletedFilterFragments = []
                this.matAutocompleteTrigger?.openPanel()
                this.updateAutocompletedOptionList()
            })
    }

    focusinInput() {
        if (!this.formGroup.get('searchControl').dirty) {
            this.autocompleteProcessing$.next(AUTOCOMPLETE_STATE.LOADING)
        }
        this.isSearchFocused = true
    }

    changeSearch(searchInput: string): void {
        const matchedTokens = this.parseSearchInput2(searchInput)
        this.lastFoundFilterTokenFragment = matchedTokens.lastToken
        this.autocompleteProcessing$.next(AUTOCOMPLETE_STATE.LOADING)
        const completedFilterTokens = matchedTokens.filterTokens.filter((item: SplineFilterToken) => item.isFilterCompleted)
        this.search.emit({ searchTokens: matchedTokens.searchTokens, filterTokens: completedFilterTokens })
        this.isSearchFocused = true
    }

    onAutocompletedOptionSelected(options: { option: { value: string } }): void {
        const optionValue: string = options.option.value
        const searchInput = this.searchString || ''
        const lastToken: SplineFilterToken | SplineSearchToken = this.lastFoundFilterTokenFragment
        const {
            startIndex: fragmentStartIndex,
            tokenIndex,
            type: fragmentType
        } = lastToken
        const permanentSearchInputPart: string = fragmentStartIndex ? searchInput.slice(0, fragmentStartIndex) : ''
        let searchInputWithSelectedOption = `${ permanentSearchInputPart.trim() }${ tokenIndex ? ' ' : '' }`
        if (fragmentType === 'search') {
            searchInputWithSelectedOption += `${ optionValue }:`
        }
        if (fragmentType === 'filter') {
            searchInputWithSelectedOption += `${ (lastToken as SplineFilterToken).keyFragment ?? optionValue }:`
        }
        if ((lastToken as SplineFilterToken).keyFragment && (lastToken as SplineFilterToken).startValueIndex) {
            const wrappedSelectedOption = /\s/g.test(optionValue) ? `"${ optionValue }"` : optionValue
            searchInputWithSelectedOption += `${ wrappedSelectedOption } `
        }

        this.isSearchFocused = false
        this.formGroup.get('searchControl').setValue(searchInputWithSelectedOption)
        this.autocompletedFilterFragments = []
    }

    onClearBtnClicked(): void {
        this.search.emit({ matchedTokens: [], searchTokens: [], searchInput: '', filterTokens: [], lastToken: null })

        this.formGroup.get('searchControl').reset('')
    }

    parseSearchToken(searchInput: string, startIndex: number, endIndex: number, tokenIndex: number): SplineSearchToken {
        const rawTokenString = searchInput.substring(startIndex, endIndex)
        const searchToken = rawTokenString.replace(/\s+/g, ' ').trim()

        return {
            type: 'search',
            tokenIndex,
            startIndex,
            endIndex,
            searchToken,
            rawTokenString
        }
    }

    parseFilterToken(filter: Partial<RegExpMatchArray>, tokenIndex: number): SplineFilterToken {
        const { 0: rawTokenString, 1: keyFragment, 2: rawFilterValue = '', index: startFilterIndex } = filter

        const isDoubleQuotesStartChar = _.startsWith(rawTokenString, '"')
        // Incomplete
        // appName:
        // appName:<space>
        // appName:"
        // appName:"Test
        // appName:"Test:
        // appName:"Test:<space>
        // appName:"Test<space>
        // Complete
        // appName:"" - but should be skipped
        // appName:test
        // appName:"Test"
        // appName:"Test test test test's test (test)"

        const isFilterCompleted = /^([\w\d]+|"[\w\d\s\-()':]*")$/g.test(rawFilterValue)
        const valueFragment = _.trim(rawFilterValue, '"')

        return {
            type: 'filter',
            tokenIndex,
            startIndex: startFilterIndex,
            startValueIndex: startFilterIndex + (keyFragment?.length ?? 0) + 1,
            endIndex: startFilterIndex + rawTokenString.length,
            rawTokenString,
            keyFragment,
            valueFragment,
            rawFilterValue,
            isFilterCompleted,
            isDoubleQuotesStartChar
        }
    }

    private updateAutocompletedOptionList() {
        const filterTokenFragment: unknown = this.lastFoundFilterTokenFragment
        if ((filterTokenFragment as SplineFilterToken)?.isFilterCompleted) {
            return
        }
        const isKeyFragment = (filterTokenFragment as SplineFilterToken)?.type === 'search'
        const keyFragment = isKeyFragment
            ? (filterTokenFragment as SplineSearchToken)?.searchToken
            : (filterTokenFragment as SplineFilterToken)?.keyFragment
        const valueFragment = (filterTokenFragment as SplineFilterToken)?.valueFragment
        // Adapter LabelData to LabelQuery
        const queryParams = isKeyFragment
            ? ExecutionEventsQuery.toLabelQueryParams(keyFragment)
            : ExecutionEventsQuery.toLabelQueryParams(valueFragment, keyFragment)

        this.labelApiService?.fetchList(queryParams)
            .subscribe({
                next: (result: string[]) => {
                    this.autocompletedFilterFragments = result
                    this.autocompleteProcessing$.next(AUTOCOMPLETE_STATE.LOADED)
                }, error: (error) => {
                    console.error(error)
                    this.autocompletedFilterFragments = []
                    this.autocompleteProcessing$.next(AUTOCOMPLETE_STATE.ERROR)
                }
            })
    }

    private parseSearchInput2(searchInput: string): SplineMatchedTokens {
        // const searchInput = 'is:foo not:"complex foo" another:filter just word with "some brackets" or with :"space" : "spaa as"
        // good:again';

        // const searchInput = 'BOOOO  is:foo test1 not:"complex foo" test2   another:filter just word with "some brackets" or with
        // :"space" : "spaa as" good:again';

        // 'BOOOO  is:foo test1 not:"complex foo" test2   another:filter just word with "some brackets" or with:"space" : "spaa as"
        // good:again appName:"Complete's test 1 (success)""dvfdfd"hjnfx"fx xdfgx: gffgfgf'

        // BOOOO  is:foo test1 not:"complex foo" test2   another:filter just word with "some brackets" or with:"space" : "spaa as"
        // good:again appName:"Complete's test 1 (success)"dvfdfd"hjnfx"fx gffgfgf: ghgh:"test:bvvv" ghxdghrf:"
        const filterRegexp = /(?:^|\s+)([\w\d-]+):([\w\d-_]+|"[\w\d\s-_'()^:]*"?|\s*$)/g // NOSONAR

        const parsedFilters = searchInput.matchAll(filterRegexp)
        let lastProcessedSearchIndex = 0
        let tokenIndex = 0
        let startSearchIndex
        const searchTokens = []
        const filterTokens = []
        const matchedTokens = []
        for (const filter of parsedFilters) {
            startSearchIndex = lastProcessedSearchIndex
            const { 0: filterString, index: startFilterIndex } = filter
            const isSearchTokenExistedBeforeFilter = startFilterIndex > startSearchIndex
            if (isSearchTokenExistedBeforeFilter) {
                const searchToken = this.parseSearchToken(searchInput, startSearchIndex, startFilterIndex, tokenIndex++)
                searchTokens.push(searchToken)
                matchedTokens.push(searchToken)
            }
            lastProcessedSearchIndex = startFilterIndex + filterString.length
            const filterToken = this.parseFilterToken(filter, tokenIndex++)
            filterTokens.push(filterToken)
            matchedTokens.push(filterToken)
        }
        const hasSearchInputLastSearchTokenAfterLastFilter = searchInput.length > lastProcessedSearchIndex
        const rawTokenString = searchInput.substring(lastProcessedSearchIndex, searchInput.length)
        if (hasSearchInputLastSearchTokenAfterLastFilter) {
            if (!rawTokenString.trim()) {
                const filter = { 0: rawTokenString, 1: null, index: lastProcessedSearchIndex } as Partial<RegExpMatchArray>
                const filterToken = this.parseFilterToken(filter, tokenIndex++)
                filterTokens.push(filterToken)
                matchedTokens.push(filterToken)
            }
            else {
                const searchToken = this.parseSearchToken(searchInput, lastProcessedSearchIndex, searchInput.length, tokenIndex++)
                searchTokens.push(searchToken)
                matchedTokens.push(searchToken)
            }
        }

        return {
            matchedTokens,
            filterTokens,
            searchTokens,
            lastToken: matchedTokens[matchedTokens.length - 1] ?? initFilterTokenFragment,
            searchInput
        }
    }
}
