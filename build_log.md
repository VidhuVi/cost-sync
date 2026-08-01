# Build Log: Meeting ROI Calculator
**Builder Name**: Vidhu P Vinod

## 1. What counts as 'too expensive'?
I decided to set two price thresholds to warn users about expensive meetings:
- **Over $1,000**: This triggers a simple warning. A single meeting costing over a thousand dollars is a big investment, so it prompts the organizer to double-check if everyone really needs to be there.
- **Over $500 with a vague agenda**: If a meeting costs more than $500 and the agenda doesn't show a clear goal (missing action words like "decide", "resolve", or "approve"), the app rejects it. High-cost meetings should be for making decisions, not just giving status updates that could easily be an email.

## 2. What to do for a part-time person?
I decided to treat part-time workers the exact same as full-time workers by looking strictly at their hourly rate. 
Since a meeting consumes time regardless of how many hours a week someone works, their cost to the company for that specific hour is all that matters. Users can simply input their specific hourly rate into the calculator.

## 3. Whether currency or timezone matters?
- **Currency**: For this version, I kept it simple and assumed everyone is using the same base currency (US Dollars). Currency conversion isn't needed unless the company pays employees in multiple different currencies.
- **Timezone**: Timezones do not matter for calculating the cost, because cost is only based on the length of the meeting and the hourly rate. To keep the database clean and prevent errors when viewing the history page from different locations, I save all meeting times in a standard global format (UTC).

## 4. What the agenda text should be judged on?
I programmed the app to judge the agenda on two simple rules to enforce good meeting habits:
- **Length**: If the agenda is shorter than 10 characters (like just typing "sync" or "chat"), the app gives a warning. Meetings need clear, descriptive topics.
- **Action Words**: For expensive meetings (over $500), the app actively looks for action verbs like "decide", "resolve", "approve", "vote", or "finalize". If it can't find them, it assumes it's a status update meeting and rejects it.
