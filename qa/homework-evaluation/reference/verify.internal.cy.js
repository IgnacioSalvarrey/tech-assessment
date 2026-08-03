/// <reference types="cypress" />

// INTERNAL verification harness (not for candidates).
// It asserts that every planted defect still reproduces. Tier B assertions are
// skipped automatically when the flag is not active for the current seed.

const SEED = Cypress.env('seed');

function fmtHour(h) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const x = h % 12 === 0 ? 12 : h % 12;
  return `${x}:00 ${suffix}`;
}

function ifFlag(name, fn) {
  cy.window().then((w) => {
    if (w.Fx(name)) {
      fn();
    } else {
      cy.log(`${name} inactive for seed ${SEED} — skipped`);
    }
  });
}

function openBooking(coach = 'c1') {
  cy.visitApp('/booking.html', { coach });
  cy.get('[data-testid="slot"]').should('have.length.greaterThan', 0);
}

function pickFirstSlot() {
  return cy.get('[data-testid="slot"][data-available="true"]').first();
}

function bookOnce({ coach = 'c1', duration, notes, guest } = {}) {
  openBooking(coach);
  pickFirstSlot().click();
  cy.get('[data-testid="continue"]').click();
  if (duration) cy.get('[data-testid="duration"]').select(String(duration));
  if (notes) cy.get('[data-testid="notes"]').invoke('val', notes).trigger('input');
  if (guest) cy.get('[data-testid="guest-email"]').type(guest);
  cy.get('[data-testid="confirm-booking"]').click();
}

