# Bug Report

## BUG-01 — Coach Directory pagination does not respect active filters

**Severity:** Medium
**Priority:** Medium

### Environment

* Application: AceUp Console
* Browser: Google Chrome 151.0.7922.175
* OS: macOS
* Build seed: `2417`

### Preconditions

* User is on the **Coaches** page.

### Steps to Reproduce

1. Navigate to **Find a Coach**.
2. Apply a filter, for example **Specialty = Career**.
3. Observe the filtered result count.
4. Observe the pagination control.
5. Click **Next**.
6. Review the coaches displayed on the next page.
7. Repeat the test using a different filter, such as a coach name search or Languaje.

### Expected Result

* The pagination should be recalculated based on the filtered result set.
* The page count should accurately reflect the number of matching results.
* Only coaches matching the active filter should be displayed on subsequent pages.
* The **Next** button should be disabled when there are no additional filtered results.

### Actual Result

* The pagination remains **Page 1 of 3** after applying a filter, even when the filtered result set does not require three pages.
* The user can navigate to subsequent pages.
* Coaches that do not match the active filter can be displayed on subsequent pages.

### Evidence

### Evidence

[BUG-01 — Pagination/filter issue](./evidence/BUG-01-pagination-filter.mov)


## BUG-02 — Upcoming Sessions count is not updated after cancelling a session

**Severity:** Medium
**Priority:** Medium

### Environment

* Application: AceUp Console
* Browser: Google Chrome 151.0.7922.175
* OS: macOS
* Build seed: `2417`

### Preconditions

* User has at least one upcoming session.

### Steps to Reproduce

1. Navigate to the Dashboard.
2. Verify that the **Upcoming Sessions** count reflects the existing upcoming session(s).
3. Navigate to **My Sessions**.
4. Cancel the upcoming session.
5. Return to the Dashboard.
6. Refresh the page.
7. Observe the **Upcoming Sessions** count.

### Expected Result

The **Upcoming Sessions** count should be updated to reflect the current number of active upcoming sessions.

If all upcoming sessions have been cancelled, the count should display **0**.

### Actual Result

After cancelling the only upcoming session, the Dashboard continues to display **1 Upcoming Session** even after refreshing the page.

When a new upcoming session is created, the Dashboard correctly displays **1 Upcoming Session**, indicating that the count does not accurately reflect the current session state after cancellation.


### Evidence

[BUG-02 — Upcoming Sessions count](./evidence/BUG-02-upcoming-sessions.mov)

## Bug #3 – Selected booking time does not match displayed session time

**Severity:** Medium
**Priority:** Medium

### Steps to Reproduce

1. Click on **Coaches**.
2. Select a coach with available slots.
3. Select a date and time slot.
4. Book the session.
5. Go to **My Sessions**.
6. Check the scheduled time of the newly created session.

### Expected Result

The session should display the **same time that was selected during the booking process**.

### Actual Result

The time displayed for the booked session **does not match the time selected by the user**.

This issue occurs both when booking a new session and when editing an existing session.

### Evidence


