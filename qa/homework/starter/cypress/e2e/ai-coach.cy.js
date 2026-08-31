/// <reference types="cypress" />

describe('AI Coach', () => {
  it('does not create a response when sending an empty message', () => {
    cy.visitApp('/chat.html');

    cy.get('[data-testid="bubble-ally"]')
      .should('have.length', 1);

    cy.get('[data-testid="chat-input"]')
      .clear();

    cy.get('[data-testid="chat-send"]')
      .click();

    cy.get('[data-testid="bubble-ally"]')
      .should('have.length', 1);
  });
});