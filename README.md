# 🚀 Intellex — Decentralized P2P Skill-Sharing & Competitive Learning Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>Exchange Skills 1-on-1 • Live Whiteboard & IDLE Code Runner • Proctored 1v1 Skill Battles • Curated Roadmaps • Verifiable Digital Credentials</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-platform-architecture">Architecture</a> •
  <a href="#-core-modules--features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-author--repository">Author</a>
</p>

</div>

---

## 📖 Overview

**Intellex** is an interactive, peer-to-peer (P2P) collaborative study and skill-exchange ecosystem. Instead of one-way passive video tutorials, Intellex facilitates real-time 1-on-1 interactive sessions where learners teach and learn from each other, compete in proctored live skill battles, follow curated milestone roadmaps, schedule study sprints on an interactive calendar, and earn verifiable achievement credentials.

---

## 🏗️ Platform Architecture

```text
                                  ┌─────────────────────────────┐
                                  │      Intellex Landing       │
                                  │     (Adaptive Themes)       │
                                  └──────────────┬──────────────┘
                                                 │
                                     [ Google Authentication ]
                                                 ▼
                  ┌─────────────────────────────────────────────────────────────┐
                  │                 Protected Platform Dashboard                │
                  └──────┬───────────────────────┬───────────────────────┬──────┘
                         │                       │                       │
                         ▼                       ▼                       ▼
            ┌────────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
            │   Peer Match (/match)  │  │ Calendar & Tasks │  │ Courses & Tracks │
            │ Filter by ML, Web3, JS │  │  (/calendar)     │  │  (/courses)      │
            └────────────┬───────────┘  └──────────────────┘  └──────────────────┘
                         │
                         ├────────────────────────────────────────┐
                         ▼                                        ▼
      ┌────────────────────────────────────┐   ┌────────────────────────────────────┐
      │   Live Session Space (/session)    │   │     1v1 Battle Arena (/battle)     │
      ├────────────────────────────────────┤   ├────────────────────────────────────┤
      │ • HTML5 Collaborative Whiteboard   │   │ • Automated Debugging Challenges   │
      │ • IDLE Code Playground (JS/Py/Sol) │   │ • Rapid-Fire Technical MCQs        │
      │ • Instant Execution & Output REPL  │   │ • Speed Palindrome / Algo Sprint   │
      │ • Hardware Camera & Screen Share   │   │ • WebRTC Camera Proctoring         │
      │ • Pomodoro Timer & Notes Exporter  │   │ • Anti-Cheat Window / Tab Lock     │
      └──────────────────┬─────────────────┘   │ • Instant Win & Battle Points (+1) │
                         │                     └──────────────────┬─────────────────┘
                         └───────────────────┬────────────────────┘
                                             ▼
                               ┌───────────────────────────┐
                               │ Leaderboard & League Rank │
                               │ 1-Click Distinction Certs │
                               │      (/leaderboard)       │
                               └───────────────────────────┘
```

---

## ✨ Core Modules & Features

### 1. ⚔️ Live 1v1 Skill Battle Arena (`/battle`)
A competitive, proctored test environment where two learners duel in real time with synchronized challenges:
- **Identical Standardized Testing**: Both contenders solve the exact same rounds:
  1. 🐞 **Code Debugging Challenge**: System provides live buggy functions (`findUniqueNumbers` with state and comparison bugs). Learners debug and execute against automated unit tests.
  2. 🧠 **Rapid-Fire Technical MCQs**: Multi-topic timed quiz (JavaScript type coercion, BST algorithmic time complexity, React memoization hooks).
  3. ⚡ **Speed Algorithm Sprint**: Live algorithmic problem solving (`isPalindromeValid` with casing/punctuation sanitization) validated with test suites.
- **🎥 Mandatory Camera Proctoring**: Real-time webcam HUD (`getUserMedia`). If the camera is disabled or blocked, a proctor barrier pauses progress.
- **🔌 Automatic Camera Power-Down**: Once the battle round concludes or is won, physical camera hardware tracks are terminated immediately (`track.stop()`) so camera LEDs do not remain on.
- **🛡️ Anti-Cheat Screen Lock**: Continuous background monitoring (`document.visibilitychange` & `window.blur`). Tab or window switches trigger warning modals and increment strike counters.
- **⏱️ Precision Stopwatch & Instant Win**: The first contender to solve and pass all 3 tests instantly triggers victory. Time is recorded to the millisecond (`mm:ss.s`), awarding **+1 Battle Win Point** to the victor.

---

