import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Loader2, Sparkles, AlertCircle, Lightbulb, Info } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { askQuestionWithClaude } from '../lib/anthropic';
import { toast } from 'react-hot-toast';

export default function Ask() {
  const { currentDocument } = useStore();
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: {
        answer: 'Hi! I can answer questions specifically about your document. What would you like to know?',
        isGrounded: true,
        citedClauses: [],
        keyPoints: [],
        followUpSuggestion: null
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeClause, setActiveClause] = useState(null);
  
  const messagesEndRef = useRef(null);
  const documentRef = useRef(null);

  if (!currentDocument) {
    return <Navigate to="/upload" replace />;
  }

  const suggestedQuestions = [
    "Can I terminate this early?",
    "What happens if I miss a payment?",
    "Are there confidentiality requirements?",
    "Who owns the intellectual property?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const answerObj = await askQuestionWithClaude(currentDocument.text, text);
      setMessages(prev => [...prev, { role: 'assistant', content: answerObj }]);
    } catch (error) {
      toast.error('Failed to get answer');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: {
          answer: 'Sorry, I encountered an error trying to answer that.',
          isGrounded: false,
          citedClauses: [],
          keyPoints: [],
          followUpSuggestion: null
        } 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClauseClick = (clause) => {
    setActiveClause(clause);
    toast.success(`Highlighting: ${clause}`, { icon: '🔍' });
  };

  // Highlighting helper for document text
  const renderDocumentText = () => {
    if (!activeClause) return currentDocument.text;
    
    // We try to extract just the number or key words to highlight (rough heuristic)
    const searchWord = activeClause.split('-')[0].trim();
    if (!searchWord || searchWord.length < 3) return currentDocument.text;

    // A very simple highlight by splitting the string.
    const parts = currentDocument.text.split(new RegExp(`(${searchWord})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchWord.toLowerCase() ? 
        <mark key={i} className="bg-amber-300 dark:bg-amber-600/50 text-inherit rounded px-1">{part}</mark> : part
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold mb-2">Q&A Chat</h1>
        <p className="text-gray-600 dark:text-gray-400">Asking questions about: <span className="font-semibold">{currentDocument.name}</span></p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Chat Area */}
        <div className="flex-[2] flex flex-col bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm overflow-hidden">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-900 ml-3' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 mr-3'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-navy-900 dark:bg-gray-100 text-white dark:text-navy-900 rounded-tr-none' 
                      : `bg-gray-100 dark:bg-navy-900 text-gray-800 dark:text-gray-200 rounded-tl-none ${msg.content.isGrounded === false ? 'border-l-4 border-amber-400' : ''}`
                  }`}>
                    
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-3">
                        {/* Not Grounded Warning */}
                        {msg.content.isGrounded === false && (
                          <div className="flex items-center text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
                            <AlertCircle className="w-4 h-4 mr-1" /> Not explicitly in document
                          </div>
                        )}
                        
                        {/* Main Answer */}
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.content.answer}
                        </p>
                        
                        {/* Key Points */}
                        {msg.content.keyPoints && msg.content.keyPoints.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {msg.content.keyPoints.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        )}
                        
                        {/* Cited Clauses */}
                        {msg.content.citedClauses && msg.content.citedClauses.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {msg.content.citedClauses.map((clause, i) => (
                              <button 
                                key={i} 
                                onClick={() => handleClauseClick(clause)}
                                className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-full font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors shadow-sm"
                              >
                                {clause}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Follow Up */}
                        {msg.content.followUpSuggestion && (
                          <div className="pt-3 mt-3 border-t border-gray-200 dark:border-navy-700">
                            <button
                              onClick={() => handleSend(msg.content.followUpSuggestion)}
                              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center bg-transparent"
                            >
                              <Lightbulb className="w-3 h-3 mr-1" /> Want to ask: "{msg.content.followUpSuggestion}"
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 mr-3 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-gray-100 dark:bg-navy-900 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-50 dark:bg-navy-900/50 border-t border-gray-200 dark:border-navy-700">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="flex-shrink-0 px-3 py-1.5 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-full text-xs text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 transition-colors whitespace-nowrap flex items-center"
                >
                  <Sparkles className="w-3 h-3 mr-1" /> {q}
                </button>
              ))}
            </div>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex items-end space-x-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Ask a question about the document..."
                className="flex-1 max-h-32 min-h-[44px] p-3 rounded-xl border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                rows="1"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Document Reference Area */}
        <div className="hidden lg:flex flex-[1] flex-col bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-navy-900/80 border-b border-gray-200 dark:border-navy-700 font-medium text-sm flex items-center justify-between">
            <span className="flex items-center"><Info className="w-4 h-4 mr-2" /> Document Reference</span>
            {activeClause && (
              <button onClick={() => setActiveClause(null)} className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                Clear highlight
              </button>
            )}
          </div>
          <div ref={documentRef} className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-400 relative">
            {renderDocumentText()}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
