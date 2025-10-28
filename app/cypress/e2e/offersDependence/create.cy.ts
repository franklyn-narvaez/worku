/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Create Offer Form', () => {

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
        cy.get('#root button.bg-black').click();

        validTitle = faker.person.jobTitle();
        validDescription = faker.lorem.paragraph();
        validRequirements = faker.lorem.sentences(2);
    });

    it('cv base case (creación exitosa)', () => {
        cy.get('[name="title"]').type(validTitle);
        cy.get('[name="description"]').type(validDescription);
        cy.get('[name="requirements"]').type(validRequirements);
        cy.get('#root [name="collegeId"]').select(validCollege);
        cy.get('#root [name="facultyId"]').select(validFaculty);
        cy.get('[data-cy="closeDate"]').type(validDate);
        cy.get('#root button.button-create').click();
        cy.url().should('include', '/dependence/offers');
        cy.get('#root table').should('contain.text', validTitle);
    });

    it('debe mostrar errores cuando los campos están vacíos', () => {
        cy.get('#root button.button-create').click();
        cy.contains('El título es requerido');
        cy.contains('La descripción es requerida');
        cy.contains('Los requisitos son requeridos');
        cy.contains('La escuela es requerida');
        cy.contains('La facultad es requerida');
    });

    it('muestra error si falta solo el título', () => {
        cy.get('[name="description"]').type(validDescription);
        cy.get('[name="requirements"]').type(validRequirements);
        cy.get('#root [name="collegeId"]').select(validCollege);
        cy.get('#root [name="facultyId"]').select(validFaculty);
        cy.get('[data-cy="closeDate"]').type(validDate, { force: true });
        cy.get('#root button.button-create').click();
        cy.contains('El título es requerido');
    });

    it('muestra error si falta la descripción', () => {
        cy.get('[name="title"]').type(validTitle);
        cy.get('[name="requirements"]').type(validRequirements);
        cy.get('#root [name="collegeId"]').select(validCollege);
        cy.get('#root [name="facultyId"]').select(validFaculty);
        cy.get('[data-cy="closeDate"]').type(validDate);
        cy.get('#root button.button-create').click();
        cy.contains('La descripción es requerida');
    });

    it('muestra error si faltan los requisitos', () => {
        cy.get('[name="title"]').type(validTitle);
        cy.get('[name="description"]').type(validDescription);
        cy.get('#root [name="collegeId"]').select(validCollege);
        cy.get('#root [name="facultyId"]').select(validFaculty);
        cy.get('[data-cy="closeDate"]').type(validDate);
        cy.get('#root button.button-create').click();
        cy.contains('Los requisitos son requeridos');
    });

    it('muestra error si falta la escuela', () => {
        cy.get('[name="title"]').type(validTitle);
        cy.get('[name="description"]').type(validDescription);
        cy.get('[name="requirements"]').type(validRequirements);
        cy.get('#root [name="facultyId"]').select(validFaculty);
        cy.get('[data-cy="closeDate"]').type(validDate, { force: true });
        cy.get('#root button.button-create').click();
        cy.contains('La escuela es requerida');
    });

    it('muestra error si falta la facultad', () => {
        cy.get('[name="title"]').type(validTitle);
        cy.get('[name="description"]').type(validDescription);
        cy.get('[name="requirements"]').type(validRequirements);
        cy.get('#root [name="collegeId"]').select(validCollege);
        cy.get('[data-cy="closeDate"]').type(validDate, { force: true });
        cy.get('#root button.button-create').click();
        cy.contains('La facultad es requerida');
    });

    it('muestra error si falta la fecha de cierre', () => {
        cy.get('[name="title"]').type(validTitle);
        cy.get('[name="description"]').type(validDescription);
        cy.get('[name="requirements"]').type(validRequirements);
        cy.get('#root [name="collegeId"]').select(validCollege);
        cy.get('#root [name="facultyId"]').select(validFaculty);
        cy.get('#root button.button-create').click();
    });
});