describe(`planted defects (seed ${SEED})`, () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('A1 — stored time drifts by the coach offset (c2 = UTC-5)', () => {
    let hour;
    openBooking('c2');
    pickFirstSlot()
      .then(($el) => {
        hour = Number($el.attr('data-hour'));
      })
      .click();
    cy.get('[data-testid="continue"]').click();
    cy.then(() => {
      cy.get('[data-testid="sum-time"]').should('have.text', fmtHour(hour));
    });
    cy.get('[data-testid="confirm-booking"]').click();
    cy.get('#confirm-modal').should('not.have.class', 'open');

    cy.visitApp('/sessions.html');
    cy.then(() => {
      cy.get('[data-testid="session-when"]').should('contain', fmtHour(hour - 5));
    });
  });

  it('A2 — double click on Confirm creates two sessions', () => {
    openBooking();
    pickFirstSlot().click();
    cy.get('[data-testid="continue"]').click();
    cy.get('[data-testid="confirm-booking"]').click().click();
    // both requests are in flight; navigating now would abort them, so wait on state
    cy.window().should((w) => {
      expect(w.AceUpStore.sessions()).to.have.length(2);
    });
    cy.visitApp('/sessions.html');
    cy.get('[data-testid="session-row"]').should('have.length', 2);
  });

  it('A3 — cancelling does not free the slot', () => {
    let hour;
    openBooking();
    pickFirstSlot()
      .then(($el) => {
        hour = Number($el.attr('data-hour'));
      })
      .click();
    cy.get('[data-testid="continue"]').click();
    cy.get('[data-testid="confirm-booking"]').click();
    cy.get('#confirm-modal').should('not.have.class', 'open');

    cy.visitApp('/sessions.html');
    cy.contains('button', 'Cancel').click();
    cy.get('[data-testid="session-status"]').should('have.text', 'cancelled');

    openBooking();
    cy.then(() => {
      cy.get(`[data-testid="slot"][data-hour="${hour}"]`).should(
        'have.attr',
        'data-available',
        'false'
      );
    });
  });

  it('A4 — whitespace-only chat message is accepted', () => {
    cy.visitApp('/chat.html');
    cy.get('[data-testid="chat-input"]').type('   ');
    cy.get('[data-testid="chat-send"]').click();
    cy.get('[data-testid="bubble-user"]').should('have.length', 1);
    cy.get('[data-testid="bubble-ally"]').should('have.length', 2);
  });

  it('A5 — notes are silently truncated at 280 characters', () => {
    const long = 'x'.repeat(400);
    bookOnce({ notes: long });
    cy.get('#confirm-modal').should('not.have.class', 'open');
    cy.visitApp('/sessions.html');
    cy.get('[data-testid="session-row"] .hint')
      .invoke('text')
      .should('have.length', 280);
  });

  it('B1 — filter is dropped on page 2', () => {
    cy.visitApp('/coaches.html');
    ifFlag('fx_b1', () => {
      cy.get('[data-testid="filter-specialty"]').select('Leadership');
      cy.get('[data-testid="result-count"]').should('have.text', '3 coaches found');
      cy.get('[data-testid="page-label"]').should('have.text', 'Page 1 of 3');
      cy.get('#next').click();
      cy.get('[data-testid="coach-card"]').should('have.length', 4);
      cy.get('[data-testid="coach-card"] .tag')
        .invoke('text')
        .should('not.match', /^(Leadership.*){4}$/);
    });
  });

  it('B2 — reschedule resets duration to 30', () => {
    cy.visitApp('/coaches.html');
    ifFlag('fx_b2', () => {
      bookOnce({ duration: 60 });
      cy.get('#confirm-modal').should('not.have.class', 'open');
      cy.visitApp('/sessions.html');
      cy.get('[data-testid="session-duration"]').should('have.text', '60');
      cy.contains('button', 'Reschedule').click();
      cy.get('[data-testid="resched-hour"] option').should('have.length.greaterThan', 0);
      cy.get('[data-testid="resched-save"]').click();
      cy.get('[data-testid="session-duration"]').should('have.text', '30');
    });
  });

  it('B3 — success toast on a failed booking', () => {
    cy.visitApp('/coaches.html');
    ifFlag('fx_b3', () => {
      bookOnce();
      cy.get('#confirm-modal').should('not.have.class', 'open');
      bookOnce();
      cy.get('#confirm-modal').should('not.have.class', 'open');
      bookOnce();
      cy.get('#confirm-modal').should('not.have.class', 'open');
      // 4th attempt fails server-side but still reports success
      bookOnce();
      cy.get('#toast').should('contain', 'Session booked');
      cy.visitApp('/sessions.html');
      cy.get('[data-testid="session-row"]').should('have.length', 3);
    });
  });

  it('B4 — chat hangs after a failed reply', () => {
    cy.visitApp('/chat.html');
    ifFlag('fx_b4', () => {
      cy.get('[data-testid="chat-input"]').type('hello{enter}');
      cy.get('[data-testid="bubble-ally"]').should('have.length', 2);
      cy.get('[data-testid="chat-input"]').type('and my goals?{enter}');
      cy.get('[data-testid="bubble-ally"]').should('have.length', 3);
      cy.get('[data-testid="chat-input"]').type('third one{enter}');
      cy.get('[data-testid="typing"]', { timeout: 8000 }).should('have.class', 'show');
      cy.wait(2500); // harness only: prove the state never recovers
      cy.get('[data-testid="typing"]').should('have.class', 'show');
      cy.get('[data-testid="chat-input"]').should('be.disabled');
    });
  });

  it('B5 — invalid guest email is accepted', () => {
    cy.visitApp('/coaches.html');
    ifFlag('fx_b5', () => {
      bookOnce({ guest: 'alex@company' });
      cy.get('#confirm-modal').should('not.have.class', 'open');
      cy.visitApp('/sessions.html');
      cy.get('[data-testid="session-row"]').should('have.length', 1);
    });
  });

  it('B6 — dashboard count is stale after cancelling', () => {
    cy.visitApp('/coaches.html');
    ifFlag('fx_b6', () => {
      bookOnce({ coach: 'c1' });
      cy.get('#confirm-modal').should('not.have.class', 'open');
      bookOnce({ coach: 'c3' });
      cy.get('#confirm-modal').should('not.have.class', 'open');

      cy.visitApp('/index.html');
      cy.get('[data-testid="stat-upcoming"]').should('have.text', '2');

      cy.visitApp('/sessions.html');
      cy.contains('button', 'Cancel').click();
      cy.get('[data-testid="session-status"]').should('contain', 'cancelled');

      cy.visitApp('/index.html');
      cy.get('[data-testid="stat-upcoming"]').should('have.text', '2');
    });
  });
});
