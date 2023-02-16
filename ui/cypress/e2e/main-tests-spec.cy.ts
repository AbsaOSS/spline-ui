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
 * limitations under the License.
 */

describe('Main Tests', () => {
    it('Visits the initial project page', () => {
        cy.visit('/')
        cy.title().should('eq', 'Spline - Data Lineage Tacking & Visualization')
    })

    describe('Issue: datepicker calendar should filter data in the table', () => {
        it('Datepicker panel should open after clicking on button with text `Everything`', () => {
            cy.visit('/')
            cy.get('ngx-daterangepicker-material').should('not.exist')
            cy.get('spline-date-filter button').click()
            cy.get('ngx-daterangepicker-material').should('exist')
        })

        it('Choosen date in datepicker should replace text on button with text `Everything`', () => {
            cy.visit('/')
            cy.get('spline-date-filter button').click()
            cy.get('ngx-daterangepicker-material .ranges .ng-star-inserted:nth-child(5) button').click()
            cy.get('ngx-daterangepicker-material .buttons_input button.btn:nth-child(3)').click()
            cy.get('spline-date-filter button .spline-inline-filter__value').should('not.contain.text', 'Everything')
            cy.get('spline-date-filter button .spline-inline-filter__value').invoke('text')            // check the innerHTML text
                .should('match', /\d\d\d\d-\d\d-\d\d - \d\d\d\d-\d\d-\d\d/)
            cy.get('body').click()
            cy.get('ngx-daterangepicker-material').should('not.exist')
        })

        it('Choosen date should filter data in table', () => {
            cy.visit('/')
            cy.get('spline-date-filter button').click()
            cy.get('ngx-daterangepicker-material .ranges .ng-star-inserted:nth-child(5) button').click()
            cy.get('ngx-daterangepicker-material .buttons_input button.btn:nth-child(3)')
                .should('contain.text', 'Apply').click()
            cy.get('mat-table mat-row').should('have.length.lessThan', 10)
            cy.get('ngx-daterangepicker-material').should('exist')
        })

        it('Choosen date should correctly apply after page reloading', () => {
            cy.visit('/')
            cy.get('spline-date-filter button').click()
            cy.get('ngx-daterangepicker-material .ranges .ng-star-inserted:nth-child(7) button').click()
            cy.get('ngx-daterangepicker-material .buttons_input button.btn:nth-child(3)')
                .should('contain.text', 'Apply').click()
            cy.get('ngx-daterangepicker-material').should('exist')
            cy.reload()
            cy.get('mat-table mat-row').should('have.length.at.least', 1)
            cy.get('spline-loader mat-spinner').should('not.exist')
        })
    })

    describe('Issue: On event-overview page', () => {
        it('back button should restore the state of the previous page', () => {
            cy.visit('/')
            cy.get('mat-row:nth-child(9) .link').first().click()
            cy.get('sg-overview-control button').last().click()
            cy.wait(1000)
            cy.get('ngx-graph .node-group:nth-child(3)').click()
            cy.get('.spline-card-header__title').should('contain.text', 'my-other-job-output')
            cy.get('spline-data-widget .spline-data-record__value a').last().click()
            cy.get('h2.text-center').should('contain.text', 'Data Source State History')
            cy.go('back')
            cy.get('sl-breadcrumbs').should('contain.text', 'Execution Event')
            cy.get('spline-loader mat-spinner').should('not.exist')
            cy.get('sg-overview-control .active spline-icon[icon=children-nodes]').should('exist')
            cy.get('ngx-graph .node-group:nth-child(3)').should('exist')
        })
    })

})
