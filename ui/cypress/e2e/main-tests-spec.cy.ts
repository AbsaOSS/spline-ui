describe('Main Tests', () => {
    it('Visits the initial project page', () => {
        cy.visit('/')
        cy.title().should('eq', 'Spline - Data Lineage Tacking & Visualization')
    })

    describe('Issue: On event-overview page', () => {
        it('back button should restore the state of the previous page', () => {
            cy.visit('/')
            cy.get('mat-row:nth-child(8) .link').first().click()
            cy.get('sg-overview-control button').last().click()
            cy.wait(1000);
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
