/// <reference types="cypress" />

describe('Smoke tests', () => {
  it('loads the dashboard', () => {
    cy.visitApp('/index.html');

    cy.contains('h1', 'Good morning');
    cy.get('[data-testid="stat-upcoming"]').should('exist');
  });

  it('lists coaches', () => {
    cy.visitApp('/coaches.html');

    cy.get('[data-testid="coach-card"]')
      .should('have.length.greaterThan', 0);
  });
});