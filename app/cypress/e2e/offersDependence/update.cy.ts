/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Update Offer Form', () => {
    const validCollege = 'Escuela de Sistemas';
    const validFaculty = 'Facultad de Ingeniería';
    const validDate = new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0];

    let validTitle: string;
    let validDescription: string;
    let validRequirements: string;

    beforeEach(() => {
        cy.visit(Cypress.env('login'));
        cy.get('[name="email"]').type(Cypress.env('DEPENDENCE'));
        cy.get('[name="password"]').type(Cypress.env('DEPENDENCE_PASSWORD'));
        cy.get('#root button.w-full').click();

        cy.get('#root a[href="/dependence/offers"] span').click();
        cy.get('#root button[aria-controls="radix-_r_0_"]').click();
        cy.get('#radix-_r_0_ button.hover\\:bg-blue-50').click();

        validTitle = faker.person.jobTitle();
        validDescription = faker.lorem.paragraph();
        validRequirements = faker.lorem.sentences(2);

    });

    it('cv base case (actualización exitosa)', () => {
        cy.get('[name="title"]').type(validTitle);
        cy.get('[name="description"]').type(validDescription);
        cy.get('[name="requirements"]').type(validRequirements);
        cy.get('#root [name="collegeId"]').select(validCollege);
        cy.get('#root [name="facultyId"]').select(validFaculty);
        cy.get('[data-cy="closeDate"]').type(validDate);
        cy.get('#root button.button-update').click();
        cy.url().should('include', '/dependence/offers');
        cy.get('#root table').should('contain.text', validTitle);
    });

    it('muestra error si falta solo el título', () => {
        cy.get('[name="title"]').clear();
        cy.get('#root button.button-update').click();
        cy.contains('El título es requerido').should('be.visible');
    });

    it('muestra error si falta la descripción', () => {
        cy.get('[name="description"]').clear();
        cy.get('#root button.button-update').click();
        cy.contains('La descripción es requerida').should('be.visible');
    });

    it('muestra error si faltan los requisitos', () => {
        cy.get('[name="requirements"]').clear();
        cy.get('#root button.button-update').click();
        cy.contains('Los requisitos son requeridos').should('be.visible');
    });

    it('muestra error si falta la escuela', () => {
        cy.get('[name="collegeId"]').select('');
        cy.get('#root button.button-update').click();
        cy.contains('La escuela es requerida').should('be.visible');
    });

    it('muestra error si falta la facultad', () => {
        cy.get('[name="facultyId"]').select('');
        cy.get('#root button.button-update').click();
        cy.contains('La facultad es requerida').should('be.visible');
    });
});
