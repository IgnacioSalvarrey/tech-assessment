/// <reference types="cypress" />

describe('Session cancellation', () => {
  it('cancels a booked session successfully', () => {
    cy.visitApp('/booking.html', { coach: 'c3' });

    cy.get('[data-testid="booking-coach"]')
      .should('not.contain', 'Loading');

    cy.get('[data-testid="slot"][data-available="true"]')
      .should('have.length.greaterThan', 0)
      .first()
      .click();

    cy.get('[data-testid="continue"]')
      .should('be.enabled')
      .click();

    cy.get('[data-testid="confirm-booking"]')
      .click();

    cy.contains('Session booked!')
      .should('be.visible');

    cy.visitApp('/sessions.html');

    cy.get('[data-testid="session-row"]')
      .should('have.length.greaterThan', 0)
      .first()
      .within(() => {
        cy.get('.cancel')
          .click();
      });

    cy.contains('Session cancelled')
      .should('be.visible');

    cy.get('[data-testid="session-row"]')
      .first()
      .within(() => {
        cy.get('[data-testid="session-status"]')
          .should('contain.text', 'cancelled');
      });
  });
});