# AceUp QA Assessment — Test Plan

## Scope

The goal of the tests is to cover the main user journeys of the AceUp Console:

* Dashboard and coaches page
* Coach search
* Session booking
* Session cancellation
* Session rescheduling
* AI Coach

## Automated Tests

The Cypress suite currently includes:

* `smoke.cy.js` — verifies that the main pages load correctly.
* `coaches.cy.js` — verifies that a coach can be searched by name.
* `ai-coach.cy.js` — verifies that an empty message cannot be sent.
* `booking-session.cy.js` — verifies that a coaching session can be booked successfully.
* `cancel-session.cy.js` — verifies that a booked session can be cancelled.
* `reschedule-session.cy.js` — verifies that a booked session can be rescheduled.

## Test Data

The tests use the provided seed so that the same data is used between runs.

## Approach

I focused the automation on the main user flows and their expected results.

I used the existing `data-testid` attributes whenever possible and avoided fixed waits.

Each test is designed to run independently.

## Manual Findings

During exploratory testing, I identified several issues, including:

* Inconsistent date formats between pages.
* Possible timezone inconsistencies in displayed session times.
* `NaN/NaN/NaN · NaN:00 AM` appearing in certain situations.
* The rescheduling flow allowing confirmation without selecting a valid option in certain situations.
* The AI Coach accepting an empty message under certain conditions.

These findings were documented separately.

## Execution

To run the complete suite:

```bash
make test SEED=2417
```

The current suite contains **7 tests**, all passing successfully.

## Additional Business Rule

The application states that sessions can only be rescheduled up to 12 hours before they start.

Due to the available assessment time, I did not manually validate this rule or cover it with an automated test.
