// register.cy
/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Register test', () => {
  let validName: string;
  let validLastName: string;
  let validEmail: string;
  let validPassword: string;
  const validCollege = 'Escuela de Sistemas';

	beforeEach(() => {
		cy.visit(Cypress.env('login'));
		cy.get('#root a[href="/auth/register"]').click();
		validName = faker.person.firstName();
    validLastName = faker.person.lastName();
    validEmail = faker.internet.email();
    validPassword = faker.internet.password({ length: 8 });
	});

	it('cv base case', () => {
		cy.get('[name="name"]').clear();
		cy.get('[name="name"]').type(validName);
		cy.get('[name="lastName"]').clear();
		cy.get('[name="lastName"]').type(validLastName);
		cy.get('[name="email"]').clear();
		cy.get('[name="email"]').type(faker.internet.email());
    cy.get('#root [name="collegeId"]').select(validCollege)
		cy.get('[name="password"]').clear();
		cy.get('[name="password"]').type(validPassword);
		cy.get('[name="confirmPassword"]').clear();
		cy.get('[name="confirmPassword"]').type(validPassword);
		cy.get('#root button.w-full').click();
		cy.get('#root h1.text-text-title').should('have.text', 'Inicio de sesión');
	});

	it('should show error when name is missing', () => {
    cy.get('[name="lastName"]').type(validLastName);
    cy.get('[name="email"]').type(validEmail);
    cy.get('#root [name="collegeId"]').select(validCollege);
    cy.get('[name="password"]').type(validPassword);
    cy.get('[name="confirmPassword"]').type(validPassword);
    cy.get('#root button.w-full').click();
    cy.get('#root div:nth-child(2) > p.text-red-500').should('have.text', 'El nombre es requerido');
  });

 it('should show error when lastName is missing', () => {
   cy.get('[name="name"]').type(validName);
   cy.get('[name="email"]').type(validEmail);
   cy.get('#root [name="collegeId"]').select(validCollege);
   cy.get('[name="password"]').type(validPassword);
   cy.get('[name="confirmPassword"]').type(validPassword);
   cy.get('#root button.w-full').click();
   cy.get('#root div:nth-child(3) p.text-red-500').should('have.text', 'El apellido es requerido');
 });

 it('should show error when email is missing', () => {
   cy.get('[name="name"]').type(validName);
   cy.get('[name="lastName"]').type(validLastName);
   cy.get('#root [name="collegeId"]').select(validCollege);
   cy.get('[name="password"]').type(validPassword);
   cy.get('[name="confirmPassword"]').type(validPassword);
   cy.get('#root button.w-full').click();
   cy.get('#root div:nth-child(4) p.text-red-500').should('have.text', 'El correo electrónico no es válido');
 });

 it('should show error for invalid email format (email@)', () => {
   cy.get('[name="name"]').type(validName);
   cy.get('[name="lastName"]').type(validLastName);
   cy.get('[name="email"]').type('email@');
   cy.get('#root [name="collegeId"]').select('Escuela de Sistemas');
   cy.get('[name="password"]').type(validPassword);
   cy.get('[name="confirmPassword"]').type(validPassword);
   cy.get('#root button.w-full').click();
   cy.get('#root div:nth-child(4) p.text-red-500').should('have.text', 'El correo electrónico no es válido');
 });

 it('should show error for invalid email format (@email)', () => {
   cy.get('[name="name"]').type(validName);
   cy.get('[name="lastName"]').type(validLastName);
   cy.get('[name="email"]').type('@email');
   cy.get('#root [name="collegeId"]').select('Escuela de Sistemas');
   cy.get('[name="password"]').type(validPassword);
   cy.get('[name="confirmPassword"]').type(validPassword);
   cy.get('#root button.w-full').click();
   cy.get('#root div:nth-child(4) p.text-red-500').should('have.text', 'El correo electrónico no es válido');
 });

 it('should show error when email exists', () => {
   cy.get('[name="name"]').type(validName);
   cy.get('[name="lastName"]').type(validLastName);
 	 cy.get('[name="email"]').type(Cypress.env('ADMIN'));
   cy.get('#root [name="collegeId"]').select(validCollege);
   cy.get('[name="password"]').type(validPassword);
   cy.get('[name="confirmPassword"]').type(validPassword);
   cy.get('#root button.w-full').click();
   cy.get('#root div.Toastify__toast').should('have.text', 'El usuario ya existe o hay un error en los datos.');
 });

 it('should show error when collegeId is missing', () => {
   cy.get('[name="name"]').type(validName);
   cy.get('[name="lastName"]').type(validLastName);
   cy.get('[name="email"]').type(validEmail);
   cy.get('[name="password"]').type(validPassword);
   cy.get('[name="confirmPassword"]').type(validPassword);
   // No selecciona collegeId
   cy.get('#root button.w-full').click();
   cy.get('#root span.text-red-500').should('have.text', 'La escuela es requerida');
 });

 it('should show error when password is missing', () => {
   cy.get('[name="name"]').type(validName);
   cy.get('[name="lastName"]').type(validLastName);
   cy.get('[name="email"]').type(validEmail);
   cy.get('#root [name="collegeId"]').select(validCollege);
   cy.get('#root button.w-full').click();
   cy.get('#root div:nth-child(7) p.text-red-500').should('have.text', 'La contraseña debe tener al menos 6 caracteres');
 });

 it('should show error when passwords do not match', () => {
   const differentPassword = faker.internet.password({ length: 8 });
   cy.get('[name="name"]').type(validName);
   cy.get('[name="lastName"]').type(validLastName);
   cy.get('[name="email"]').type(validEmail);
   cy.get('#root [name="collegeId"]').select('Escuela de Sistemas');
   cy.get('[name="password"]').type(validPassword);
   cy.get('[name="confirmPassword"]').type(differentPassword);
   cy.get('#root button.w-full').click();
   cy.get('#root p.text-red-500').should('have.text', 'Las contraseñas no coinciden');
 });
});
