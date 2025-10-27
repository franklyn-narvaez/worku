/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Create User Form', () => {
    const validCollege = 'Escuela de Sistemas';
    const validRole = 'Estudiante';

    let validName: string;
    let validLastName: string;
    let validEmail: string;

    beforeEach(() => {
        cy.visit(Cypress.env('login'));
        cy.get('[name="email"]').type(Cypress.env('ADMIN'));
        cy.get('[name="password"]').type(Cypress.env('PASSWORD'));
        cy.get('#root button.w-full').click();

        cy.get('#root a[href="/admin/users"] span').click();
        cy.get('#root button.bg-black').click();

        validName = faker.person.firstName();
        validLastName = faker.person.lastName();
        validEmail = faker.internet.email();
    });

    it('cv base case (creación exitosa)', () => {
        cy.get('[name="name"]').click();
        cy.get('[name="name"]').type(validName);
        cy.get('[name="lastName"]').type(validLastName);
        cy.get('[name="email"]').click();
        cy.get('[name="email"]').type(validEmail);
        cy.get('#root [name="collegeId"]').select(validCollege);
        cy.get('#root [name="roleId"]').select(validRole);
        cy.get('#root button.button-create').click();
        cy.url().should('include', '/admin/users');
        cy.get('#root table').should('contain.text', validName);
    });

    it('muestra error cuando falta el nombre', () => {
        cy.get('[name="lastName"]').type(validLastName);
        cy.get('[name="email"]').type(validEmail);
        cy.get('[name="collegeId"]').select(validCollege);
        cy.get('[name="roleId"]').select(validRole);
        cy.get('button.button-create').click();

        cy.contains('El nombre es requerido').should('be.visible');
    });

    it('muestra error cuando falta el apellido', () => {
        cy.get('[name="name"]').type(validName);
        cy.get('[name="email"]').type(validEmail);
        cy.get('[name="collegeId"]').select(validCollege);
        cy.get('[name="roleId"]').select(validRole);
        cy.get('button.button-create').click();

        cy.contains('El apellido es requerido').should('be.visible');
    });

    it('muestra error cuando falta el correo', () => {
        cy.get('[name="name"]').type(validName);
        cy.get('[name="lastName"]').type(validLastName);
        cy.get('[name="collegeId"]').select(validCollege);
        cy.get('[name="roleId"]').select(validRole);
        cy.get('button.button-create').click();

        cy.contains('El correo electrónico no es válido').should('be.visible');
    });

    it('muestra error cuando el correo no es válido', () => {
        cy.get('[name="name"]').type(validName);
        cy.get('[name="lastName"]').type(validLastName);
        cy.get('[name="email"]').type('correo_invalido');
        cy.get('[name="collegeId"]').select(validCollege);
        cy.get('[name="roleId"]').select(validRole);
        cy.get('button.button-create').click();

        cy.contains('El correo electrónico no es válido').should('be.visible');
    });

    it('muestra error cuando falta la escuela', () => {
        cy.get('[name="name"]').type(validName);
        cy.get('[name="lastName"]').type(validLastName);
        cy.get('[name="email"]').type(validEmail);
        cy.get('[name="roleId"]').select(validRole);
        cy.get('button.button-create').click();

        cy.contains('La escuela es requerida').should('be.visible');
    });

    it('muestra error cuando falta el rol', () => {
        cy.get('[name="name"]').type(validName);
        cy.get('[name="lastName"]').type(validLastName);
        cy.get('[name="email"]').type(validEmail);
        cy.get('[name="collegeId"]').select(validCollege);
        cy.get('button.button-create').click();

        cy.contains('El rol es requerido').should('be.visible');
    });

    it('redirige al presionar Cancelar', () => {
        cy.get('button').contains('Cancelar').click();
        cy.url().should('include', '/admin/users');
    });
});
