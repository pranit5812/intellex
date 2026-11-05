# 🚀 Intellex — Decentralized P2P Skill Sharing Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <strong>Connect. Teach. Learn. Earn on-chain rewards.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment Setup</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-author">Author</a>
</p>

</div>

---

## 📖 Overview

**Intellex** is a decentralized, peer-to-peer skill-sharing platform designed to transform how people learn online. Instead of passive video watching, Intellex facilitates 1-on-1 collaborative sessions where peers exchange real-world skills, mentor each other, and receive verifiable Web3 NFT badges for weekly achievements.

Whether you want to learn Web Development, AI/Machine Learning, Quantum Computing, or UI/UX Design, Intellex matches you with experienced partners for hands-on, interactive learning.

---

## ✨ Features

- **🎯 Interactive Collaboration Dashboard**: Track past and active peer collaborations, review takeaways, and manage participant profiles.
- **👥 Custom User & Meeting Creation**: Add custom participants, role descriptions, and key takeaway points with instant live updates and cloud persistence.
- **🤝 Smart Skill Matching**: Survey onboarding captures user strengths and goals to find ideal skill-sharing counterparts.
- **📹 1-on-1 Interactive Video Sessions**: Integrated live audio/video rooms powered by 100ms for face-to-face mentorship.
- **🏆 Gamified Leaderboard & Web3 NFT Awards**: Weekly leaderboard tracking top learners, integrated with Verbwire to mint on-chain NFT reward badges.
- **🔐 Google Authentication & Cloud Firestore**: Seamless Google login, user profiles, and Firestore synchronization.
- **🌓 Dark / Light Theme**: Built-in responsive dark mode supported by Tailwind CSS and `next-themes`.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Components** | [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **Backend & Database** | [Firebase Authentication](https://firebase.google.com/products/auth), [Cloud Firestore](https://firebase.google.com/products/firestore) |
| **Web3 & Blockchain** | [Verbwire API](https://www.verbwire.com/) (NFT Minting) |
| **Live Video** | [100ms Live](https://www.100ms.live/) (`@100mslive/roomkit-react`) |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- A [Firebase](https://console.firebase.google.com/) account (free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/pranit5812/intellex.git
cd intellex
```

### 2. Install Dependencies

```bash
npm install
```
*(If you encounter peer dependency warnings with 100ms packages, run: `npm install --legacy-peer-deps`)*

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File
```

Populate `.env.local` with your configuration:

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
2. **Firestore Database**: Create a Firestore Database in **Test Mode** (or ensure read/write rules allow authenticated users):
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

Open [http://localhost:3000](http://localhost:3000) in your browser to start exploring Intellex!

---

## 📁 Project Structure

```text
intellex/
├── app/
│   ├── api/
│   │   └── verbwire/         # Verbwire NFT minting API route
│   ├── dashboard/
│   │   ├── create/           # Dedicated custom meeting/user creation page
│   │   └── page.tsx          # Collaboration dashboard
│   ├── form/                 # Onboarding skill survey
│   ├── leaderboard/          # Top learners leaderboard & NFT claims
│   ├── session/              # 100ms video call room
│   ├── globals.css           # Global Tailwind stylesheet
│   ├── layout.tsx            # Root layout with ThemeProvider
│   └── page.tsx              # Landing page
├── components/
│   ├── component/
│   │   ├── create-meeting-modal.tsx  # In-dashboard meeting creator modal
│   │   ├── navbar.tsx                # Navigation header
│   │   └── summary/summary.tsx       # Meeting collaboration cards
│   └── ui/                   # Reusable UI primitives (Button, Card, Avatar, etc.)
├── lib/
│   ├── firebase.ts           # Firebase SDK initialization & auth helpers
│   ├── meetings.ts           # Meeting persistence (Firestore + LocalStorage)
│   └── questions.ts          # Onboarding survey questions
├── public/                   # Static assets & badge images
├── .env.local                # Local environment secrets (git-ignored)
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server on port 3000 |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Starts Next.js production server |
| `npm run lint` | Runs ESLint code style and syntax checks |

---

## 👤 Author & Repository

- **Repository**: [https://github.com/pranit5812/intellex](https://github.com/pranit5812/intellex.git)
- **Owner**: [@pranit5812](https://github.com/pranit5812)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
