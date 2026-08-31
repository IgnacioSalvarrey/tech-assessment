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

