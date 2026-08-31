/// <reference types="cypress" />

describe('Coaches search', () => {
  it('allows the user to search for a coach by name', () => {
    cy.visitApp('/coaches.html');

    cy.get('[data-testid="filter-search"]')
      .type('Yuki Tanaka');

    cy.get('[data-testid="coach-card"]')
      .should('have.length.greaterThan', 0)
      .and('contain.text', 'Yuki Tanaka');

    cy.get('[data-testid="result-count"]')
      .should('contain.text', '1');
  });
});