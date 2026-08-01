# Build Log: Meeting ROI Calculator
**Builder Name**: Vidhu P Vinod

## 1. Core Requirements

**What counts as 'too expensive'?**
I decided to set two price thresholds to warn users about expensive meetings:
- **Over ₹10,000**: This triggers a simple warning. A single meeting costing over ten thousand rupees is a big investment, so it prompts the organizer to double-check if everyone really needs to be there.
- **Over ₹5,000 with a vague agenda**: If a meeting costs more than ₹5,000 and the agenda doesn't show a clear goal (missing action words like "decide", "resolve", or "approve"), the app rejects it. High-cost meetings should be for making decisions, not just giving status updates that could easily be an email.

**What to do for a part-time person?**
I decided to treat part-time workers the exact same as full-time workers by looking strictly at their hourly rate. 
Since a meeting consumes time regardless of how many hours a week someone works, their cost to the company for that specific hour is all that matters. Users can simply input their specific hourly rate into the calculator.

**Whether currency or timezone matters?**
- **Currency**: For this version, I kept it simple and assumed everyone is using the same base currency (Indian Rupees). Currency conversion isn't needed unless the company pays employees in multiple different currencies.
- **Timezone**: Timezones do not matter for calculating the cost, because cost is only based on the length of the meeting and the hourly rate. To keep the database clean and prevent errors when viewing the history page from different locations, I save all meeting times in a standard global format (UTC).

**What the agenda text should be judged on?**
I programmed the app to judge the agenda on two simple rules to enforce good meeting habits:
- **Length**: If the agenda is shorter than 10 characters (like just typing "sync" or "chat"), the app gives a warning. Meetings need clear, descriptive topics.
- **Action Words**: For expensive meetings (over ₹5,000), the app actively looks for action verbs like "decide", "resolve", "approve", "vote", or "finalize". If it can't find them, it assumes it's a status update meeting and rejects it.

---

## 2. Developer Experience & AI Collaboration

**What I chose to build and leave out**
I focused entirely on building a robust calculator with a clean UI, a solid recommendation engine, and a SQLite database for saving history (Parts A, B, and C). I left out complex features like calendar API integrations, multi-currency support, and full authentication. I wanted to ensure the core ROI calculation was perfectly polished before adding enterprise bloat.

**Where AI was wrong, weak, or hallucinated code, and how I fixed it**
The most significant AI hallucination occurred when converting the project currency from USD to INR. The AI blindly multiplied or assigned massive values to the hourly rates (e.g., assuming an Engineer makes ₹2,000/hr, which equates to over ₹40 Lakhs/year base pay, and an Executive making ₹6,000/hr or ₹1.2 Cr). I had to step in and provide accurate, realistic Indian salary data. I recalculated the rates based on a 2,000-hour work year using real averages:
- Engineer (Avg ₹10.5 LPA): Adjusted to ₹525/hr.
- Designer (Avg ₹8.5 LPA): Adjusted to ₹425/hr.
- Manager (Avg ₹16 LPA): Adjusted to ₹800/hr.
- Executive (Mid-sized C-Suite ₹50 LPA): Adjusted to ₹2,500/hr.
This also meant I had to recursively adjust all the application's logic thresholds down (from ₹20k to ₹10k for warnings) so they actually triggered during normal usage.

Additionally, the AI initially struggled with the layout spacing for the slider component and the navigation header. It generated a flexbox layout that caused the "Calculator" and "History" tabs to be slightly off-center because it didn't account for the width of the logo on the left. I identified this by testing the UI and fixed it by manually instructing the AI to use absolute positioning (`absolute left-1/2 -translate-x-1/2`) to force true centering.

**Where I pushed back or modified the AI-generated solution**
The AI originally wanted to use standard browser `alert()` popups for saving meetings because it was faster to implement. I pushed back on this because it ruined the "Professional Minimalism" aesthetic I was aiming for. I instructed the AI to rip out the alerts and build a custom, animated toast notification component that matched our Tailwind design system.

**Unclear/starred points I had to make decisions on**
The original prompt left the entire "Is this meeting worth it?" logic completely up to me. I had to decide what "worth it" actually meant mathematically. I decided that cost shouldn't be the *only* factor, but rather cost *multiplied* by the quality of the agenda. This is why I implemented the text-parsing rule to scan for action verbs in expensive meetings.

**Technical blockers I encountered and how I solved them**
I encountered a technical blocker with a layout shift issue. When switching between the main Calculator page (which was long enough to have a scrollbar) and the History page (which was short and didn't have a scrollbar), the entire screen would jump sideways by a few pixels. I solved this by adding an `overflow-y-scroll` class to the root HTML document, which forces the scrollbar track to always be visible, keeping the layout perfectly locked in place.
