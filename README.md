# CostSync: Meeting ROI Calculator

**CostSync** is a full-stack Next.js web application designed to help teams quantify the true cost of their meetings and evaluate whether they are truly necessary before sending out the calendar invite.

## 🚀 Features

### 1. Dynamic Cost Calculator (Part A)
Easily add attendees by their role (Engineer, Manager, Designer, Executive) and set the meeting duration using a slider. The total company cost updates in real-time. Part-time employees or external contractors can also be accounted for by prorating their hourly rates.

### 2. Value Assessment Engine (Part B)
A built-in logic engine evaluates the meeting's Return on Investment (ROI) based on two primary factors:
*   **Total Cost Thresholds**: Meetings costing over ₹1,000 trigger a `WARN` flag, prompting organizers to reconsider the attendee list.
*   **Agenda Hygiene**: For meetings costing over ₹500, the provided agenda is strictly analyzed. If it lacks strong action verbs (e.g., *decide, resolve, approve, vote*), the meeting is flagged as a `REJECT`. This prevents expensive, unstructured status updates that could simply be an email.

### 3. Persistent History (Part C)
Approved meetings can be saved directly into a local database. The **History** dashboard allows users to review past estimated meetings, their agendas, and their total financial footprint on the company.

## 🛠️ Technology Stack
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (v4) with custom design tokens (8pt grid, Inter & Geist fonts)
*   **Database:** SQLite (via `better-sqlite3`)
*   **Icons:** Lucide React & Google Material Symbols

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/VidhuVi/cost-sync.git
   cd cost-sync
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

The local SQLite database will be automatically initialized in a `data/` folder upon your first meeting save.

## 📝 Design Philosophy
CostSync was built with "Professional Minimalism" in mind. The interface is clean, free of clutter, and uses subtle micro-animations to ensure interactions feel premium and highly responsive.
