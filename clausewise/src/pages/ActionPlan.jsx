import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { FileText, CheckSquare, Mail, Copy, Download, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ActionPlan() {
  const { currentDocument, analysisResults } = useStore();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  if (!currentDocument || !analysisResults) {
    return <Navigate to="/upload" replace />;
  }

  const riskyClauses = analysisResults.clauses?.filter(c => c.riskLevel === 'Red' || c.riskLevel === 'Yellow') || [];

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const generateEmailDraft = () => {
    let email = `Subject: Questions regarding ${currentDocument.name}\n\nHi,\n\nI have reviewed the document and have a few questions/points I'd like to discuss before proceeding:\n\n`;
    
    riskyClauses.forEach((clause, idx) => {
      email += `${idx + 1}. Regarding the clause on ${clause.category}: ${clause.suggestedQuestion || 'Can we clarify this point?'}\n`;
    });
    
    email += `\nPlease let me know when you're available to discuss.\n\nBest regards,`;
    return email;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedQuestions(true);
      setTimeout(() => setCopiedQuestions(false), 2000);
    }
    toast.success('Copied to clipboard');
  };

  const questionsList = riskyClauses.map(c => c.suggestedQuestion).filter(Boolean);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Action Plan & Next Steps</h1>
          <p className="text-gray-600 dark:text-gray-400">Based on the analysis of: <span className="font-semibold">{currentDocument.name}</span></p>
        </div>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium"
        >
          <Download className="w-4 h-4 mr-2" /> Export to PDF
        </button>
      </div>

      <div className="space-y-8">
        
        {/* Executive Summary */}
        <section className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
            Executive Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {analysisResults.summary}
          </p>
        </section>

        {/* Negotiation Checklist */}
        <section className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
            Negotiation Checklist
          </h2>
          {riskyClauses.length === 0 ? (
            <p className="text-gray-500 italic">No major risks identified to negotiate.</p>
          ) : (
            <div className="space-y-3">
              {riskyClauses.map((clause, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${checkedItems[idx] ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/50' : 'bg-gray-50 border-gray-200 dark:bg-navy-900/50 dark:border-navy-700'}`}
                >
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    checked={!!checkedItems[idx]}
                    onChange={() => toggleCheck(idx)}
                  />
                  <div className="ml-3">
                    <span className={`text-sm font-medium ${checkedItems[idx] ? 'line-through text-gray-500' : 'text-navy-900 dark:text-white'}`}>
                      Address {clause.category} Clause
                    </span>
                    <p className={`text-xs mt-1 ${checkedItems[idx] ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {clause.riskReason}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Questions for Lawyer */}
          <section className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Questions to Ask Your Lawyer</h2>
              <button 
                onClick={() => copyToClipboard(questionsList.map((q,i) => `${i+1}. ${q}`).join('\n'), 'questions')}
                className="text-gray-500 hover:text-navy-900 dark:hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedQuestions ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {questionsList.length === 0 ? (
              <p className="text-gray-500 italic flex-1">No specific questions generated.</p>
            ) : (
              <ul className="list-decimal pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300 flex-1">
                {questionsList.map((q, idx) => (
                  <li key={idx} className="pl-2">{q}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Email Draft */}
          <section className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                Draft Clarification Email
              </h2>
              <button 
                onClick={() => copyToClipboard(generateEmailDraft(), 'email')}
                className="text-gray-500 hover:text-navy-900 dark:hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedEmail ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <textarea 
              className="w-full flex-1 min-h-[200px] p-3 text-sm bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono"
              defaultValue={generateEmailDraft()}
            />
          </section>
        </div>

      </div>
    </motion.div>
  );
}