### 2. 💻 Live Collaborative Workspace (`/session`)
A multi-purpose digital study room for 1-on-1 peer learning:
- **🎨 Interactive Shared Whiteboard**: HTML5 canvas supporting customizable color palettes, adjustable brush thickness, eraser mode, clear canvas, and one-click PNG diagram export.
- **⚡ In-Browser IDLE Code Playground & Terminal**:
  - Multi-language support: **JavaScript / TypeScript**, **Python 3 (Client-side IDLE)**, and **Solidity (Web3)**.
  - **Run Code** engine with shortcut (<kbd>Ctrl</kbd> + <kbd>Enter</kbd>).
  - Clean indentation handler (<kbd>Tab</kbd> inserts 2 spaces without losing editor focus).
  - IDLE-style interactive terminal output shell with distinct colored streams (`stdout`, `stderr`, `system`, and return values).
  - Interactive `>>>` REPL prompt to test single-line expressions on the fly.
  - Simulated Solidity EVM compilation with bytecode estimation, gas calculation, and mock contract deployment.
- **📝 Real-time Session Notes & Exporter**: Integrated Pomodoro timer and meeting scratchpad with one-click **"Save Session to Dashboard"**.
- **📹 Hardware-Safe Audio/Video**: Native WebRTC webcam toggle, microphone controls, and screen-sharing with guaranteed track cleanup on disconnect.

---

### 3. 👥 Smart Peer Skill Matcher (`/match`)
- Find mentors and study partners filtered by domains: **Machine Learning**, **Next.js**, **Solidity**, **TypeScript**, **UI/UX (Figma)**, and **Rust**.
- One-click **"Instant Match & Connect"** that auto-generates a unique room code (`INTX-XXXX-XXXX`) and schedules a study session.
- Add and persist custom peer profiles directly within the platform.

---

### 4. 🏆 Leaderboard, League Divisions & Digital Credentials (`/leaderboard`)
- **💎 Weekly League System**: Diamond League Division 1 with promotion indicators for the top 3 learners and live season countdown timers.
- **⚔️ Peer Challenge System**: Interactive **"Challenge"** button beside every learner on the leaderboard with customized battle stakes (+150 XP, +200 XP).
- **💥 1v1 Head-to-Head Showdown Widget**: Real-time stats comparison radar comparing completed sessions, study hours, active streaks (🔥), and XP against any selected rival.
- **🎖️ Zero-Wallet 1-Click Achievement Awards**: No crypto wallet or gas fee barrier! Instant verifiable certificate generation with unique credential IDs (`INTX-CERT-XXXXXX`) that save directly to the learner's profile.

---

### 5. 📅 Interactive Study Calendar (`/calendar`)
- Monthly visual calendar grid with previous/next month navigation and a **"Today"** quick return button.
- Color-coded event tagging:
  - 🔵 **Study Sessions**
  - 🟣 **Peer Meetings**
  - 🔴 **Project Deadlines**
  - 🟡 **Other Milestones**
- Click any date to add events with custom times, titles, categories, and descriptions.
- **Upcoming 7-Day Sidebar**: Real-time list of events scheduled over the next week with category metric counters.
- Local persistence via `intellex_calendar_events`.

---

### 6. 📚 Curated Learning Roadmaps (`/courses`)
- Structured, milestone-based learning tracks across 6 high-demand disciplines:
  1. **Web Development** (HTML/CSS, JavaScript, React, Next.js)
  2. **AI & Machine Learning** (Python, ML Foundations, Deep Learning, NLP & LLMs)
  3. **Blockchain & Web3** (Blockchain Basics, Solidity, DApps, DeFi & NFTs)
  4. **UI/UX Design** (Design Systems, Figma Mastery, Prototyping, Usability Testing)
  5. **DevOps & Cloud** (Git/GitHub, Docker, Kubernetes, CI/CD, AWS)
  6. **Data Science** (Statistics, Pandas, Data Visualization, SQL)
- Direct links to top free educational resources (MDN, freeCodeCamp, fast.ai, Coursera, Kaggle, CryptoZombies, etc.).
- Interactive checklist saving your completion progress with dynamic animated percentage progress bars.

---

### 7. 🤖 Intellex AI Assistant Chatbot (Global Widget)
- Floating assistant available on every page to guide learners through platform capabilities.
- Intelligent intent engine answering queries regarding meeting creation, room codes, peer matching, IDLE code execution, roadmaps, and battle rules.
- Quick FAQ suggestion pills, typing animation, and unread notification badge.

---

### 8. 🎯 Collaboration Dashboard (`/dashboard`)
- Real-time metric cards: Total Sessions, Active Peers, Learning Hours, and Reward Tiers.
- Search and filter collaboration summaries by participant name or discussion keywords.
- Dedicated meeting creator modal and full-page session scheduler.

---

