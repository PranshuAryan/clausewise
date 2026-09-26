# ⚖️ ClauseWise — AI Legal Document Co-Pilot

ClauseWise is a GenAI-powered web application that makes legal information and basic legal assistance more accessible. It helps users understand, compare, and navigate legal documents — contracts, leases, NDAs, terms of service — through plain-language explanations, risk analysis, document Q&A, and actionable next steps.

> ⚠️ **ClauseWise provides information and assistance only. It does not provide legal advice, and using it does not create an attorney-client relationship. Always consult a licensed attorney for decisions with legal consequences.**

---

## ✨ Features

- **Document Simplification** — Upload any legal document (PDF/DOCX/TXT) and get a clause-by-clause, plain-English breakdown alongside the original text.
- **Risk & Obligations Dashboard** — Automatically flags high/medium/low-risk clauses, extracts a structured obligations table (who owes what, by when), and generates an overall risk score.
- **Compare Mode** — Upload two documents (e.g. two contract versions or two vendor agreements) and get a plain-English summary of what changed, why it matters, and which version is more favorable.
- **Document Q&A** — Ask questions about your uploaded document in a chat interface. Every answer is grounded strictly in the document, with clickable citations back to the relevant clause. If something isn't covered, ClauseWise says so — it never guesses.
- **Action Plan Generator** — Get an auto-generated summary, a negotiation/clarification checklist, a "questions to ask your lawyer" list, and a draft clarification email — exportable as PDF or Markdown.
- **Real Analysis, No Mock Data** — Every result on every page comes from a live AI call against your actual uploaded document.

---

## 🏗️ Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6 (multi-page routing)
- Tailwind CSS
- Framer Motion (animations & page transitions)
- Zustand (global state)
- pdfjs-dist + mammoth.js (client-side document parsing)
- Recharts (risk score visualizations)
- react-hot-toast (notifications)

**Backend**
- Node.js + Express
- Groq API (OpenAI-compatible endpoint) for all AI analysis
- Model fallback chain: `openai/gpt-oss-120b` → `openai/gpt-oss-20b` → `qwen/qwen3.6-27b`
- Structured JSON responses validated server-side before returning to the frontend

---

## 📁 Project Structure
clausewise/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── store/
│ │ ├── lib/
│ │ └── utils/
│ ├── vite.config.js
│ └── package.json
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ ├── controllers/
│ │ └── services/
│ │ └── aiService.js # All Groq API calls live here
│ ├── .env.example
│ └── package.json
├── .gitignore
└── README.md

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A free [Groq API key](https://console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/clausewise.git
cd clausewise
```

### 2. Set up the backend
```bash
cd backend
npm install
cp .env.example .env
```
Start the backend:
```bash
npm start
```

### 3. Set up the frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173` (frontend) with the backend on `http://localhost:3001`.

---

## 🔐 Security Notes

- The Groq API key is configured **once, server-side**, by the site owner in `backend/.env`. It is **not** user-configurable and is never exposed to the frontend or the browser.
- `.env` is git-ignored by default — never commit it. Only `.env.example` (with placeholder values) is tracked.
- If you fork this project and deploy it publicly, generate your **own** Groq key rather than reusing anyone else's, and consider adding rate limiting (e.g. per-IP request caps) to avoid quota exhaustion from public traffic.

---

## 🌐 Deployment

- **Frontend** → deploy the `frontend/` folder to Vercel or Netlify (static build via `npm run build`)
- **Backend** → deploy the `backend/` folder to Render, Railway, or as Vercel serverless functions
- Update the frontend's API base URL (in `frontend/src/lib/`) to point to your deployed backend URL once live

---

## 🧭 Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/upload` | Document upload & clause-by-clause simplification |
| `/risk-analysis` | Risk-coded clauses & obligations dashboard |
| `/compare` | Side-by-side comparison of two documents |
| `/ask` | Document-grounded Q&A chat |
| `/action-plan` | Summary, checklist, and lawyer-prep generator |
| `/settings` | Jurisdiction context & theme preferences |
| `/about` | Project info & full legal disclaimer |

---

## ⚖️ Disclaimer

ClauseWise is a tool for understanding legal documents, not a replacement for professional legal counsel. It does not form an attorney-client relationship, and its output should not be relied upon as a substitute for advice from a licensed attorney, especially for decisions with binding legal or financial consequences. Laws vary by jurisdiction — always verify applicability with a qualified professional.

---

## 📄 License

MIT

---

## 🙌 Acknowledgements

Built as a submission for [Hackathon Name] — exploring how GenAI can make legal information more accessible without replacing professional legal advice.
