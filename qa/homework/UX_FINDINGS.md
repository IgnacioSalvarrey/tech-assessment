
## UX-01 — Inconsistent date format

**Area:** Booking / My Sessions

**Finding:**  
The same session date is displayed using different date formats in different parts of the application.

**Impact:**  
This may cause confusion for users when checking their session details.

**Recommendation:**  
Use a consistent date format throughout the application.

**Evidence:** 

In My Sessions, the date is displayed as:

01/09/2026 · 5:00 PM 
<img width="1030" height="251" alt="image" src="https://github.com/user-attachments/assets/ab99c80d-d533-4ea9-8199-a6b7adc85a41" />


In Dashboard, the date is displayed as:

09/01/2026 at 6:00 PM

<img width="1030" height="240" alt="image" src="https://github.com/user-attachments/assets/f1cab844-8f06-4c2d-b42b-bcd51558faee" />

## UX-02 — Incorrect pluralization in coach results

**Area:** Coach Search

**Finding:**  
When the search returns only one coach, the results counter displays "1 coaches found" instead of "1 coach found".

**Evidence:**  

<img width="1030" height="430" alt="image" src="https://github.com/user-attachments/assets/252dbea7-61ee-452d-aef2-42315e0d2a04" />

## UX-03 — Unclear optional field

**Area:** Session booking

**Finding:**  
The "What do you want to work on?" field can be left empty and the user can still confirm the session, but the field is not marked as optional.
The "Invite a guest" field is explicitly labeled as optional, while "What do you want to work on?" can also be left empty without preventing the booking, but it is not labeled as optional.

**Impact:**  
Users may be unsure whether the field is required to complete the booking.

**Recommendation:**  
Clearly indicate whether the field is required or optional. If it is optional, label it consistently with "Invite a guest (optional)".

<img width="455" height="561" alt="image" src="https://github.com/user-attachments/assets/7cefbf41-5cdb-4196-9d3f-da871a0b9460" />

## UX-04 — Session can be cancelled without confirmation

**Area:** My Sessions

**Finding:**
A confirmed session can be cancelled immediately by clicking "Cancel", without any confirmation step.

**Impact:**
Users could accidentally cancel a session without having an opportunity to review or confirm the action.

**Recommendation:**
Add a confirmation message before cancelling a session, such as "Are you sure you want to cancel this session?"

## UX-05 — No feedback when there are no search results

**Area:** Coach search

**Finding:**
When a search or filter returns no coaches, the application does not provide a clear message explaining that no results were found.

**Impact:**
Users may be unsure whether the search was processed correctly or whether there are simply no coaches matching their criteria.

**Recommendation:**
Display a clear empty-state message, such as "No coaches found matching your search. Try adjusting your filters."

<img width="1128" height="377" alt="image" src="https://github.com/user-attachments/assets/d40fb1c0-f18c-41ef-805b-b8824fe8396f" />

## UX-06 — Modals lack an easy way to close

**Area:** Session management

**Finding:**
The modals do not provide an "X" button to close them and clicking outside the modal does not close it either.

**Impact:**
Users may not have an obvious or convenient way to exit the modal without completing or cancelling the current action.

<img width="1053" height="631" alt="image" src="https://github.com/user-attachments/assets/32253d54-cced-4502-a2d2-5054de61b6fe" />

## UX-07 — Available time slots cannot be reached with Tab

**Area:** Session booking

**Finding:**
When booking a session, the available time slots cannot be reached or selected using the Tab key.

**Impact:**
Users who navigate the application using only the keyboard may not be able to select an available time slot and complete the booking.

**Recommendation:**
Make available time slots keyboard accessible and ensure they can receive focus and be selected using standard keyboard navigation.

**Recommendation:**
Provide a visible close button and consider allowing users to close the modal by clicking outside it or pressing the Escape key.



