# Ekatra UI — WhatsApp Learning Bot Admin Dashboard

A clean, high-contrast, gimmick-free operator admin dashboard for managing student WhatsApp microlearning bots, day-by-day lesson sequences, cohort progress, and live student doubt resolution.

Built with **pure Vanilla CSS**, modular **ES6 JavaScript**, and **Vite** — no heavy frameworks or decorative AI gimmicks.

---

## Features

### 1. Day-by-Day Course Sequencer & Live Preview
- Structure microlearning curricula day-by-day (Lesson text, Media headers, Interactive quick-reply buttons, Quiz questions with instant answer validation).
- Real-time side-by-side phone simulator showing authentic WhatsApp light-theme chat bubbles (`#d9fdd3` sent / `#ffffff` received) as you type.

### 2. Student Roster & Live WhatsApp Chat Drawer
- Track cohort progress (`Day X / Y`, quiz accuracy %, last active timestamp, doubt status tags).
- Slide-over drawer with the full WhatsApp transcript and an educator reply box to immediately message the student.

### 3. Doubt Resolution Desk (Live Inbox)
- Split-pane conversation desk automatically filtering students who asked questions or triggered the doubt keyword (`"Needs Help"`).
- Operator takeover to answer questions directly over WhatsApp.

### 4. Cohort Broadcasts & Automated Nudges
- Queue cohort reminders, attendance nudges, or curriculum announcements.
- Select from approved Meta Cloud API (WABA) message templates with variable mapping.
- Audit past broadcasts with sent, delivered, read, and response rates.

### 5. Meta Cloud API (WABA) Template Inspector
- View approved WhatsApp business templates (`UTILITY`, `MARKETING`) and language codes.
- Inspect raw JSON payloads for webhook and template integration.

### 6. Interactive WhatsApp Bot Simulator
- Docked simulator at the bottom-right of the dashboard to test bot conversation flows (`START`, quiz answers `A/B/C`, `STATUS`, doubts) without using real WhatsApp message credits.

### 7. Dual-Mode Backend Service Layer
- **Mock / Local Storage Mode**: Works out of the box with seeded demo courses, students, and chat history.
- **Live Backend API (REST)**: Toggle instantly in Settings to connect your production or local backend (`http://localhost:8000/api/v1`).

---

## Tech Stack

- **Core**: HTML5, ES6 Modules
- **Styles**: Pure Vanilla CSS (CSS Custom Properties design system, responsive flex/grid layouts, no Tailwind)
- **Tooling**: [Vite](https://vitejs.dev/) for fast development and lightweight production builds
- **Icons**: SVG icon system for crisp rendering at any DPI

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/atharvalepse/ekatra-ui.git
cd ekatra-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Connecting to Your Backend

1. Open the dashboard and navigate to **Settings** (or click the **Backend** pill in the top header).
2. Switch **Backend Mode** to **Live Backend API (REST)**.
3. Enter your backend base URL (e.g. `http://localhost:8000/api/v1`).
4. Click **Save Settings & Test Connection**.

The frontend interacts with the following REST endpoints:
- `GET /stats/overview`
- `GET /courses` & `POST /courses`
- `GET /students`
- `GET /students/:id/messages`
- `POST /students/:id/reply`
- `POST /broadcasts`
- `GET /meta/templates`

---

## License

MIT
