# 🐍 PyBot — Python Learning Assistant

> **A SaaS-style chatbot that answers Python questions independently, one at a time — with no conversation history.**

[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://octocat-github-io.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-octocat.github.io-222?logo=github)](https://github.com/hariganeshlanganuru-svg/octocat.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Assignment](https://img.shields.io/badge/GenAI%20Assignment-SureTrust-purple)](https://suretrust.org)
[![Status](https://img.shields.io/badge/Status-Demo%20Mode-orange)](#demo-mode)

---

## Table of Contents

1. [Project Title & Overview](#1-project-title--overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Target Users](#4-target-users)
5. [Features](#5-features)
6. [No-History Behavior — Explained](#6-no-history-behavior--explained)
7. [Technology Stack](#7-technology-stack)
8. [Project Folder Structure](#8-project-folder-structure)
9. [Installation & Local Testing](#9-installation--local-testing)
10. [Demo Mode Explanation](#10-demo-mode-explanation)
11. [AI Backend Configuration](#11-ai-backend-configuration)
12. [Security Precautions](#12-security-precautions)
13. [Testing Instructions](#13-testing-instructions)
14. [GitHub Repository Setup](#14-github-repository-setup)
15. [GitHub Pages Deployment](#15-github-pages-deployment)
16. [Backend Deployment](#16-backend-deployment)
17. [Troubleshooting](#17-troubleshooting)
18. [Known Limitations & Future Enhancements](#18-known-limitations--future-enhancements)
19. [Project Credits](#19-project-credits)

---

## 1. Project Title & Overview

**Project Title:** PyBot — Python Learning Assistant  
**Assignment:** Chatbot Without History — GenAI Assignment, SureTrust  
**Version:** 1.0  
**Date:** October 2026

PyBot is a modern, SaaS-style single-page web application that helps beginners learn Python programming. Users can type any Python question — about variables, loops, functions, OOP, exceptions, or interview topics — and receive a clear, beginner-friendly answer.

The application is built around one defining principle: **every question is handled completely independently**. No previous questions or answers are ever included in the AI request for the current question. There is no conversation memory, no session history, no context carried forward. Just your question and an answer — fresh every time.

The frontend is a pure HTML5, CSS3, and Vanilla JavaScript static site, ready to deploy to GitHub Pages at zero cost. A demo mode is included so the application works out of the box without any API keys or backend setup.

**Live Demo:** [https://octocat-github-io.vercel.app](https://octocat-github-io.vercel.app)  
**GitHub Repo:** [https://github.com/hariganeshlanganuru-svg/octocat.github.io](https://github.com/hariganeshlanganuru-svg/octocat.github.io)

---

## 2. Problem Statement

Most beginner Python learners need quick, direct answers to individual questions — "What is a list?", "How does a for loop work?", "What is recursion?" — but existing AI chatbots are designed for multi-turn conversations. This creates two problems:

1. **Context drift** — earlier questions influence later answers in unexpected ways, sometimes causing confusion
2. **Unnecessary complexity** — for simple, independent question-answering, conversation memory adds overhead without adding value

PyBot solves both by removing conversation history entirely. The architecture is deliberately stateless: each question stands alone, and the answer is never contaminated by anything asked before.

---

## 3. Project Objectives

- Build a functional, polished SaaS-style website for a GenAI assignment
- Demonstrate a clear and correctly implemented "chatbot without history" architecture
- Cover the full Python learning curriculum for beginners
- Deploy a static frontend to GitHub Pages at no cost
- Implement a secure integration path for a real AI backend (optional, documented below)
- Provide a working demo mode that does not fake AI responses

---

## 4. Target Users

| User Type | Description |
|-----------|-------------|
| Absolute Beginners | Students taking their first Python course who need clear explanations of basic concepts |
| Interview Preppers | Students preparing for campus placements who want concise Python interview answers |
| Occasional Learners | Working professionals who revisit Python periodically and want stateless, independent answers |
| Instructors / Evaluators | Faculty or mentors reviewing this GenAI assignment for correctness and quality |

---

## 5. Features

### Core Features

- **Stateless Chatbot** — Every question is processed completely independently. No history, no memory, no context carryover.
- **Python Learning Niche** — Covers Python basics, data types, loops, functions, OOP, exceptions, and interview questions.
- **Suggested Questions** — Six clickable question chips to get started instantly.
- **Demo Mode** — Pre-written beginner-friendly responses for all suggested questions. No API key required.
- **Clear Chat** — Removes all visible messages and resets the input with a single click.
- **Loading Indicator** — Visible spinner while a response is being fetched.
- **Error Handling** — User-friendly messages for empty input, failed requests, and invalid responses.
- **Empty Input Rejection** — Whitespace-only submissions are caught and rejected before any request is made.

### Design Features

- **SaaS-Quality UI** — Polished interface inspired by modern AI chat products like ChatGPT and Claude.
- **Light / Dark Theme Toggle** — Switches between themes; preference saved to localStorage.
- **Fully Responsive** — Works correctly on phones (320px), tablets, and desktop screens (2560px+).
- **Smooth Scroll Navigation** — Hero buttons and nav links scroll smoothly to their target sections.
- **Accessible** — Semantic HTML, keyboard navigation, ARIA labels, visible focus states.

### Security Features

- **No API Keys in Frontend** — Credentials are never placed in HTML, CSS, or JavaScript files.
- **Safe DOM Rendering** — User input rendered via `textContent`, never raw `innerHTML`.
- **Backend Input Validation** — Length limits and type checks applied before the AI call.
- **Rate Limiting** — Backend limits requests per IP to prevent abuse.

---

## 6. No-History Behavior — Explained

This is the most important concept in this project. Read this section carefully.

### What It Means

A **chatbot without history** processes each user question as a completely independent request. It does not send previous messages to the AI model when handling a new question.

### What Happens on Each Request

Every request to the AI model contains exactly two things:

```
1. A fixed system prompt:
   "You are PyBot, a Python learning assistant.
    Answer only the current question. Do not reference
    previous questions. Be beginner-friendly."

2. The current user question:
   "What is a list in Python?"
```

Nothing else. No previous user messages. No previous assistant responses. No conversation array. No session ID.

### Visual Example

```
User asks:    "What is Python?"
AI receives:  system_prompt + "What is Python?"
AI answers:   "Python is a high-level language..."

User asks:    "Explain for loops."
AI receives:  system_prompt + "Explain for loops."
              ← NO reference to "What is Python?" or its answer
AI answers:   "A for loop iterates over a sequence..."
```

### What It Does NOT Mean

"Without history" does **not** mean messages disappear from the screen immediately. The chat area shows the current session's messages as a visual log so you can read the answers. However:

- These displayed messages are **never sent** to the AI when you ask a new question
- Clicking **Clear Chat** removes them from the screen
- Refreshing or closing the browser clears them permanently (nothing is saved)

### How to Verify This Yourself

1. Open your browser (Chrome or Firefox)
2. Press `F12` to open Developer Tools
3. Click the **Network** tab
4. Ask Question 1 in the chatbot
5. Click on the network request that was made
6. Click **Payload** or **Request Body**
7. You will see only: `{ "question": "your first question" }`
8. Ask Question 2
9. Check the payload again — you will see only: `{ "question": "your second question" }`
10. Question 1 and its answer are absent from the payload. This confirms no history is sent.

---

## 7. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Markup | HTML5 | — | Page structure and semantics |
| Styling | CSS3 | — | Responsive layout, themes, animations |
| Interactivity | JavaScript (ES6+) | — | Chat logic, theme toggle, navigation |
| Backend (optional) | Python + Flask | 3.10+ / 2.x | Secure AI API proxy |
| AI Provider (optional) | OpenAI API | GPT-3.5/4 | Language model for real answers |
| Version Control | Git | 2.x | Source control |
| Hosting (Frontend) | GitHub Pages | — | Free static site hosting |
| Hosting (Backend) | Render / Railway | — | Free-tier Python hosting |

**Why no framework?**
The assignment targets GitHub Pages, which hosts static files only. Vanilla JavaScript with no build step means the project deploys directly from the repository with zero configuration.

---

## 8. Project Folder Structure

```
chatbot-without-history/
│
├── index.html              ← Single-page application (all sections in one file)
├── style.css               ← All styles: layout, themes, responsive, animations
├── script.js               ← All logic: chat, demo mode, theme, navigation
├── README.md               ← This file — complete project documentation
├── PRD.md                  ← Product Requirements Document
├── .gitignore              ← Excludes .env, __pycache__, node_modules, DS_Store
│
└── backend/                ← Optional — deploy separately for real AI
    ├── app.py              ← Flask API with /api/chat endpoint
    ├── requirements.txt    ← Python dependencies (flask, openai, flask-limiter)
    ├── .env.example        ← Safe placeholder — copy to .env and fill in your key
    └── README.md           ← Backend-specific setup and deployment guide
```

### File Responsibilities

**`index.html`**
The entire single-page application. Contains all sections: navigation, hero, chat workspace, features, about, and footer. References `style.css` and `script.js` using relative paths.

**`style.css`**
All visual styling. Includes CSS custom properties (variables) for the light and dark themes, responsive breakpoints, chat bubble styles, button states, loading animations, and layout grids.

**`script.js`**
All frontend logic:
- Chat message handling (send, display, clear)
- Demo mode response lookup
- Backend API call (when configured)
- No-history enforcement (each request built fresh)
- Theme toggle and localStorage persistence
- Smooth scroll navigation
- Input validation
- Loading and error states

**`backend/app.py`** *(optional)*
A minimal Flask API. Accepts `POST /api/chat` with `{ "question": "..." }`, constructs the AI payload (system prompt + current question only), calls the OpenAI API, and returns `{ "answer": "..." }`. Includes input validation, rate limiting, and CORS.

---

## 9. Installation & Local Testing

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari)
- Git installed on your machine ([git-scm.com](https://git-scm.com))
- A text editor (VS Code recommended)

### Step 1 — Clone the Repository

```bash
git init
git remote add origin https://github.com/hariganeshlanganuru-svg/octocat.github.io.git
git add index.html style.css script.js README.md PRD.md .gitignore
git commit -m "Add PyBot Python Learning Assistant"
git branch -M main
git push -u origin main
```

### Step 2 — Open the Frontend

**Option A — Direct file open (simplest)**

Open `index.html` directly in your browser:
- On Windows: double-click `index.html`, or right-click → Open with → Chrome
- On Mac: `open index.html`

The website runs entirely in the browser. No server is needed for demo mode.

**Option B — Local HTTP server (recommended for accurate testing)**

Using Python (if installed):
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

Using Node.js (if installed):
```bash
npx serve .
```

### Step 3 — Verify the Website

Confirm the following work before testing further:

- [ ] The page loads with no error messages
- [ ] The navigation bar is visible
- [ ] The hero section shows the heading "Learn Python, One Question at a Time"
- [ ] The chat workspace appears below the hero
- [ ] The browser console (F12 → Console) shows no JavaScript errors

### Step 4 — Test Demo Mode

1. Type "What is Python?" into the chat input and press Enter (or click Send)
2. The demo banner should be visible at the top of the chat
3. A pre-written response should appear in the chat area
4. Ask a second question — the second request should not reference the first

See [Section 13 — Testing Instructions](#13-testing-instructions) for the full test checklist.

---

## 10. Demo Mode Explanation

### What Is Demo Mode?

Demo mode is the default operating mode of PyBot. It activates when no real AI backend is configured.

In demo mode:
- The chat interface is **fully functional**
- Pre-written, accurate, beginner-friendly Python answers are returned
- A clearly visible banner reads: **"Demo Mode — Sample responses only. Not a real AI."**
- The no-history rule still applies: each demo response is looked up independently

### Why Demo Mode Exists

GitHub Pages cannot run server-side code. A real AI API key cannot be placed in public JavaScript files. Demo mode solves both constraints: the site works on GitHub Pages, looks fully functional, and is honest about what it is.

### Demo Mode Is Honest

Demo mode never:
- Pretends to call a real AI API
- Shows a fake loading spinner for a fake network call
- Claims responses are AI-generated when they are not

### Demo Mode Responses Available For

| Question | Response |
|----------|----------|
| "What is Python?" | Overview of Python as a high-level language |
| "Explain variables" | Variables as named containers with type inference |
| "List vs Tuple — what's the difference?" | Mutability comparison with examples |
| "Explain for and while loops" | Both loop types with syntax examples |
| "What is a function?" | Functions as reusable blocks of code |
| "Explain mutable and immutable objects" | Mutability with list vs string example |

For any question not in this list, demo mode returns:
> "This is Demo Mode. I have sample answers for the suggested questions above. To get live AI answers for any Python question, connect a real AI backend. See the README for setup instructions."

---

## 11. AI Backend Configuration

Follow these steps to enable real AI responses. This requires a separate backend deployment — GitHub Pages cannot run the backend itself.

### Step 1 — Obtain an API Key

Sign up at [platform.openai.com](https://platform.openai.com) and create an API key.  
Never share this key or commit it to version control.

### Step 2 — Set Up the Backend Locally

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` in a text editor and fill in your key:

```env
OPENAI_API_KEY=sk-your-actual-key-here
FLASK_ENV=production
ALLOWED_ORIGIN=https://your-username.github.io
```

### Step 3 — Run the Backend Locally

```bash
python app.py
```

The backend starts at `http://localhost:5000`.

### Step 4 — Connect the Frontend to the Backend

Open `script.js` and find the configuration block near the top:

```javascript
const CONFIG = {
  backendUrl: '',          // ← Paste your backend URL here
  demoMode: true,          // ← Set to false when backend is running
};
```

Change it to:

```javascript
const CONFIG = {
  backendUrl: 'http://localhost:5000',
  demoMode: false,
};
```

### Step 5 — Test the Connection

Restart your local server and ask a question. Real AI responses should appear without the demo banner.

### Step 6 — Deploy the Backend (for Production)

See [Section 16 — Backend Deployment](#16-backend-deployment) for instructions on deploying to Render or Railway.

After deploying, update `backendUrl` to your deployed URL (e.g., `https://pybot-api.onrender.com`) and push the frontend update.

---

## 12. Security Precautions

### What Has Been Done

| Precaution | Implementation |
|------------|----------------|
| No API keys in frontend | Keys are only in `.env` on the backend server |
| `.env` excluded from Git | Listed in `.gitignore` — never committed |
| `.env.example` provided | Contains only placeholder values |
| Safe DOM rendering | User input displayed with `textContent`, not `innerHTML` |
| Input validation | Backend rejects empty strings and input over 500 characters |
| Rate limiting | Backend limits to 20 requests per minute per IP address |
| CORS restriction | Backend allows only the configured frontend origin |
| No key logging | API keys are never written to logs or error responses |

### What You Must Do

1. **Never paste your real API key into `script.js`, `index.html`, or any committed file**
2. **Verify `.env` is in `.gitignore` before committing**
3. **Run `git status` before every commit** — if `.env` appears, add it to `.gitignore` immediately
4. **If you accidentally commit a key**, revoke it immediately at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and generate a new one
5. **Set CORS** on the backend to your exact GitHub Pages URL, not `*` (wildcard)

### Checking for Accidental Secrets

Before pushing to GitHub, run:

```bash
git log --all --full-history -- .env
```

If `.env` appears in the log, it was committed. Revoke the key immediately, remove the file from history, and generate a new key.

---

## 13. Testing Instructions

### Manual Test Checklist

Run through each test and confirm the expected result.

#### Page Load

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Open `index.html` in browser | Page loads, no blank screen |
| 2 | Open DevTools Console (F12) | Zero JavaScript errors |
| 3 | Check that `style.css` loaded | Styles are applied (not plain HTML) |
| 4 | Check that `script.js` loaded | Buttons are interactive |

#### Navigation

| # | Test | Expected Result |
|---|------|-----------------|
| 5 | Click "Start Learning" button | Smoothly scrolls to chat workspace |
| 6 | Click "Explore Features" button | Smoothly scrolls to Features section |
| 7 | Click "Features" in nav | Scrolls to Features section |
| 8 | Click "About" in nav | Scrolls to About section |
| 9 | Click theme toggle | UI switches between light and dark |
| 10 | Refresh the page after toggling dark mode | Dark mode is remembered |

#### Chat — Input Validation

| # | Test | Expected Result |
|---|------|-----------------|
| 11 | Click Send with empty input | Error: "Please enter a question" |
| 12 | Type spaces only, click Send | Same error as empty input |
| 13 | Type a question, click Send | Question appears in chat |
| 14 | Press Enter with a question | Same as clicking Send |

#### Chat — Responses

| # | Test | Expected Result |
|---|------|-----------------|
| 15 | Submit a question | Loading indicator appears |
| 16 | Response received | Loading disappears, answer shown |
| 17 | User message style | Right-aligned, blue background |
| 18 | Assistant message style | Left-aligned, white/dark card |

#### No-History Verification (Critical)

| # | Test | Expected Result |
|---|------|-----------------|
| 19 | Open DevTools → Network tab | Network panel visible |
| 20 | Ask Question 1 | Request payload: `{ "question": "Q1" }` only |
| 21 | Ask Question 2 | Request payload: `{ "question": "Q2" }` only — no Q1 |
| 22 | Open DevTools → Application → Local Storage | No conversation data stored |
| 23 | Open DevTools → Application → Session Storage | No conversation data stored |

#### Suggested Questions

| # | Test | Expected Result |
|---|------|-----------------|
| 24 | Click "What is Python?" chip | Question submitted, response shown |
| 25 | Click "Explain variables" chip | Question submitted, response shown |
| 26 | Click all 6 chips one by one | All produce responses without errors |

#### Clear Chat

| # | Test | Expected Result |
|---|------|-----------------|
| 27 | Ask 3 questions, then click Clear Chat | All messages removed from screen |
| 28 | Check input after Clear Chat | Input field is empty |
| 29 | Ask a new question after clearing | Fresh response, no errors |

#### Responsiveness

| # | Test | Expected Result |
|---|------|-----------------|
| 30 | Resize browser to 375px wide (mobile) | Layout adapts, no horizontal scroll |
| 31 | Resize to 768px (tablet) | Layout adapts correctly |
| 32 | Resize to 1440px (desktop) | Full layout, no broken elements |

#### Security

| # | Test | Expected Result |
|---|------|-----------------|
| 33 | Open DevTools → Sources, read `script.js` | No API key present |
| 34 | View page source | No API key present |
| 35 | Check `.gitignore` | `.env` is listed |

---

## 14. GitHub Repository Setup

### Step 1 — Create a GitHub Account

If you don't have one, sign up at [github.com](https://github.com).

### Step 2 — Create a New Repository

1. Go to [github.com/new](https://github.com/new)
2. Set repository name: `chatbot-without-history`
3. Set visibility: **Public** (required for free GitHub Pages)
4. Do not initialize with a README (you already have one)
5. Click **Create repository**

### Step 3 — Initialize Git Locally

```bash
cd chatbot-without-history

git init
git add index.html style.css script.js README.md PRD.md .gitignore
git commit -m "Initial commit: PyBot Python Learning Assistant"
```

**Important:** Do not run `git add .` if you have a `.env` file — add files individually.

### Step 4 — Connect and Push

```bash
git remote add origin https://github.com/your-username/chatbot-without-history.git
git branch -M main
git push -u origin main
```

Replace `your-username` with your actual GitHub username.

### Step 5 — Verify on GitHub

Open `https://github.com/your-username/chatbot-without-history` in your browser. Confirm all your files are visible. Confirm `.env` is **not** present.

---

## 15. GitHub Pages Deployment

### Step 1 — Open Repository Settings

Go to your repository on GitHub. Click the **Settings** tab (gear icon, top of page).

### Step 2 — Navigate to Pages

In the left sidebar, scroll down to **Code and automation** and click **Pages**.

### Step 3 — Configure Build and Deployment

Under **Build and deployment**:
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

Click **Save**.

### Step 4 — Wait for Deployment

GitHub Actions will build and deploy your site. This typically takes 1–3 minutes.

Refresh the Pages settings page. When deployment is complete, a green banner appears:

> **Your site is live at** `https://your-username.github.io/chatbot-without-history`

### Step 5 — Open the Live Website

Click the link. Your website is now publicly accessible.

### Step 6 — Update the README Link

Edit `README.md` and replace:
```
https://your-username.github.io/chatbot-without-history
```
with your actual live URL.

Commit and push the update:
```bash
git add README.md
git commit -m "Update README with live GitHub Pages URL"
git push
```

### Published URL vs Repository URL

| URL Type | Example |
|----------|---------|
| Repository URL | `https://github.com/your-username/chatbot-without-history` |
| Live Website URL | `https://your-username.github.io/chatbot-without-history` |

The repository URL shows your source code. The live website URL shows the deployed application. They are different addresses.

### Important Notes

- Every `git push` to `main` automatically triggers a redeployment
- Deployments take 1–3 minutes to go live after a push
- The `index.html` at the repo root is the page that GitHub Pages serves
- All asset paths in `index.html` must be **relative** (`./style.css`, not `/style.css`) to work correctly under a project URL

---

## 16. Backend Deployment

The backend is only needed for real AI responses. Skip this section if you are using demo mode.

### Option A — Render (Recommended for Beginners)

1. Sign up at [render.com](https://render.com)
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Set runtime to **Python 3**
6. Set build command: `pip install -r requirements.txt`
7. Set start command: `python app.py`
8. Under **Environment**, add:
   - `OPENAI_API_KEY` = your actual key
   - `ALLOWED_ORIGIN` = `https://your-username.github.io`
9. Click **Create Web Service**
10. Copy the deployed URL (e.g., `https://pybot-api.onrender.com`)

### Option B — Railway

1. Sign up at [railway.app](https://railway.app)
2. Click **New Project → Deploy from GitHub Repo**
3. Select your repository, set root to `backend`
4. Add environment variables in the Railway dashboard
5. Copy the generated URL

### After Deploying the Backend

Update `script.js`:
```javascript
const CONFIG = {
  backendUrl: 'https://pybot-api.onrender.com',  // ← Your deployed URL
  demoMode: false,
};
```

Commit and push. The live GitHub Pages site will now use real AI responses.

---

## 17. Troubleshooting

### The page is blank or unstyled

**Cause:** Browser is blocking local file access, or file paths are wrong.  
**Fix:** Run a local HTTP server (`python -m http.server 8080`) instead of opening `index.html` directly.

### "Cannot read properties of null" in the console

**Cause:** A JavaScript selector is looking for an element that does not exist.  
**Fix:** Open DevTools → Console, find the exact error line, check that the `id` or class in `script.js` matches the element in `index.html`.

### Suggested question chips don't respond

**Cause:** JavaScript event listeners were not attached.  
**Fix:** Check DevTools console for errors. Confirm `script.js` is linked correctly in `index.html` with `<script src="script.js"></script>` at the bottom of the `<body>`.

### Dark mode toggle doesn't save after refresh

**Cause:** localStorage is blocked (e.g., private/incognito window on some browsers).  
**Fix:** Test in a regular browser window. In incognito, localStorage may be cleared on close.

### Backend returns CORS error

**Cause:** The backend's `ALLOWED_ORIGIN` does not match the frontend URL exactly.  
**Fix:** Update `ALLOWED_ORIGIN` in the backend `.env` to exactly match your GitHub Pages URL (include the full path, no trailing slash).

### GitHub Pages shows "404 — There isn't a GitHub Pages site here"

**Cause 1:** Deployment is still in progress. Wait 2 minutes and refresh.  
**Cause 2:** GitHub Pages is not enabled. Go to Settings → Pages and enable it.  
**Cause 3:** The branch is not `main`. Check your default branch name in repository settings.

### GitHub Pages loads but shows broken styles

**Cause:** Asset paths use absolute URLs (`/style.css`) instead of relative ones (`./style.css`).  
**Fix:** Ensure `index.html` references CSS and JS with relative paths:
```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

### API key was accidentally committed

**Fix (immediate):**
1. Revoke the key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Generate a new key
3. Add `.env` to `.gitignore`
4. Remove the file from Git history:
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from tracking"
   git push
   ```
5. Store the new key in `.env` only — never in committed files

---

## 18. Known Limitations & Future Enhancements

### Known Limitations

| Limitation | Details |
|------------|---------|
| No real AI in default state | Demo mode returns pre-written answers; a backend is required for live AI |
| No backend in the repository | Backend must be deployed separately; GitHub Pages cannot run Python |
| No multi-turn conversation | By design — this is a chatbot *without* history |
| No Markdown rendering | Code blocks in AI responses are plain text in demo mode |
| No user authentication | Anyone with the URL can use the chatbot |
| Mobile keyboard UX | On some mobile browsers, the keyboard may cover the input — a known iOS Safari limitation |

### Planned Future Enhancements

| Enhancement | Description |
|-------------|-------------|
| Real AI backend | Full integration with OpenAI GPT-4 or Google Gemini |
| Markdown / code highlighting | Format code blocks and syntax-highlight Python snippets |
| Topic browser | Browse Python topics by category (basics, OOP, interviews, etc.) |
| Quiz mode | Generate multiple-choice quizzes on any Python topic |
| In-browser code execution | Run simple Python snippets using Pyodide (Python in WebAssembly) |
| Answer export | Save the current answer as a PDF or plain text file |
| Voice input | Ask questions using the Web Speech API |
| Feedback buttons | Thumbs up / thumbs down on each response |
| WCAG 2.1 AA audit | Full accessibility audit and remediation |
| PWA support | Make the app installable as a Progressive Web App |

---

## 19. Project Credits

| Item | Details |
|------|---------|
| Project | PyBot — Python Learning Assistant |
| Assignment | Chatbot Without History — GenAI Assignment |
| Program | SureTrust |
| Version | 1.0 |
| Year | 2026 |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend (optional) | Python, Flask, OpenAI API |
| Hosting | GitHub Pages (frontend), Render/Railway (backend) |
| License | MIT |

---

**GitHub Repository:** [github.com/hariganeshlanganuru-svg/octocat.github.io](https://github.com/hariganeshlanganuru-svg/octocat.github.io)  
**Live Demo:** [octocat-github-io.vercel.app](https://octocat-github-io.vercel.app)

> *"One question. One answer. No baggage."*

---

*PyBot — Python Learning Assistant | SureTrust GenAI Assignment | 2026*
