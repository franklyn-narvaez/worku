/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Update User Form', () => {
    const validCollege = 'Escuela de Sistemas';
    const validRole = 'Estudiante';
    const validStatus = 'ACTIVE';

    let validName: string;
    let validLastName: string;
    let validEmail: string;

    beforeEach(() => {
        cy.visit(Cypress.env('login'));
        cy.get('[name="email"]').type(Cypress.env('ADMIN'));
        cy.get('[name="password"]').type(Cypress.env('PASSWORD'));
        cy.get('#root button.w-full').click();

        cy.get('#root a[href="/admin/users"] span').click();
        cy.get('#root tr:nth-child(2) button.text-blue-500').click();

        validName = faker.person.firstName();
        validLastName = faker.person.lastName();
        validEmail = faker.internet.email();
    });

    it('cv base case success update', () => {
        cy.get('[name="name"]').clear().type(validName);
        cy.get('[name="lastName"]').clear().type(validLastName);
        cy.get('[name="email"]').clear().type(validEmail);
        cy.get('[name="collegeId"]').select(validCollege);
        cy.get('[name="roleId"]').select(validRole);
        cy.get('[name="status"]').select(validStatus);
        cy.get('#root button.button-update').click();
        cy.url().should('include', '/admin/users');
        cy.get('#root table').should('contain.text', validName);
        cy.get('#root table').should('contain.text', validEmail);
    });

    it('muestra error si falta el nombre', () => {
        cy.get('[name="name"]').clear();
        cy.get('button.button-update').click();
        cy.contains('El nombre es requerido').should('be.visible');
    });

    it('muestra error si falta el apellido', () => {
        cy.get('[name="lastName"]').clear();
        cy.get('button.button-update').click();
        cy.contains('El apellido es requerido').should('be.visible');
    });

    it('muestra error si falta el correo', () => {
        cy.get('[name="email"]').clear();
        cy.get('button.button-update').click();
        cy.contains('El correo electrónico no es válido').should('be.visible');
    });

    it('muestra error si el correo no tiene formato válido', () => {
        cy.get('[name="email"]').clear().type('correo_invalido');
        cy.get('button.button-update').click();
    });

    it('muestra error si no se selecciona escuela', () => {
        cy.get('[name="collegeId"]').select('');
        cy.get('button.button-update').click();
        cy.contains('La escuela es requerida').should('be.visible');
    });

    it('muestra error si no se selecciona rol', () => {
        cy.get('[name="roleId"]').select('');
        cy.get('button.button-update').click();
        cy.contains('El rol es requerido').should('be.visible');
    });

    it('muestra error si no se selecciona estado', () => {
        cy.get('[name="status"]').select('');
        cy.get('button.button-update').click();
        cy.contains('Selecciona un estado válido').should('be.visible');
    });

    it('redirige correctamente al presionar Cancelar', () => {
        cy.get('button').contains('Cancelar').click();
        cy.url().should('include', '/admin/users');
    });
});