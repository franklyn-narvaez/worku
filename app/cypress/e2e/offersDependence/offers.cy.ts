/// <reference types="cypress" />

describe('Offer Table', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('login'));
        cy.get('[name="email"]').type(Cypress.env('DEPENDENCE'));
        cy.get('[name="password"]').type(Cypress.env('DEPENDENCE_PASSWORD'));
        cy.get('#root button.w-full').click();

        cy.get('#root a[href="/dependence/offers"] span').click();
    });

    it('debe mostrar al menos una oferta completa en la tabla', () => {
        cy.get('table').should('exist');
        cy.get('thead tr th').should('have.length', 8);
        cy.get('tbody tr').should('have.length.greaterThan', 0);

        cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(0).invoke('text').should('not.be.empty');
            cy.get('td').eq(1).invoke('text').should('not.be.empty');
            cy.get('td').eq(2).invoke('text').should('match', /\d{1,2}\/\d{1,2}\/\d{4}/);
            cy.get('td').eq(3).invoke('text').should('match', /\d{1,2}\/\d{1,2}\/\d{4}/);
            cy.get('td').eq(4).invoke('text').should('match', /\d{1,2}\/\d{1,2}\/\d{4}/);
            cy.get('td').eq(5).invoke('text').should('match', /^\d+$/);
            cy.get('td').eq(6).invoke('text').should('match', /Activa|Inactiva/);

            cy.get('td').eq(7).find('button').click();
        });

        cy.get('div[role="dialog"], .popover-content', { timeout: 2000 })
            .should('be.visible')
            .within(() => {
                cy.contains('Editar').should('be.visible');
                cy.contains('Ver aplicantes').should('be.visible');
                cy.contains('Ver detalles').should('be.visible');
            });
    });
});
