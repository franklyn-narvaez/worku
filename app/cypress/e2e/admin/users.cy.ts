describe('Gestión de usuarios - Tabla', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('login'));
        cy.get('input[name="email"]').type(Cypress.env('ADMIN'));
        cy.get('input[name="password"]').type(Cypress.env('PASSWORD'));
        cy.get('button[type="submit"]').click();

        cy.get('#root a[href="/admin/users"] span').click();

    });

    it('debe mostrar al menos un usuario en la tabla', () => {
        cy.get('table').should('exist');

        cy.get('tbody tr').should('have.length.greaterThan', 0);
    });

});

