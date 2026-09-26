# ClauseWise

**ClauseWise** is a GenAI-powered legal document co-pilot designed to help individuals and small businesses understand, compare, and navigate legal documents (contracts, leases, NDAs, ToS, policies) without replacing professional legal advice.

## Features
- **Simplify Legalese:** Translates complex clauses into plain English instantly.
- **Highlight Risk:** Color-coded risk analysis identifies potential red flags.
- **Compare Versions:** See exactly what changed between two document versions.
- **Ask Questions:** Chat directly with your document to find specific answers.
- **Get Action Items:** Auto-generates checklists and emails for negotiations.

## Tech Stack
- **Frontend:** React 18, Vite, React Router v6
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** Zustand
- **Document Parsing:** pdfjs-dist, mammoth.js
- **AI Integration:** Groq API (models: openai/gpt-oss-120b and fallbacks)

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root based on `.env.example`:
   ```env
   VITE_GROQ_MODEL=openai/gpt-oss-120b
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

3. **Build for Production:**
   ```bash
   npm run build
   ```
   The static output will be generated in the `dist` folder.

## Usage

ClauseWise is driven by a single backend-managed API key for all users. 
Upload a PDF, DOCX, or TXT file on the **Upload** page to automatically trigger an analysis.

### Security Note
> [!WARNING]
> This application is currently architected as a pure client-side static site using Vite. 
> Because the `VITE_GROQ_API_KEY` is embedded in the build, **any user who inspects the network traffic can extract the API key**. 
> For a true production deployment where the key is kept secret, you MUST deploy a Node.js/Express backend (or serverless functions) to proxy these API requests. Never commit your `.env` file to source control.

## Disclaimer
ClauseWise provides information and assistance only. It does not provide legal advice and is not a substitute for a licensed attorney. No attorney-client relationship is formed by using this application.
