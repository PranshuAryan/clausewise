import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Info, Github } from 'lucide-react';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 py-12"
    >
      <h1 className="text-4xl font-heading font-bold mb-6">About ClauseWise</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p className="lead text-xl mb-8">
          ClauseWise is an open-source, GenAI-powered co-pilot designed to democratize understanding of legal documents.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-navy-900 dark:text-white">The Problem</h2>
        <p>
          Every day, individuals and small businesses sign complex legal documents—leases, NDAs, terms of service—without fully understanding the risks they are taking on. Hiring a lawyer for every minor contract is prohibitively expensive, leaving many to rely on blind trust.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-navy-900 dark:text-white">How It Works</h2>
        <p>
          Built as a purely client-side React application, ClauseWise runs locally in your browser. It uses modern Large Language Models (like Anthropic's Claude 3.5 Sonnet) to analyze the text, extract obligations, and flag potential risks. Because it connects directly to the API, there is no middleman backend storing your sensitive documents.
        </p>

        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 my-10 rounded-r-lg">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-bold text-red-900 dark:text-red-400 m-0">Critical Legal Disclaimer</h3>
          </div>
          <div className="space-y-4 text-red-800 dark:text-red-300/90 text-sm md:text-base">
            <p>
              <strong>ClauseWise is NOT a lawyer, a law firm, or a substitute for professional legal advice.</strong>
            </p>
            <p>
              The AI-generated insights, risk scores, summaries, and action plans provided by this tool are for informational and educational purposes only. AI models can hallucinate, misunderstand context, or provide legally inaccurate information.
            </p>
            <p>
              No attorney-client relationship is formed by using this application. You should always consult with a qualified, licensed attorney in your jurisdiction before signing any legal document or making legal decisions.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-navy-900 dark:text-white">Tech Stack</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Frontend:</strong> React 18, Vite, React Router v6</li>
          <li><strong>Styling:</strong> Tailwind CSS, Framer Motion</li>
          <li><strong>State:</strong> Zustand</li>
          <li><strong>Document Parsing:</strong> pdfjs-dist, mammoth.js</li>
          <li><strong>AI:</strong> Anthropic API (Live Mode)</li>
        </ul>
      </div>
    </motion.div>
  );
}
