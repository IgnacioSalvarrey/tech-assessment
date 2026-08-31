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

[Bug-03-selected-time-does-not-match-displayed-time.mov](./evidence/Bug-03-selected-time-does-not-match-displayed-time.mov)

## Bug #4 – Cancelled session slot remains unavailable

**Severity:** Medium
**Priority:** High

### Steps to Reproduce

1. Click on **Coaches**.
2. Select a coach.
3. Select a specific date and time slot.
4. Book the session.
5. Go to **My Sessions**.
6. Cancel the booked session.
7. Return to the coach's available time slots.
8. Select the same date and check the previously booked time slot.

### Expected Result

After cancelling the session, the previously booked time slot should become available again so that it can be booked by the user or another user.

### Actual Result

After cancelling the session, the previously booked time slot remains unavailable and cannot be booked again.

### Evidence

[Bug-04-cancelled-session-slot-remains-unavailable.mov](./evidence/Bug-04-cancelled-session-slot-remains-unavailable.mov)

## Bug #5 – Rescheduling can be confirmed without selecting a new time slot

**Severity:** High
**Priority:** High

### Steps to Reproduce

1. Click on **Coaches**.
2. Select a coach.
3. Book the available time slots until there are no remaining slots for that coach on that day.
4. Go to **My Sessions**.
5. Select one of the booked sessions.
6. Click on **Reschedule**.
7. Select the same day.
8. Observe that there are no available time slots.
9. Click **Confirm** without selecting a new time slot.

### Expected Result

The **Confirm** button should be disabled, or the system should display a validation message indicating that a new time slot must be selected before confirming the reschedule.

### Actual Result

The system allows the user to confirm the rescheduling with no time slot selected.
After confirming, the session displays an invalid date/time:

NaN/NaN/NaN · NaN:00 AM

**Evidence** 

[Bug-05-reschedule-confirmed-without-time-slot.mov](./evidence/Bug-05-reschedule-confirmed-without-time-slot.mov)

<img width="1048" height="162" alt="image" src="https://github.com/user-attachments/assets/7d2d0792-9998-4d23-86dc-eb7b594e3a28" />

## Bug #6 – AI Coach accepts empty messages

**Severity:** Medium
**Priority:** Medium

### Steps to Reproduce

1. Go to **AI Coach**.
2. Leave the message input empty or enter only spaces.
3. Click **Send**.
4. Observe the conversation.

### Expected Result

The system should prevent the user from sending an empty message. The **Send** action should remain disabled or a validation message should be displayed.

### Actual Result

The AI Coach allows the user to send an empty message. The empty message is displayed in the conversation and **Ally generates a response**.

The generated response can also differ between attempts when sending an empty message.

### Evidence

<img width="1733" height="902" alt="image" src="https://github.com/user-attachments/assets/193924ac-9bb5-4e19-ad7a-4bd381827038" />

## BUG-07 — Sessions are not displayed in chronological order

**Severity:** Low **Priority:** Low

**Steps to reproduce:**

1. Open **My sessions**.
2. Have multiple sessions scheduled for the same date.
3. Review the order in which the sessions are displayed.

### Expected result
Sessions should be displayed in chronological order:

* 8:00 AM
* 2:00 PM
* 6:00 PM

### Actual result
Sessions can appear in an unexpected order, for example:

* 8:00 AM
* 6:00 PM
* 2:00 PM



**Evidence:**

<img width="1082" height="357" alt="image" src="https://github.com/user-attachments/assets/ff40d642-5f18-4413-8aab-63fe791aa2e2" />

## BUG-08 — User can book two coaches at the same date and time

**Severity:** Medium **Priority:** Medium

**Description:**
The application allows the same user to book sessions with two different coaches at the same date and time.

**Steps to reproduce:**

1. Book a session with a coach for an available date and time.
2. Return to the Coaches page.
3. Select a different coach.
4. Select the same date and time as the previously booked session.
5. Complete the booking.

### Actual result
The second session can be booked successfully even though the user already has another session scheduled for the same date and time.

### Expected result
The application should prevent the user from booking overlapping sessions or clearly indicate that the selected time conflicts with an existing session.

### Evidence

<img width="1010" height="222" alt="image" src="https://github.com/user-attachments/assets/09d4f819-a9f7-4b4c-89d3-615a10cd6832" />

## BUG-09 — Notes are truncated in My Sessions

**Severity:** Medium **Priority:** Medium

### Steps to reproduce:**

1. Start a new session booking.
2. Select an available coach, date and time.
3. Enter text in the **"What do you want to work on?"** field.
4. Complete the booking.
5. Open **My Sessions**.
6. Review the session details.

### Actual result
The text displayed for the session does not contain all of the characters entered during booking.

### Expected result
The complete text entered by the user should be displayed in the session details, or the application should clearly indicate if the field has a character limit.

### Evidence

[Evidence: BUG-09-notes-truncated-in-my-sessions.mov](./evidence/BUG-09-notes-truncated-in-my-sessions.mov)

## BUG-10 — Double booking when confirming a session twice

**Severity:** High **Priority:** High

**Description:**
Clicking the "Confirm booking" button twice quickly can create two sessions for the same booking.

###Steps to reproduce

1. Start a new session booking.
2. Select an available coach, date and time.
3. Click **Continue**.
4. On the confirmation screen, click **Confirm booking** twice quickly.
5. Open **My Sessions**.

### Actual result
Two sessions are created for the same coach, date and time.

### Expected result
Only one session should be created. The application should prevent duplicate submissions when the booking is being processed.

### Evidence

[Evidence: BUG-10-double-booking-confirm-click.mov](./evidence/BUG-10-double-booking-confirm-click.mov)

## BUG-11 — Session duration changes after rescheduling

**Severity:** High **Priority:** High

### Description
When a 60-minute session is rescheduled, its duration changes to 30 minutes.

### Steps to reproduce

1. Book a 60-minute session.
2. Open **My Sessions**.
3. Select the session and click **Reschedule**.
4. Select a new available date and time.
5. Save the changes.
6. Review the session duration.

### Expected result
The session should keep its original 60-minute duration after being rescheduled.

### Actual result
The session duration changes from 60 minutes to 30 minutes after rescheduling.

### Evidence












