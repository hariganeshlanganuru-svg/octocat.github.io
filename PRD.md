# Product Requirements Document (PRD)

**Product Name:** PyBot — Python Learning Assistant  
**Document Type:** Product Requirements Document  
**Version:** 1.0  
**Date:** October 19, 2026  
**Author:** SureTrust GenAI Assignment  
**Classification:** Academic / Assignment Submission

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision](#3-product-vision)
4. [Target Users & Personas](#4-target-users--personas)
5. [Core Concept: Chatbot Without History](#5-core-concept-chatbot-without-history)
6. [Product Goals & Objectives](#6-product-goals--objectives)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [User Interface & Design Requirements](#9-user-interface--design-requirements)
10. [AI Integration Architecture](#10-ai-integration-architecture)
11. [Security Requirements](#11-security-requirements)
12. [Python Learning Feature Scope](#12-python-learning-feature-scope)
13. [Technology Stack](#13-technology-stack)
14. [Project File Structure](#14-project-file-structure)
15. [Demo Mode Specification](#15-demo-mode-specification)
16. [Deployment Requirements](#16-deployment-requirements)
17. [Testing & Quality Assurance](#17-testing--quality-assurance)
18. [Acceptance Criteria](#18-acceptance-criteria)
19. [Known Limitations & Future Enhancements](#19-known-limitations--future-enhancements)
20. [Glossary](#20-glossary)

---

## 1. Executive Summary

PyBot is a SaaS-style, single-page web application built as a Python Learning Assistant chatbot. It is designed for absolute beginners and students who want quick, focused answers to individual Python programming questions.

The product is built around one defining architectural constraint: **no conversation history**. Every question submitted by the user is processed independently. No previous messages — from either the user or the assistant — are ever included in subsequent AI requests. This is not a limitation; it is a deliberate design decision that makes the product simpler, more focused, and easier to reason about.

The frontend is a pure HTML5, CSS3, and Vanilla JavaScript static website deployable to GitHub Pages at zero cost. A separately deployable Python backend handles secure AI provider communication when real AI integration is configured. A fully functional demo mode is included so the product works out-of-the-box without any AI credentials.

---

## 2. Problem Statement

### 2.1 The Learning Gap

Most beginner programmers struggle to find focused, concise answers to individual Python questions. General-purpose chatbots and documentation sites are either too broad, too advanced, or prone to context confusion when prior conversation influences the current answer.

### 2.2 The Over-Engineering Problem

Many AI chat products ship with full conversation memory, session persistence, history retrieval, and multi-turn context windows. For simple, independent question-answering use cases — like "What is a tuple?" — this infrastructure adds complexity without adding value.

### 2.3 The Assignment Context

This product is submitted as a GenAI assignment titled **"Chatbot Without History"** for the SureTrust program. The assignment requires demonstrating a functional SaaS website where each chatbot interaction is stateless and independent, with no prior context passed to the AI model.

---

## 3. Product Vision

> **"One question. One answer. No baggage."**

PyBot gives Python learners a clean, distraction-free environment to ask any Python question and receive a clear, beginner-friendly answer — without the noise of conversation history, without memory of what was asked before, and without the complexity of multi-turn AI sessions.

Every question is a fresh start.

---

## 4. Target Users & Personas

### Persona 1 — The Absolute Beginner
- **Name:** Arjun, 19, first-year CS student
- **Goal:** Understand Python syntax and basic concepts for an upcoming exam
- **Frustration:** AI chatbots give conflicting answers depending on what was asked earlier in the conversation
- **Need:** Clean, focused answers that don't depend on prior conversation context

### Persona 2 — The Interview Prepper
- **Name:** Priya, 22, final-year student preparing for campus placements
- **Goal:** Quickly review Python interview topics like mutability, OOP, and exception handling
- **Frustration:** Wants concise answers, not lengthy explanations shaped by earlier questions
- **Need:** Independent, topic-specific responses she can read quickly

### Persona 3 — The Occasional Learner
- **Name:** Raj, 28, working professional brushing up on Python
- **Goal:** Revisit Python fundamentals once a week without picking up where he left off
- **Frustration:** Doesn't want the chatbot to assume continuity between sessions
- **Need:** A stateless tool that treats every session — and every question — as independent

### Persona 4 — The Instructor / Evaluator
- **Name:** Dr. Meena, CS faculty reviewing student GenAI assignments
- **Goal:** Evaluate whether the student has built a functional, well-documented, correctly architected AI product
- **Need:** A polished, professional-looking product with clear demonstration of the no-history constraint

---

## 5. Core Concept: Chatbot Without History

This section defines the most important design requirement of the product.

### 5.1 What "Without History" Means

A chatbot without history processes each user question as a completely independent request. It does not:

- Append previous user messages to the current AI request
- Append previous assistant responses to the current AI request
- Maintain a growing conversation array used for multi-turn AI context
- Store conversation data in localStorage, sessionStorage, cookies, IndexedDB, or any database
- Retrieve prior sessions or messages automatically on load
- Implement any form of conversation memory, summarization, or retrieval-augmented recall

### 5.2 What It Does NOT Mean

"Without history" does not mean the chat interface is invisible or that messages disappear immediately. The interface may display the current session's messages (user questions and assistant answers) as a visual log for the user's reference during the current browser session. However:

- These displayed messages are **never** included in the payload sent to the AI provider for subsequent requests
- Clearing the chat removes them from the screen and resets the input
- Closing or refreshing the browser clears all displayed messages (no persistence)

### 5.3 Technical Implementation

Every AI request payload contains exactly two things:

1. A fixed system prompt defining the assistant's role and behavior (e.g., "You are a Python learning assistant. Answer only the current question. Do not reference previous questions.")
2. The current user question

Nothing else is ever included.

```
Request N:
  system: "You are PyBot, a Python learning assistant..."
  user:   "What is a list in Python?"

Request N+1:
  system: "You are PyBot, a Python learning assistant..."
  user:   "Explain for loops."
  ← No reference to Request N or its answer
```

### 5.4 Why This Matters

This architecture:
- Prevents context drift (earlier wrong answers influencing later responses)
- Reduces token consumption (no growing context window)
- Makes behavior predictable and consistent
- Simplifies the backend (no session management)
- Satisfies the assignment's stated requirement

---

## 6. Product Goals & Objectives

| # | Goal | Objective | Measurable Outcome |
|---|------|-----------|--------------------|
| G1 | No-history chatbot | Each request is stateless and independent | Zero previous messages in any AI request payload |
| G2 | Python learning niche | Support all common beginner Python topics | At least 10 topic categories covered |
| G3 | SaaS-quality UI | Look like a real, professional product | Polished design, responsive layout, theme toggle |
| G4 | GitHub Pages ready | Deploy frontend at zero cost | Static files deployable from repo root |
| G5 | Security compliance | No exposed credentials | API keys in environment variables only |
| G6 | Demo mode | Works without AI credentials | Predefined responses for all suggested questions |
| G7 | Accessibility | Usable with keyboard and screen readers | Semantic HTML, ARIA labels, visible focus states |

---

## 7. Functional Requirements

### 7.1 Chat Interface

| ID | Requirement | Priority |
|----|-------------|----------|
| F-01 | User can type a Python question into the input field | Must Have |
| F-02 | Pressing Enter or clicking Send submits the question | Must Have |
| F-03 | Empty or whitespace-only input is rejected with a clear message | Must Have |
| F-04 | User message appears in the chat area immediately after submission | Must Have |
| F-05 | A loading indicator is shown while waiting for a response | Must Have |
| F-06 | The assistant's response appears in the chat area when received | Must Have |
| F-07 | The input field is cleared after submission | Must Have |
| F-08 | Duplicate submissions are prevented while a request is in progress | Must Have |
| F-09 | Failed requests show a user-friendly error message | Must Have |
| F-10 | The Clear Chat button removes all displayed messages and clears the input | Must Have |

### 7.2 No-History Behavior

| ID | Requirement | Priority |
|----|-------------|----------|
| H-01 | Each AI request contains only the current question and system prompt | Must Have |
| H-02 | No previous user messages are appended to the AI request | Must Have |
| H-03 | No previous assistant responses are appended to the AI request | Must Have |
| H-04 | No conversation data is stored in localStorage or sessionStorage | Must Have |
| H-05 | No conversation data is stored in cookies or IndexedDB | Must Have |
| H-06 | Displayed messages are never used as AI context for future requests | Must Have |
| H-07 | Clearing the chat removes visible messages but does not affect AI statefulness (there is none) | Must Have |

### 7.3 Suggested Questions

| ID | Requirement | Priority |
|----|-------------|----------|
| S-01 | At least 6 suggested question buttons are displayed | Must Have |
| S-02 | Clicking a suggested question populates the input field | Must Have |
| S-03 | Clicking a suggested question automatically submits it | Should Have |

### 7.4 Navigation & Page

| ID | Requirement | Priority |
|----|-------------|----------|
| N-01 | Navigation bar with logo, Home, Features, About links | Must Have |
| N-02 | Light/dark theme toggle in the navigation bar | Must Have |
| N-03 | "Start Learning" hero button scrolls to the chat workspace | Must Have |
| N-04 | "Explore Features" button scrolls to the Features section | Must Have |
| N-05 | All internal navigation links work correctly | Must Have |
| N-06 | Footer displays project name, description, tech stack, GitHub link placeholder, copyright | Must Have |

### 7.5 Theme Toggle

| ID | Requirement | Priority |
|----|-------------|----------|
| T-01 | Toggle switches between light and dark color schemes | Must Have |
| T-02 | Theme preference persists across page reload via localStorage | Should Have |
| T-03 | Toggle has an accessible label and visible indicator | Must Have |

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Page must load in under 3 seconds on a standard broadband connection
- No external JavaScript frameworks or CSS frameworks (Vanilla JS and CSS3 only)
- All assets use relative paths for GitHub Pages compatibility

### 8.2 Responsiveness
- Layout must function correctly on screens from 320px to 2560px wide
- Mobile layout adapts the chat interface to single-column presentation
- Touch targets meet a minimum size of 44x44px

### 8.3 Accessibility
- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- All interactive elements have descriptive labels or ARIA attributes
- Visible focus states on all focusable elements
- Sufficient color contrast in both light and dark themes (WCAG AA target)
- Keyboard-navigable interface

### 8.4 Security
- No API keys or secrets in frontend files
- User-provided text rendered via `textContent`, never raw `innerHTML`
- Backend input validation and length limiting
- Backend rate limiting
- `.env` files excluded from version control via `.gitignore`

### 8.5 Maintainability
- Clean, well-commented code
- Logical file and folder separation
- README with full setup, configuration, and deployment instructions

---

## 9. User Interface & Design Requirements

### 9.1 Visual Identity

| Element | Specification |
|---------|---------------|
| Primary Color | Blue-purple gradient (`#667eea` to `#764ba2`) |
| Accent Color | Vibrant blue (`#4facfe`) |
| Font Family | `Segoe UI`, `system-ui`, `sans-serif` |
| Border Radius | 12–16px for cards, 8px for buttons, 24px for input |
| Shadows | Subtle `box-shadow` for cards and chat bubbles |
| Spacing | 8px base grid |

### 9.2 Page Sections

**Navigation Bar**
- Fixed top position
- Product logo (emoji + text) on the left
- Navigation links in the center/right
- Theme toggle on the far right
- Backdrop blur on scroll

**Hero Section**
- Full-viewport-height section
- Gradient background
- Large heading: "Learn Python, One Question at a Time"
- Subtitle describing independent question processing
- Two CTA buttons: "Start Learning" (primary) and "Explore Features" (secondary)
- Animated floating badge: "No History · No Context · Just Answers"

**Chat Workspace**
- Centered card with max-width 800px
- Chat message display area with auto-scroll
- User messages right-aligned, blue background
- Assistant messages left-aligned, white/dark card background
- Timestamps on each message
- Suggested question chips below the input area
- Input bar with send button
- Clear Chat button

**Features Section**
- Grid of feature cards (2-column on desktop, 1-column on mobile)
- Icon, title, and description per card
- "No Conversation Memory", "Independent Processing", "Python Focused", "Responsive Design", "Secure Architecture", "Demo Mode Included"

**About Section**
- Two-column layout (text + info card)
- Explains the no-history concept
- Lists how the application works step-by-step
- Clear note that this is a GenAI assignment project

**Footer**
- Dark background
- Three-column layout: brand, links, tech stack
- Copyright notice

### 9.3 Chat Message Format

```
[User Message]
┌──────────────────────────────────┐
│  What is a list in Python?   👤  │
│  10:42 AM                        │
└──────────────────────────────────┘

[Assistant Message]
┌──────────────────────────────────┐
│  🐍                              │
│  A list in Python is an ordered, │
│  mutable collection...           │
│  10:42 AM                        │
└──────────────────────────────────┘
```

---

## 10. AI Integration Architecture

### 10.1 Request Flow

```
User types question
        │
        ▼
Frontend validates input (non-empty)
        │
        ▼
Frontend sends POST /api/chat
  Body: { question: "..." }
  ← No history. No session ID. No previous messages.
        │
        ▼
Backend receives question
        │
        ▼
Backend constructs AI payload:
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user",   content: question }
  ]
        │
        ▼
Backend calls AI Provider API
        │
        ▼
Backend returns { answer: "..." }
        │
        ▼
Frontend displays answer in chat area
```

### 10.2 System Prompt (Fixed)

```
You are PyBot, a friendly and knowledgeable Python learning assistant.
Your job is to help beginners learn Python programming.
Answer only the current question asked. Do not reference any previous
questions or answers. Keep answers clear, concise, and beginner-friendly.
Use examples where helpful. Format code in plain text.
```

### 10.3 Backend API Specification

**Endpoint:** `POST /api/chat`

Request Body:
```json
{
  "question": "What is a list in Python?"
}
```

Response Body (success):
```json
{
  "answer": "A list in Python is an ordered, mutable collection..."
}
```

Response Body (error):
```json
{
  "error": "Something went wrong. Please try again."
}
```

**Validation Rules:**
- `question` must be a non-empty string
- `question` must not exceed 500 characters
- Rate limit: maximum 20 requests per minute per IP

### 10.4 Demo Mode

When no backend is configured or the backend is unreachable, the frontend falls back to Demo Mode:

- A clearly visible banner reads: **"Demo Mode — Sample responses only. Not a real AI."**
- Pre-written responses are returned for each of the 6 suggested questions
- An unsupported question returns: "This is demo mode. Connect a real AI backend for live answers."
- Demo mode never simulates a real API call or shows a fake loading state

---

## 11. Security Requirements

| ID | Requirement |
|----|-------------|
| SEC-01 | API keys stored in server-side environment variables only |
| SEC-02 | No credentials in `.env`, HTML, CSS, JS, or any committed file |
| SEC-03 | `.env` listed in `.gitignore` |
| SEC-04 | `.env.example` provided with placeholder values only |
| SEC-05 | User input sanitized via `textContent` (not `innerHTML`) |
| SEC-06 | Backend validates and length-limits all input |
| SEC-07 | Backend implements rate limiting |
| SEC-08 | CORS configured to allow only the frontend origin in production |
| SEC-09 | API keys never logged or included in error responses |
| SEC-10 | Backend does not expose provider error details to the client |

---

## 12. Python Learning Feature Scope

### 12.1 Supported Topic Areas

| # | Topic Category | Example Questions |
|---|----------------|-------------------|
| 1 | Python Basics | What is Python? What is an interpreter? |
| 2 | Variables & Data Types | What are Python data types? What is type casting? |
| 3 | Strings & Operators | How do you concatenate strings? What is f-string? |
| 4 | Conditions & Loops | How does if-else work? Explain for and while loops. |
| 5 | Functions | What is a function? What are *args and **kwargs? |
| 6 | Lists, Tuples, Sets, Dicts | What is the difference between a list and a tuple? |
| 7 | Mutable & Immutable Objects | What does mutable mean in Python? |
| 8 | Object-Oriented Programming | What is a class? What is inheritance? |
| 9 | Exception Handling | What is try-except? What are built-in exceptions? |
| 10 | Interview Questions | What is GIL? What is a decorator? Explain list comprehension. |

### 12.2 Suggested Question Buttons

The following 6 questions are displayed as clickable chips in the chat workspace:

1. "What is Python?"
2. "Explain variables"
3. "List vs Tuple — what's the difference?"
4. "Explain for and while loops"
5. "What is a function?"
6. "Explain mutable and immutable objects"

---

## 13. Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Markup | HTML5 | Semantic structure, GitHub Pages compatible |
| Styling | CSS3 (custom) | No framework dependencies, full control |
| Interactivity | Vanilla JavaScript (ES6+) | No build step, lightweight, GitHub Pages compatible |
| Backend (optional) | Python (Flask or FastAPI) | Lightweight, easy to deploy, familiar to Python learners |
| AI Provider | OpenAI API (configurable) | Industry standard, easily swapped |
| Version Control | Git | Standard |
| Hosting (Frontend) | GitHub Pages | Free, zero-config static hosting |
| Hosting (Backend) | Render / Railway / Fly.io | Free-tier platforms for small APIs |
| Secrets Management | Environment Variables | Secure, platform-agnostic |

---

## 14. Project File Structure

```
chatbot-without-history/
├── index.html              ← Single-page application entry point
├── style.css               ← All styles (light theme, dark theme, responsive)
├── script.js               ← All frontend logic (chat, theme, navigation, demo mode)
├── README.md               ← Complete project documentation
├── PRD.md                  ← This document
├── .gitignore              ← Excludes .env, node_modules, __pycache__, etc.
│
└── backend/                ← Optional real AI backend (deploy separately)
    ├── app.py              ← Flask/FastAPI application
    ├── requirements.txt    ← Python dependencies
    ├── .env.example        ← Placeholder environment variables
    └── README.md           ← Backend setup and deployment instructions
```

---

## 15. Demo Mode Specification

Demo mode activates when:
- The backend URL is not configured (default state)
- The backend returns a connection error

### Pre-written Demo Responses

**"What is Python?"**
> Python is a high-level, interpreted programming language known for its simple and readable syntax. It was created by Guido van Rossum and first released in 1991. Python is widely used for web development, data science, artificial intelligence, automation, and more. Its beginner-friendly design makes it one of the most popular first programming languages in the world.

**"Explain variables"**
> A variable in Python is a named container that stores a value. You create a variable by simply assigning a value to a name using the `=` operator. For example: `name = "Alice"` or `age = 25`. Python is dynamically typed, which means you do not need to declare the type of a variable — Python figures it out automatically based on the value you assign.

**"List vs Tuple — what's the difference?"**
> A list and a tuple are both ordered collections in Python, but they differ in one key way: lists are mutable (you can change their contents), while tuples are immutable (once created, they cannot be changed). Lists use square brackets `[1, 2, 3]` and tuples use parentheses `(1, 2, 3)`. Use a list when you need to modify the collection, and a tuple when the data should remain constant.

**"Explain for and while loops"**
> A `for` loop in Python iterates over a sequence (like a list, string, or range) a fixed number of times. Example: `for i in range(5): print(i)`. A `while` loop continues executing as long as a given condition is true. Example: `while count < 5: count += 1`. Use `for` when you know how many times to iterate, and `while` when you loop until a condition changes.

**"What is a function?"**
> A function is a reusable block of code that performs a specific task. You define a function using the `def` keyword, followed by the function name and parentheses. Example: `def greet(name): return f"Hello, {name}!"`. Functions help you avoid repeating code, make your program easier to read, and allow you to break complex problems into smaller, manageable pieces.

**"Explain mutable and immutable objects"**
> In Python, a mutable object can be changed after it is created. Lists, dictionaries, and sets are mutable. An immutable object cannot be changed after creation — integers, strings, and tuples are immutable. For example, you can append to a list, but you cannot change a character inside a string directly. Understanding mutability is important when passing objects to functions, since mutable objects can be modified inside the function while immutable ones cannot.

---

## 16. Deployment Requirements

### 16.1 Frontend — GitHub Pages

- All frontend files in the repository root: `index.html`, `style.css`, `script.js`
- All asset paths relative (no absolute URLs)
- Deploy from `main` branch, `/` (root) folder
- No build step required

### 16.2 Backend — Separate Platform

If real AI is configured:

- Deploy backend to Render, Railway, or Fly.io
- Set `OPENAI_API_KEY` as an environment variable on the platform
- Update `BACKEND_URL` in `script.js` to the deployed backend URL
- Configure CORS to allow the GitHub Pages domain

---

## 17. Testing & Quality Assurance

### 17.1 Manual Test Checklist

| Test | Expected Result |
|------|-----------------|
| Open `index.html` in browser | Page loads with no console errors |
| Click "Start Learning" | Page scrolls to chat workspace |
| Click "Explore Features" | Page scrolls to Features section |
| Submit empty input | Error message: "Please enter a question" |
| Submit whitespace-only input | Same error as empty input |
| Click a suggested question | Input is populated and question is submitted |
| Receive a response | Response appears in chat area |
| Ask a second question | Second question processed independently (verify in Network tab) |
| Click Clear Chat | All messages removed, input cleared |
| Toggle theme | UI switches between light and dark mode |
| Resize to mobile width | Layout adapts correctly, no overflow |
| Open DevTools → Application → Local Storage | No conversation data stored |
| Open DevTools → Network → second request payload | No previous messages in request body |

### 17.2 No-History Verification (Critical)

To verify the no-history constraint:
1. Open browser DevTools → Network tab
2. Ask Question 1
3. Inspect the request payload — it should contain only `{ "question": "..." }`
4. Ask Question 2
5. Inspect the request payload — it should contain only `{ "question": "..." }` with no reference to Question 1

---

## 18. Acceptance Criteria

The project is complete and ready for submission when all of the following are true:

- [ ] The website loads without errors in a modern browser
- [ ] The design is polished and resembles a real SaaS product
- [ ] The chatbot correctly handles questions about Python
- [ ] Each question is processed independently — verified in the network request payload
- [ ] No previous messages appear in any AI request
- [ ] No conversation data is stored in the browser
- [ ] The Clear Chat button works correctly
- [ ] All 6 suggested question buttons work
- [ ] Empty input is rejected with a message
- [ ] Loading state is shown during processing
- [ ] Error state is handled gracefully
- [ ] Light/dark theme toggle works
- [ ] All navigation links and buttons work
- [ ] Demo mode is clearly labelled and honest
- [ ] No API key or secret is present in any committed file
- [ ] The README contains complete deployment instructions
- [ ] The frontend is deployable to GitHub Pages without modification
- [ ] The PRD documents all requirements accurately

---

## 19. Known Limitations & Future Enhancements

### 19.1 Known Limitations

| Limitation | Explanation |
|------------|-------------|
| No real AI in default state | Demo mode uses pre-written responses; a real AI backend requires separate setup |
| No backend included by default | The frontend is static; a backend must be deployed separately for live AI |
| No conversation continuity | By design; multi-turn context is intentionally excluded |
| No user authentication | This is a single-user, public-facing demo tool |
| No answer formatting (Markdown) | Responses are plain text in demo mode |

### 19.2 Future Enhancements

| Enhancement | Description |
|-------------|-------------|
| Real AI backend | Connect to OpenAI, Gemini, or Anthropic Claude API |
| Markdown rendering | Format code blocks and lists in AI responses |
| Topic filtering | Let users browse Python topics by category |
| Quiz mode | Generate multiple-choice quizzes from Python topics |
| Code execution sandbox | Run simple Python snippets in-browser |
| Feedback buttons | Thumbs up/down on each response |
| Export answer | Save the current answer as a PDF or text file |
| Voice input | Speak a question using the Web Speech API |
| Accessibility audit | Full WCAG 2.1 AA audit and remediation |

---

## 20. Glossary

| Term | Definition |
|------|------------|
| Chatbot Without History | A chatbot that processes each user question independently, without using previous conversation turns as context |
| Demo Mode | A mode in which the application returns pre-written responses without connecting to a real AI provider |
| Stateless | A system that does not retain information between individual requests |
| System Prompt | A fixed instruction sent to the AI model at the start of every request, defining the assistant's role and behavior |
| GitHub Pages | A free static website hosting service provided by GitHub |
| SaaS | Software as a Service — a software delivery model where users access an application over the web |
| CORS | Cross-Origin Resource Sharing — a browser security mechanism that controls which origins can access a server |
| Environment Variable | A configuration value stored outside the application code, used for secrets and deployment-specific settings |
| Vanilla JavaScript | JavaScript written without any frameworks or libraries |
| LLM | Large Language Model — the type of AI model used to generate text responses |

---

*End of Product Requirements Document*

*PyBot — Python Learning Assistant | SureTrust GenAI Assignment | Version 1.0 | October 2026*
