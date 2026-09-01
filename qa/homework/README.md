AceUp QA Technical Assessment
Overview

This repository contains my QA assessment for the AceUp Console application.

The assessment includes:

Exploratory testing and defect identification
Functional and UX findings
Test planning
Cypress automated tests
Regression tests for identified defects
Evidence supporting reported issues
Test Environment
Application: AceUp Console
Test framework: Cypress
Browser: Electron (headless)
Execution environment: Docker
Build seed: 2417

The application uses the build seed to provide deterministic test data and behavior.

Running the Application

From the qa directory:

make start SEED=2417

The application will be available at:

http://localhost:4173
Running the Test Suite

From the qa directory:

make test SEED=2417

The complete Cypress suite can also be executed with:

docker compose run --rm cypress npx cypress run
Regression Tests

Two regression tests were added under:

homework/starter/cypress/e2e/regression.cy.js

These tests cover previously identified defects and verify that the affected functionality remains stable.

Test Results

The complete Cypress suite was executed successfully.

Current suite:

7 Cypress specs
9 automated tests
9 passing
0 failing

The regression suite contains 2 tests, both passing.

Deliverables
Test Plan

qa/TEST_PLAN.md

Contains the overall testing approach, scope, test coverage, risks, and execution strategy.

Bug Report

qa/homework/BUG_REPORT.md

Contains the defects identified during exploratory testing, including:

Severity / priority
Preconditions
Steps to reproduce
Expected result
Actual result
Evidence references
UX Findings

qa/homework/UX_FINDINGS.md

Contains usability and UX observations identified during testing.

Evidence

qa/homework/evidence/

Contains supporting evidence for selected defects.

Automated Tests

qa/homework/starter/cypress/e2e/

Contains the Cypress test suite, including the regression tests added as part of this assessment.

Notes

The tests were designed to focus on critical user journeys such as:

Coach discovery
Filtering and navigation
Booking a session
Session cancellation
Session rescheduling
AI Coach access
Regression coverage for identified defects

The application is treated as a client-side application using deterministic seeded data for the purposes of this assessment.
