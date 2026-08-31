
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
