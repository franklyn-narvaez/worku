// login.cy
/// <reference types="cypress" />

describe('Login test', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('login'));
	});

	it('cv base case', () => {
		cy.get('[name="email"]').clear();
		cy.get('[name="email"]').type(Cypress.env('ADMIN'));
		cy.get('[name="password"]').clear();
		cy.get('[name="password"]').type(Cypress.env('PASSWORD'));
		cy.get('#root button.w-full').click();

		// toastyfy message
		cy.url().should('include', '/dashboard')
		// home should be in the page
		cy.get('#root div.group\\/sidebar-wrapper > div.flex-1.flex > div').should('have.text', 'dashboard');
	});

	// email
	it('ci username empty', () => {
  	cy.get('[name="password"]').clear();
  	cy.get('[name="password"]').type(Cypress.env('PASSWORD'));
  	cy.get('#root button.w-full').click();
    cy.get('#root p.text-red-500').should('have.text', 'El correo electrónico no es válido');
	});

	it('ci username not exits', () => {
  	cy.get('[name="email"]').clear();
  	cy.get('[name="email"]').type('nouser@eexample.com');
  	cy.get('[name="password"]').clear();
  	cy.get('[name="password"]').type(Cypress.env('PASSWORD'));
  	cy.get('#root button.w-full').click();
   cy.get('#root div.Toastify__toast').should('have.text', 'Usuario o contraseña no válidos.');

	});

	// password
	it('password-ci-empty', () => {
	  cy.get('[name="email"]').clear();
		cy.get('[name="email"]').type(Cypress.env('ADMIN'));
		cy.get('[name="password"]').clear();
 	  cy.get('#root button.w-full').click();

    cy.get('#root p.text-red-500').should('have.text', 'Ingresa la contraseña.');
	});

	it('password-ci-bad-password', () => {
  	cy.get('[name="email"]').clear();
  	cy.get('[name="email"]').type(Cypress.env('ADMIN'));
  	cy.get('[name="password"]').clear();
  	cy.get('[name="password"]').type('123456789');
		cy.get('#root button.w-full').click();
		cy.get('#root div.Toastify__toast').should('have.text', 'Usuario o contraseña no válidos.');
	});
});
