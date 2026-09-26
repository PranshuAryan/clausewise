const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// API key is fixed server-side (via environment variable). 
// This app does not support per-user API keys.
const API_KEY = import.meta.env?.VITE_GROQ_API_KEY;

// Use env variable as primary if available, otherwise default to openai/gpt-oss-120b
const PRIMARY_MODEL = import.meta.env?.VITE_GROQ_MODEL || 'openai/gpt-oss-120b';

// Fallback chain for resilience against model deprecations
const CANDIDATE_MODELS = [
  PRIMARY_MODEL,
  'openai/gpt-oss-20b',
  'qwen/qwen3.6-27b'
];

const systemPrompt = `You are an expert legal AI assistant. Your job is to analyze legal documents and return structured JSON.
Do not provide legal advice. Always output valid JSON only, without markdown wrapping if possible, or strictly within a \`\`\`json block.`;

export async function analyzeDocumentWithClaude(text, jurisdiction) {
  if (!API_KEY) throw new Error("API key is missing on the server. Please check environment configuration.");
  
  const prompt = `Analyze the following legal document under the jurisdiction of ${jurisdiction}.
Extract key clauses, simplify them into plain English, categorize them (Payment, Termination, Liability, Privacy, IP, Dispute Resolution, Other), and assign a risk level (Green, Yellow, Red) from the perspective of the counterparty.
Also extract obligations (who, what, when, consequence).
Finally, provide an overall risk score (0-100) and a brief summary.

Output JSON format exactly matching this schema:
{
  "clauses": [
    {
      "original": "exact text",
      "simplified": "plain english",
      "category": "category name",
      "riskLevel": "Red|Yellow|Green",
      "riskReason": "why it's risky (if Red/Yellow)",
      "suggestedQuestion": "question to ask lawyer (if Red/Yellow)"
    }
  ],
  "obligations": [
    { "who": "Party A", "what": "Do something", "when": "Date/Condition", "consequence": "Penalty" }
  ],
  "overallRiskScore": 50,
  "summary": "Document summary."
}

Document Text:
${text.substring(0, 50000)}
`;

  return await callAPIWithFallback(prompt, true);
}

export async function askQuestionWithClaude(documentText, question) {
  if (!API_KEY) throw new Error("API key is missing on the server. Please check environment configuration.");

  const prompt = `Based strictly on the provided legal document text, answer the user's question. 
If the answer is not in the document, reply: "This isn't addressed in your document. This might be a good question for a legal professional."

You must respond with ONLY valid JSON matching this exact schema. Never omit required fields. Never change field names. Never wrap the JSON in markdown code fences.

{
  "answer": "string — the main answer in plain, professional English",
  "isGrounded": true or false — whether this was actually answered from the document,
  "citedClauses": ["Clause 1 - Payment Terms", "Clause 2a - Rent Due Date"] — array of strings, empty array [] if isGrounded is false,
  "keyPoints": ["point 1", "point 2"] — OPTIONAL array of short bullet points if the answer has multiple distinct parts. Omit or empty array if single simple sentence.,
  "followUpSuggestion": "string — OPTIONAL, a natural follow-up question the user might want to ask next, or null"
}

Document Text:
${documentText.substring(0, 50000)}

User Question: ${question}
`;

  try {
    const rawResult = await callAPIWithFallback(prompt, true);
    
    if (typeof rawResult === 'object' && rawResult !== null) {
      // Normalize schema in case AI hallucinated field names slightly
      const answer = rawResult.answer || rawResult.response || "No clear answer provided.";
      const isGrounded = typeof rawResult.isGrounded === 'boolean' ? rawResult.isGrounded : (rawResult.citedClauses?.length > 0 || answer.length > 50);
      const citedClauses = Array.isArray(rawResult.citedClauses) ? rawResult.citedClauses : (Array.isArray(rawResult.clause) ? rawResult.clause : []);
      const keyPoints = Array.isArray(rawResult.keyPoints) ? rawResult.keyPoints : [];
      const followUpSuggestion = typeof rawResult.followUpSuggestion === 'string' ? rawResult.followUpSuggestion : null;
      
      return { answer, isGrounded, citedClauses, keyPoints, followUpSuggestion };
    }
    throw new Error("Invalid schema structure returned from model");
  } catch (err) {
    console.warn("[askQuestion] Attempt failed or invalid schema, returning fallback", err);
    return {
      answer: "This isn't addressed in your document or the AI encountered an error formatting its response. This might be a good question for a legal professional.",
      isGrounded: false,
      citedClauses: [],
      keyPoints: [],
      followUpSuggestion: null
    };
  }
}

async function callAPIWithFallback(prompt, parseJson = true) {
  let lastError = null;
  // Deduplicate in case VITE_GROQ_MODEL matches one of the fallbacks
  const uniqueModels = [...new Set(CANDIDATE_MODELS)];

  for (const model of uniqueModels) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          temperature: 0.1,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        
        // 404 (model decommissioned), 400 (invalid model), or 429 (rate limited) -> Try next
        if (response.status === 404 || response.status === 400 || response.status === 429) {
          console.warn(`[Groq API Warning] Model '${model}' failed with status ${response.status}: ${errorMessage}. Retrying with next model...`);
          lastError = new Error(errorMessage);
          continue; 
        }
        
        // Fatal errors (e.g. 401 Unauthorized), throw to abort the chain immediately
        throw new Error(errorMessage);
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      if (parseJson) {
        try {
          if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0];
          } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0];
          }
          return JSON.parse(content.trim());
        } catch (e) {
          console.warn(`[Groq API Warning] Model '${model}' returned malformed JSON. Retrying with next model...`);
          lastError = new Error("Failed to parse AI's response as JSON");
          continue; // Try next model if JSON parsing fails
        }
      }
      return content;
      
    } catch (err) {
      if (err.message.includes('Unauthorized') || err.message.includes('Invalid API Key') || err.message.includes('invalid api key')) {
        throw err;
      }
      console.warn(`[Groq API Warning] Model '${model}' encountered network error:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`All fallback models failed. Last error: ${lastError?.message}`);
}
