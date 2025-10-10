// login.cy
/// <reference types="cypress" />

describe('Login test', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('login'));
	});

	it('cv base case', () => {
		cy.get('#username-field').clear();
		cy.get('#username-field').type(Cypress.env('ADMIN'));
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type(Cypress.env('PASSWORD'));
		cy.get('.inline-flex').click();

		// home should be in the page
		cy.get('.space-y-2 > :nth-child(1) > .flex').should('contain', 'Inicio');
	});

	// username

	it('ci username empty', () => {
		cy.get('#pass-field').type(Cypress.env('PASSWORD'));
		cy.get('.inline-flex').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa el usuario.');
	});

	it('ci username not exits', () => {
		cy.get('#username-field').type('nouser');
		cy.get('#pass-field').type(Cypress.env('PASSWORD'));
		cy.get('.inline-flex').click();

		cy.get('[role="status"]').should('have.text', 'Revisa tu usuario y contraseña');
	});

	// password

	it('password-ci-empty', () => {
		cy.get('#username-field').clear();
		cy.get('#username-field').type(Cypress.env('ADMIN'));
		cy.get('#pass-field').clear();
		cy.get('.inline-flex').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa la contraseña.');
	});

	it('password-ci-bad-password', () => {
		cy.get('#username-field').clear();
		cy.get('#username-field').type(Cypress.env('ADMIN'));
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('123456789');
		cy.get('.inline-flex').click();
		cy.get('[role="status"]').should('have.text', 'Revisa tu usuario y contraseña');
	});

	it('login-studio', function() {
		
		cy.get('[name="email"]').click();
		cy.get('#root button.w-full').click();
	});
});
