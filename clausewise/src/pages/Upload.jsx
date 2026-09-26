import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, ChevronDown, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useStore from '../store/useStore';
import { parseFile } from '../utils/parseFile';
import { analyzeDocumentWithClaude } from '../lib/anthropic';

export default function Upload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const navigate = useNavigate();
  const { 
    jurisdiction, 
    setCurrentDocument, setAnalysisResults, 
    currentDocument, analysisResults 
  } = useStore();

  const handleFileProcess = async (file) => {
    setIsProcessing(true);
    setUploadProgress(20);
    
    try {
      const text = await parseFile(file);
      setUploadProgress(50);
      
      setCurrentDocument({
        name: file.name,
        text: text,
        type: 'upload'
      });

      // Unconditionally call the backend API (fixed key logic is handled in the lib)
      const results = await analyzeDocumentWithClaude(text, jurisdiction);
      
      setUploadProgress(100);
      setAnalysisResults(results);
      setIsProcessing(false);
      
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to process document');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    handleFileProcess(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const getRiskColor = (level) => {
    if (level === 'Red') return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
    if (level === 'Yellow') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col"
    >
      {!analysisResults ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          <h1 className="text-3xl font-heading font-bold mb-2">Upload Document</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Upload a PDF, DOCX, or TXT file to simplify and analyze its clauses.
          </p>

          {!isProcessing ? (
            <div 
              {...getRootProps()} 
              className={`w-full p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center bg-white dark:bg-navy-800
                ${isDragActive ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 scale-105' : 'border-gray-300 dark:border-navy-600 hover:border-emerald-400 dark:hover:border-emerald-500'}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-lg font-medium text-center">
                {isDragActive ? "Drop the file here" : "Drag & drop a file, or click to select"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Supports PDF, DOCX, TXT (Max 5MB)
              </p>
            </div>
          ) : (
            <div className="w-full bg-white dark:bg-navy-800 p-8 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 relative mb-6">
                <div className="absolute inset-0 border-4 border-gray-100 dark:border-navy-700 rounded-full"></div>
                <motion.div 
                  className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyzing Document...</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6 max-w-sm">
                Extracting clauses, assessing risks, and translating legal jargon to plain English.
              </p>
              <div className="w-full max-w-md h-2 bg-gray-100 dark:bg-navy-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                ></motion.div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-navy-700">
            <div>
              <h2 className="text-2xl font-heading font-bold">{currentDocument.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <CheckCircle className="w-4 h-4 mr-1 text-emerald-500" /> Analysis complete
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setAnalysisResults(null)}
                className="px-4 py-2 text-sm bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Upload New
              </button>
              <button 
                onClick={() => navigate('/risk-analysis')}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
              >
                Risk Analysis <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Split Pane View */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden pb-8">
            {/* Left: Original Text */}
            <div className="flex-1 flex flex-col bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700 font-medium">
                Original Legal Text
              </div>
              <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {currentDocument.text}
              </div>
            </div>

            {/* Right: Simplified Clauses */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-navy-900/50 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden">
              <div className="px-4 py-3 bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700 font-medium flex justify-between items-center">
                <span>Simplified Explanation</span>
                <span className="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-navy-700 px-2 py-1 rounded">
                  {analysisResults.clauses?.length || 0} Key Clauses
                </span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {analysisResults.clauses?.map((clause, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 dark:bg-navy-700">
                        {clause.category}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getRiskColor(clause.riskLevel)}`}>
                        {clause.riskLevel} Risk
                      </span>
                    </div>
                    
                    <p className="text-lg font-medium mb-3 text-navy-900 dark:text-white">
                      {clause.simplified}
                    </p>
                    
                    <details className="group cursor-pointer">
                      <summary className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center hover:underline">
                        <ChevronDown className="w-4 h-4 mr-1 group-open:rotate-180 transition-transform" />
                        Show original text
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-navy-900/50 p-3 rounded-lg border-l-2 border-emerald-500">
                        "{clause.original}"
                      </p>
                    </details>
                    
                    {(clause.riskLevel === 'Red' || clause.riskLevel === 'Yellow') && clause.riskReason && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm flex items-start">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-red-800 dark:text-red-300">Why it's flagged: </strong>
                          <span className="text-red-700 dark:text-red-200">{clause.riskReason}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
