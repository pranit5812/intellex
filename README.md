# 🚀 Intellex — Decentralized P2P Skill Sharing Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <strong>Connect. Teach. Learn. Collaborate Live. Earn on-chain rewards.</strong>
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-setup">Environment Setup</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-author">Author</a>
</p>

</div>

---

## 📖 Overview

**Intellex** is an interactive, decentralized peer-to-peer (P2P) skill-sharing and mentorship platform. Instead of one-way passive tutorials, Intellex facilitates hands-on 1-on-1 collaborative sessions where peers teach each other in real time, review takeaways on an interactive dashboard, and earn verifiable Web3 NFT credentials.

---

## ✨ Key Features

### 1. 👥 Smart Peer Skill Matcher (`/match`)
- Find mentors and peer learners who can teach you the skills you need in exchange for what you know.
- Filter by skill categories (Machine Learning, Next.js, Solidity, TypeScript, Figma, Rust).
- One-click **"Instant Match & Connect"** that automatically schedules a collaboration session.
- Add your own custom peer profiles directly from the app.

### 2. 💻 Live Collaborative Workspace (`/session`)
- **🎨 Interactive Shared Whiteboard**: Full HTML5 canvas supporting color palettes, brush thickness, eraser, and PNG export for sketching system architectures and math.
- **⚡ Interactive IDLE Code Playground & Terminal**: Multi-language code editor (JavaScript/TypeScript, Python 3, Solidity) with built-in **"Run Code"** engine, keyboard shortcut (`Ctrl + Enter`), live IDLE output console, runtime error tracebacks, execution duration stats, and interactive `>>>` REPL prompt.
- **📝 Real-time Session Notes & Exporter**: Built-in Pomodoro/meeting timer and session notes pad with one-click **"Save Session to Dashboard"**.
- **📹 Live Audio/Video & 100ms Hub**: Integrated camera/mic preview, screen-sharing, and 100ms room connector.

### 3. 🎯 Collaboration Dashboard (`/dashboard`)
- **Interactive Metric Cards**: Total sessions, active peers, knowledge exchange hours, and reward tiers.
- **Search & Filter**: Find sessions instantly by participant name or discussion topics.
- **Custom Participant & Meeting Creator**: Add custom user pairs, roles, and discussion summaries with live cloud and local persistence.
- **Direct Workspace Launch**: Open any session directly in the collaborative workspace.

### 4. 🏆 Peer Arena, Leaderboard & 1v1 Skill Duels (`/leaderboard`)
- **⚔️ 1-on-1 Peer Challenge & Skill Duels**: Direct "Challenge" button on every peer row with custom battle modes (15-Min Speed Coding, Algorithm Duel, UI Sprint, and Co-Focus Pomodoro) and auto-generated duel room codes.
- **💎 Weekly League Divisions & Promotion Zones**: Diamond League Division 1 with live season countdown and promotion indicators for the top 3 learners.
- **💥 Head-to-Head Rival Showdown**: Interactive 1v1 stat comparison widget comparing sessions, study hours, streaks, and XP against any selected rival.
- **🎖️ 1-Click Digital Certificate & Award Claim**: Zero wallet setup required! Instant verifiable certificate generation with unique credential IDs and direct profile saving.
- **⚡ Live Community Duels Feed**: Open peer battles waiting for an opponent to accept and launch.

### 5. 📅 Interactive Study Calendar (`/calendar`)
- Monthly interactive calendar grid to schedule study sessions, meetups, and track assignment deadlines.
- Color-coded categories: **Study** (Blue), **Meeting** (Violet), **Deadline** (Red), and **Other** (Amber).
- Sidebar with upcoming 7-day schedule view, quick category counters, and modal event creator.
- Local persistence with instant view & delete options.

### 6. 📚 Curated Courses & Learning Roadmaps (`/courses`)
- Structured step-by-step roadmaps across 6 high-demand domains: **Web Development, AI/ML, Blockchain & Web3, UI/UX Design, DevOps & Cloud, and Data Science**.
- Curated direct links to the best free learning resources (MDN, freeCodeCamp, fast.ai, Coursera, Kaggle, CryptoZombies, etc.).
- Interactive checklist to track milestone completion with animated category progress bars.

### 7. 🤖 Intellex AI Assistant Chatbot (Global Widget)
- Floating AI assistant available on every page to answer user questions, explain platform features, and suggest roadmaps.
- Quick FAQ prompts for instant answers on room codes, peer matching, whiteboard features, and NFT badge claiming.

### 8. 🌐 Global Modern Navigation, Animated Background & Auth Guard
- Unified responsive navigation bar with active route indicators, mobile drawer, and smooth theme switching.
- Adaptive animated background tailored differently for both Light and Dark modes.
- Route protection via `<AuthGuard>` ensuring secure user access across all platform modules.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Components** | [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **Backend & Cloud Database** | [Firebase Authentication](https://firebase.google.com/products/auth), [Cloud Firestore](https://firebase.google.com/products/firestore) |
| **Web3 & Blockchain** | [Verbwire API](https://www.verbwire.com/) (ERC-721 NFT Minting on Polygon) |
| **Live Collaboration** | HTML5 Canvas, WebRTC Media Streams, 100ms Live |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/pranit5812/intellex.git
cd intellex
```

### 2. Install Dependencies

```bash
npm install
```
*(If you encounter peer dependency warnings, run: `npm install --legacy-peer-deps`)*

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```ini
# Firebase Configuration
NEXT_PUBLIC_API_KEY=your_firebase_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_APP_ID=your_app_id

# Verbwire API Configuration (For NFT minting)
VERBWIRE_API_KEY=your_verbwire_api_key
CONTRACT_ADDRESS=your_contract_address
CHAIN=mumbai
```

### 4. Configure Firebase Services

1. **Authentication**: Go to Firebase Console $\rightarrow$ **Authentication** $\rightarrow$ **Sign-in method** and enable **Google**.
2. **Firestore Database**: Create a Firestore Database with test/authenticated read and write permissions:
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

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
intellex/
├── app/
│   ├── api/verbwire/         # Verbwire NFT minting API route
│   ├── dashboard/            # Collaboration dashboard with stats & search
│   │   ├── create/           # Dedicated meeting creator page
│   │   └── page.tsx          # Main dashboard feed
│   ├── form/                 # Onboarding skill survey
│   ├── leaderboard/          # Rankings & Web3 NFT claim showcase
│   ├── match/                # Smart peer skill matching directory
│   ├── session/              # Live collaborative workspace (Whiteboard, Code, Notes)
│   ├── globals.css           # Global Tailwind stylesheet
│   ├── layout.tsx            # Root layout with unified navbar & theme
│   └── page.tsx              # Enhanced landing page
├── components/
│   ├── component/
│   │   ├── create-meeting-modal.tsx  # In-dashboard meeting creator modal
│   │   ├── navbar.tsx                # Unified responsive navigation header
│   │   └── summary/summary.tsx       # Meeting collaboration cards with copy & launch
│   └── ui/                   # Reusable UI primitives (Button, Card, Avatar, etc.)
├── lib/
│   ├── firebase.ts           # Firebase SDK initialization & auth helpers
│   ├── meetings.ts           # Persistent meeting engine (Firestore + LocalStorage)
│   └── questions.ts          # Onboarding survey questions
├── public/                   # Static assets & badge images
├── .env.local                # Local environment secrets (git-ignored)
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 👤 Author & Repository

- **Repository**: [https://github.com/pranit5812/intellex](https://github.com/pranit5812/intellex.git)
- **Owner**: [@pranit5812](https://github.com/pranit5812)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
