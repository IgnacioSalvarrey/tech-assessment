/// <reference types="cypress" />

describe('Session booking', () => {
  it('creates a confirmed session after completing a booking', () => {
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

    cy.get('[data-testid="sum-date"]')
      .invoke('text')
      .as('selectedDate');

    cy.get('[data-testid="sum-time"]')
      .invoke('text')
      .as('selectedTime');

    cy.get('[data-testid="booking-coach"]')
      .invoke('text')
      .as('selectedCoach');

    cy.get('[data-testid="confirm-booking"]')
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