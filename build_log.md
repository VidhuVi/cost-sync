# Build Log: Meeting ROI Calculator
**Builder Name**: Vidhu P Vinod

## 1. What counts as 'too expensive'?
The calculator implements a strict two-tier expense threshold based on typical enterprise cost modeling:
- **High Cost Warning (> $1,000)**: Any meeting exceeding $1,000 total cost triggers a `WARN` state. This threshold is chosen because regular synchronization meetings shouldn't cost the equivalent of a substantial capital expenditure. It prompts the organizer to consider if every attendee is strictly necessary.
- **Expensive Status Update Reject (> $500 w/o action verbs)**: If a meeting costs more than $500 and the agenda lacks strong action verbs (e.g., decide, resolve, approve), it is deemed an "Expensive Status Update" and rejected (`REJECT`). Status updates should be handled asynchronously to save company time.

## 2. What to do for a part-time person?
Part-time employees are evaluated on a prorated basis relative to their hourly cost to the company, identical to full-time employees in this calculator. 
- **Rationale:** A meeting consumes *time*. Whether an employee works 20 hours or 40 hours a week, the hour spent in a meeting has a direct, calculable cost (`hourlyRate`). 
- **Implementation:** The user can input part-time employees simply by adding a custom participant (or selecting a role) with their specific prorated hourly rate. The cost is calculated universally as `(totalHourlyRate / 60) * durationInMinutes`.

## 3. Whether currency or timezone matters?
- **Currency:** The calculator is currently currency-agnostic on the backend, though the UI presents the cost in a generic dollar (`$`) format for familiarity. The fundamental logic (thresholds of 500 and 1000) represents a generalized unit of value. In a multi-national deployment, currency conversion would be required if participants are paid in different currencies, but for this MVP, all inputs are assumed to share a base currency.
- **Timezone:** Timezones do not affect the *cost calculation* or the *ROI recommendation engine*, as cost is purely a function of duration and rate. However, timezones *would* matter for the integration with calendar APIs (to actually send the invite) and for historical tracking. Currently, the `createdAt` timestamp is stored as a standardized ISO 8601 string in UTC to prevent timezone misalignment in the database.

## 4. What the agenda text should be judged on?
The agenda is judged on two primary vectors to enforce "meeting hygiene":
1. **Length (The "Vague Agenda" Rule):** If an agenda is present but shorter than 10 characters, it triggers a `WARN`. Extremely short agendas (e.g., "sync", "chat") indicate a lack of preparation and usually result in unstructured, unproductive time.
2. **Actionability (The "Status Update" Rule):** For meetings costing over $500, the agenda is scanned for "action verbs" (decide, resolve, approve, finalize, vote, plan). If none are found, the meeting is rejected. The hypothesis is that expensive meetings should be for *decision making* or *complex problem solving*, not simply reading out status updates that could be an email or Slack thread.
