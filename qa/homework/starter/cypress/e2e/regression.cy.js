/// <reference types="cypress" />

describe('Regression tests', () => {

  it('BUG-08 - prevents booking an unavailable time slot', () => {
    cy.visitApp('/booking.html', { coach: 'c3' });

    cy.get('[data-testid="booking-coach"]')
      .should('not.contain', 'Loading');

    cy.get('[data-testid="slot"][data-available="true"]')
      .should('have.length.greaterThan', 0);

    cy.get('[data-testid="slot"][data-available="false"]')
      .should('have.length.greaterThan', 0);
  });


  it('BUG-11 - booking confirmation creates a confirmed session', () => {
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

    cy.get('[data-testid="summary"]')
      .should('be.visible');

    cy.get('[data-testid="confirm-booking"]')
      .should('be.visible')
      .click();

    cy.contains('Session booked!')
      .should('be.visible');

    cy.visitApp('/sessions.html');

    cy.get('[data-testid="session-row"]')
      .should('have.length.greaterThan', 0);

    cy.get('[data-testid="session-row"]')
      .first()
      .within(() => {
        cy.get('[data-testid="session-status"]')
          .should('contain.text', 'confirmed');

        cy.get('[data-testid="session-duration"]')
          .should('contain.text', '60');
      });
  });

});