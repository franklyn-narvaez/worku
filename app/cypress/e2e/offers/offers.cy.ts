/// <reference types="cypress" />

describe('Offer Form', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('login'));
        cy.get('[name="email"]').type(Cypress.env('ADMIN'));
        cy.get('[name="password"]').type(Cypress.env('PASSWORD'));
        cy.get('#root button.w-full').click();

        cy.get('#root a[href="/admin/offers"] span').click();
    });

    it('debe mostrar al menos una oferta completa en la tabla', () => {
        cy.get('table').should('exist');
        cy.get('thead tr th').should('have.length', 9);

        cy.get('tbody tr').should('have.length.greaterThan', 0);

        cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(0).invoke('text').should('not.be.empty');
            cy.get('td').eq(1).invoke('text').should('not.be.empty');
            cy.get('td').eq(2).invoke('text').should('not.be.empty');
            cy.get('td').eq(3).invoke('text').should('not.be.empty');
            cy.get('td').eq(4).invoke('text').should('match', /\d{1,2}\/\d{1,2}\/\d{4}/);
            cy.get('td').eq(5).invoke('text').should('match', /\d{1,2}\/\d{1,2}\/\d{4}/);
            cy.get('td').eq(6).invoke('text').should('match', /\d{1,2}\/\d{1,2}\/\d{4}/);
            cy.get('td').eq(7).invoke('text').should('match', /Activa|Inactiva/);
            cy.get('td').eq(8).find('button').should('contain.text', 'Editar');
        });
    });
});
