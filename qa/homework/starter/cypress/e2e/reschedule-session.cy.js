/// <reference types="cypress" />

describe('Session rescheduling', () => {
  it('reschedules a booked session successfully', () => {
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
      .should('have.length.greaterThan', 0);

    cy.get('[data-testid="session-row"]')
      .first()
      .find('[data-testid="session-status"]')
      .should('contain.text', 'confirmed');

    cy.get('[data-testid="session-row"]')
      .first()
      .find('button')
      .contains('Reschedule')
      .click();

    cy.get('[data-testid="resched-day"]')
      .should('be.visible');

    cy.get('[data-testid="resched-day"]')
      .find('option')
      .should('have.length.greaterThan', 1);

    cy.get('[data-testid="resched-day"]')
      .find('option')
      .eq(1)
      .then(($option) => {
        const newDay = $option.val();

        cy.get('[data-testid="resched-day"]')
          .select(newDay);
      });

    cy.get('[data-testid="resched-hour"]')
      .find('option')
      .should('have.length.greaterThan', 1);

    cy.get('[data-testid="resched-hour"]')
      .find('option')
      .eq(1)
      .then(($option) => {
        const newHour = $option.val();

        cy.get('[data-testid="resched-hour"]')
          .select(newHour);
      });

    cy.get('[data-testid="resched-save"]')
      .click();

    cy.contains('Session updated')
      .should('be.visible');

    cy.get('[data-testid="session-row"]')
      .first()
      .find('[data-testid="session-status"]')
      .should('contain.text', 'confirmed');
  });
});