### 9. 🎨 Adaptive Animated Background & Theme Engine
- Custom animated background built with GPU-accelerated CSS keyframe floating orbs and blueprint grid textures.
- Automatically adjusts color palettes and glow intensities for both **Light** (warm paper & pastel gradients) and **Dark** (deep obsidian & cyan/violet auroras) modes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **UI Library** | [React 18](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.3](https://tailwindcss.com/), [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate) |
| **Components & Icons** | [Radix UI Primitives](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Auth & Cloud DB** | [Firebase 10](https://firebase.google.com/) (Google Authentication, Cloud Firestore) |
| **Media & Live Feeds** | HTML5 Canvas, WebRTC `navigator.mediaDevices` |
| **Client Code Runner** | Custom In-Browser JavaScript/Python Transpiler & Output Console |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.x or higher)

### 1. Clone the Repository

```bash
git clone https://github.com/pranit5812/intellex.git
cd intellex
```

### 2. Install Dependencies

```bash
npm install
```
> *Note: If peer dependency warnings arise due to nested packages, run `npm install --legacy-peer-deps`.*

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```ini
# Firebase Client Configuration
NEXT_PUBLIC_API_KEY=your_firebase_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
```

### 4. Configure Firebase Authentication

1. In the [Firebase Console](https://console.firebase.google.com/), navigate to **Authentication** $\rightarrow$ **Sign-in method**.
2. Enable **Google** as a sign-in provider.
3. In **Firestore Database**, configure rules for authenticated read/write access:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### 5. Start the Development Server

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser to experience Intellex.

---

## 📁 Project Structure

```text
intellex/
├── app/
│   ├── battle/               # 1v1 Skill Battle Arena (Debugging, MCQs, Proctoring)
│   │   └── page.tsx
│   ├── calendar/             # Interactive Monthly Study Calendar & Upcoming Sidebar
│   │   └── page.tsx
│   ├── courses/              # 6 Curated Learning Tracks with Progress Checklists
│   │   └── page.tsx
│   ├── dashboard/            # Collaboration Dashboard & Metric Cards
│   │   ├── create/           # Full-page Meeting & Room Code Creator
│   │   └── page.tsx
│   ├── form/                 # Onboarding Skill Survey
│   │   └── page.tsx
│   ├── leaderboard/          # Peer Arena, League Rankings & 1-Click Certificates
│   │   └── page.tsx
│   ├── match/                # Smart Peer Skill Matcher Directory
│   │   └── page.tsx
│   ├── session/              # Live Workspace (Whiteboard, IDLE Code Runner, Notes)
│   │   └── page.tsx
│   ├── globals.css           # Global Tailwind Theme & Keyframe Animations
│   ├── layout.tsx            # Root Layout (Theme, Auth, Background, Chatbot)
│   └── page.tsx              # Landing Page with Hero & Feature Grid
├── components/
│   ├── animated-background.tsx # Adaptive Light/Dark Theme Background Orbs
│   ├── auth-guard.tsx        # Route Protection Lock Screen
│   ├── auth-provider.tsx     # Global Firebase Auth State Context
│   ├── chatbot.tsx           # Floating AI Platform Assistant Widget
│   ├── component/
│   │   ├── create-meeting-modal.tsx  # In-Dashboard Meeting Creator Modal
│   │   ├── mode-toggle.tsx           # Light/Dark Theme Switcher
│   │   ├── navbar.tsx                # Responsive Header with Navigation Drawer
│   │   └── summary/summary.tsx       # Meeting Cards with Join & Share Links
│   └── ui/                   # Radix Primitives (Button, Card, Avatar, Table, Input, etc.)
├── lib/
│   ├── firebase.ts           # Firebase SDK Initialization & Google Sign-In
│   ├── get-user-data.ts      # Firestore User Profile Fetcher
│   ├── meetings.ts           # Persistent Meeting Engine (Firestore + LocalStorage)
│   ├── questions.ts          # Onboarding Survey Configuration
│   └── sign-in-or-create.ts  # Google Auth Sign-In / User Profile Provisioning
├── public/                   # Static Brand Assets, Icons & Gold Badge Image
├── .env.local                # Local Environment Variables (Git-Ignored)
├── package.json              # Dependencies, Scripts & Metadata
├── tailwind.config.ts        # Tailwind CSS Configuration & Tokens
└── tsconfig.json             # TypeScript Compiler Options
```

---

## 🔒 Security & Privacy

- **Protected Routes**: All core collaborative areas (`/dashboard`, `/session`, `/battle`, `/calendar`, `/courses`, `/match`, `/leaderboard`) are wrapped with `<AuthGuard>`, restricting access to authenticated users.
- **Hardware Safety**: WebRTC camera and microphone streams are explicitly terminated upon component unmount, battle completion, or manual toggle to prevent lingering hardware activity.
- **Client-Side Anti-Cheat**: Active window visibility listeners prevent unauthorized screen-switching during competitive testing rounds.

---

## 👤 Author & Repository

- **Project Owner**: **Pranit** ([@pranit5812](https://github.com/pranit5812))
- **Source Repository**: [https://github.com/pranit5812/intellex](https://github.com/pranit5812/intellex.git)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
