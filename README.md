# Biashara Brain

**AI-powered business memory agent for African SMEs.**

Built for the **Global AI Hackathon Series with Qwen Cloud — Track 1: MemoryAgent**.

---

## The Problem

Small businesses across Kenya, East Africa, and Africa broadly run on conversations.

Business knowledge lives inside:

* WhatsApp messages
* Phone calls
* Voice notes
* Handwritten notebooks
* Human memory

As businesses grow, important information becomes fragmented and difficult to retrieve.

Owners lose track of:

* Customer interactions
* Payment agreements
* Supplier arrangements
* Project updates
* Follow-ups
* Operational commitments

Not because they are bad at business.

**Because no human brain was built to be a business.**

---

## The Solution

Biashara Brain is an AI-powered business memory agent designed for African SMEs.

It allows business owners to capture information the way they naturally work — through text, voice notes, images, videos, and conversations.

The agent continuously builds a structured memory of the business and helps owners retrieve, understand, and act on that information.

Instead of searching through messages, notebooks, or spreadsheets, owners simply ask:

> "What should I follow up on?"

> "Who are my most important customers?"

> "What's my business pulse today?"

Biashara Brain doesn't just remember.

It connects information across customers, suppliers, projects, payments, and conversations to surface what matters most.

---

## Why Memory Matters

Most business software assumes information is already organized.

For many African SMEs, that assumption is wrong.

Business activity happens through conversations, mobile money transactions, verbal agreements, and informal workflows.

Biashara Brain transforms fragmented interactions into a persistent, searchable, and actionable business memory that grows smarter over time.

---

## Example

**Owner:**

> What should I focus on today?

**Biashara Brain:**

> Your highest priority is following up on the KSh 120,000 payment from Lake Construction. There is also a supplier delivery delay that could impact your upcoming installation project. I recommend confirming the delivery timeline and following up on the outstanding payment today.

---

## Core Features

### 🧠 Business Pulse

Generate an AI-powered operational briefing that highlights:

* Top priorities
* Risks
* Opportunities
* Recommended actions

---

### 💬 Natural Language Recall

Ask questions in plain language and receive synthesized answers rather than raw memory dumps.

Examples:

* What happened this week?
* Which customers owe me money?
* What projects are currently active?

---

### 🚀 Conversational Onboarding

Instead of filling out complicated forms, owners simply describe their business in their own words.

The agent extracts and structures key information automatically.

---

### 📂 Multi-Format Memory Capture

Capture business knowledge through:

* Text
* Images
* Audio
* Video

---

### 📱 WhatsApp Conversation Forwarding

Paste customer or supplier conversations and let the agent extract important business context automatically.

---

### 🧹 Memory Normalization

Incoming memories are cleaned before storage:

* Typos are corrected
* Dates are standardized
* Relative references such as "next week" are converted into actual calendar dates

This ensures more reliable reasoning and retrieval over time.

---

## Why MemoryAgent

Memory is not a feature in Biashara Brain.

**Memory is the product.**

Every interaction contributes to a growing business memory that persists across sessions.

The more the business uses the system, the more context the agent accumulates, allowing it to provide increasingly accurate summaries, recommendations, and operational insights.

---

## User Journey

### 1. Tell Biashara Brain About Your Business

The owner describes their business naturally.

Example:

> My biggest customer is Lake Construction. They currently owe us KSh 120,000. We source networking equipment from Nairobi and have an installation project due next Friday.

---

### 2. The Agent Learns

Biashara Brain extracts and structures key business facts.

Example:

✅ Lake Construction identified as a key customer

✅ Outstanding payment of KSh 120,000

✅ Networking equipment supplier identified

✅ Active installation project detected

---

### 3. Memory Confirmation

The owner sees exactly what the agent has learned and stored.

---

### 4. Ongoing Business Memory

New information is continuously added through conversations, uploads, and notes.

---

### 5. Ask Questions or Generate a Business Pulse

The owner can retrieve insights, review priorities, and receive recommendations based on accumulated memory.

---

## Tech Stack

| Layer                 | Technology             |
| --------------------- | ---------------------- |
| Frontend              | React + Vite           |
| Backend               | FastAPI (Python)       |
| Database              | Supabase (PostgreSQL)  |
| File Storage          | Supabase Storage       |
| AI / Memory Reasoning | Qwen Cloud (qwen-plus) |
| Backend Deployment    | Alibaba Cloud          |
| FrontEnd Deployment   | Vercel                 |

---

## Architecture


See:

```text
architecture/biashara_brain_architecture.svg
```

High-level flow:

```text
React Frontend
        ↓
FastAPI Backend
        ↓
Memory Processing Layer
        ↓
Supabase Storage
        ↓
Qwen Cloud Reasoning Engine
        ↓
Business Insights & Responses
```

---

## Project Structure

```text
biashara-brain/
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── db/
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── pages/
│       └── styles.js
│
├── architecture/
│   └── biashara_brain_architecture.svg
│
└── README.md
```

---

## Running Locally

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Create a `.env` file using `.env.example` and add your Supabase and Qwen Cloud credentials.

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Target Users

Growing African SME owners including:

* Hardware stores
* Salons
* Contractors
* Agrovets
* Pharmacies
* Service businesses

Businesses that have outgrown relying solely on WhatsApp and memory, but are not ready for expensive enterprise software.

---

## Roadmap

### Phase 1

* Business memory foundation
* Business Pulse
* Multi-format memory capture

### Phase 2

* WhatsApp Business API integration
* Mobile-first experience

### Phase 3

* Offline-first mobile application
* Multi-user staff access
* Team memory collaboration

### Phase 4

* SaaS platform for African SMEs
* Business intelligence and automation
* Expansion across East Africa

---

## Built By

**E. Gilbert**
Built  for the Qwen Cloud Global AI Hackathon.

---

## License

MIT
