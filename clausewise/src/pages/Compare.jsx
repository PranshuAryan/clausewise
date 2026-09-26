import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, ArrowRightLeft, CheckCircle, MinusCircle, PlusCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../store/useStore';
import { parseFile } from '../utils/parseFile';
// Note: In a real implementation, you would call analyzeDocumentWithClaude or a similar compare endpoint here.

export default function Compare() {
  const { compareDocA, compareDocB, setCompareDocA, setCompareDocB, compareResults, setCompareResults } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await parseFile(file);
      if (docType === 'A') {
        setCompareDocA({ name: file.name, text });
      } else {
        setCompareDocB({ name: file.name, text });
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCompare = async () => {
    if (!compareDocA || !compareDocB) {
      toast.error('Please upload both documents');
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real implementation, we would send both to Groq with a diff prompt.
      // For this spec, we will simulate the API call failing if the backend isn't set up for this specific feature yet,
      // but to keep the UI working we can just use a dummy response or call the API.
      // Let's assume the backend provides it, but since I don't have a `compareDocumentsWithClaude` function built,
      // I will throw a clear error explaining the backend needs to implement it.
      
      throw new Error("Compare API endpoint not fully implemented on the backend yet.");
      
    } catch (error) {
      toast.error(error.message || 'Failed to compare documents');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearDocs = () => {
    setCompareDocA(null);
    setCompareDocB(null);
    setCompareResults(null);
  };

  const getStatusIcon = (status) => {
    if (status === 'added') return <PlusCircle className="w-5 h-5 text-emerald-500" />;
    if (status === 'removed') return <MinusCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getVerdictStyle = (verdict) => {
    if (verdict === 'More favorable to you') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (verdict === 'Less favorable') return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-bold mb-2">Compare Versions</h1>
        <p className="text-gray-600 dark:text-gray-400">Upload two versions of a document to see what changed and if it matters.</p>
      </div>

      {!compareResults ? (
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center relative">
            {/* Arrow connecting them */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-navy-900 rounded-full items-center justify-center border border-gray-200 dark:border-navy-700 shadow-sm">
              <ArrowRightLeft className="w-5 h-5 text-gray-400" />
            </div>

            {/* Doc A */}
            <div className="flex-1 bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="font-semibold mb-4 text-lg">Original Version</h3>
              {compareDocA ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-emerald-500 mb-2" />
                  <span className="font-medium">{compareDocA.name}</span>
                  <button onClick={() => setCompareDocA(null)} className="text-sm text-red-500 mt-2">Remove</button>
                </div>
              ) : (
                <label className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors flex flex-col items-center">
                  <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => handleFileUpload(e, 'A')} />
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium">Upload Document A</span>
                </label>
              )}
            </div>

            {/* Doc B */}
            <div className="flex-1 bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="font-semibold mb-4 text-lg">New Version</h3>
              {compareDocB ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-blue-500 mb-2" />
                  <span className="font-medium">{compareDocB.name}</span>
                  <button onClick={() => setCompareDocB(null)} className="text-sm text-red-500 mt-2">Remove</button>
                </div>
              ) : (
                <label className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-xl cursor-pointer hover:border-blue-500 transition-colors flex flex-col items-center">
                  <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => handleFileUpload(e, 'B')} />
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium">Upload Document B</span>
                </label>
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <button 
              onClick={handleCompare}
              disabled={!compareDocA || !compareDocB || isProcessing}
              className={`px-8 py-3 rounded-xl font-medium text-lg text-white transition-all
                ${!compareDocA || !compareDocB ? 'bg-gray-300 dark:bg-navy-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg'}
              `}
            >
              {isProcessing ? 'Analyzing differences...' : 'Compare Documents'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center bg-white dark:bg-navy-800 p-4 rounded-xl border border-gray-200 dark:border-navy-700 shadow-sm">
            <div className="flex space-x-4 items-center">
              <span className="font-medium truncate max-w-[150px] md:max-w-xs">{compareDocA.name}</span>
              <ArrowRightLeft className="w-4 h-4 text-gray-400" />
              <span className="font-medium truncate max-w-[150px] md:max-w-xs">{compareDocB.name}</span>
            </div>
            <button onClick={clearDocs} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">New Compare</button>
          </div>

          <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Executive Summary</h2>
            <p className="text-gray-700 dark:text-gray-300">{compareResults.summary}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">What Changed and Why It Matters</h2>
            <div className="space-y-4">
              {compareResults.diffs.map((diff, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="bg-white dark:bg-navy-800 p-5 rounded-xl border border-gray-200 dark:border-navy-700 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(diff.status)}
                      <span className="font-semibold text-sm uppercase tracking-wider text-gray-500">{diff.status}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${getVerdictStyle(diff.verdict)}`}>
                      {diff.verdict}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`font-mono text-sm p-3 rounded-lg border-l-4 ${
                      diff.status === 'added' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500' :
                      diff.status === 'removed' ? 'bg-red-50 dark:bg-red-900/10 border-red-500 line-through text-gray-500' :
                      'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500'
                    }`}>
                      {diff.text}
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm text-gray-700 dark:text-gray-300">Reasoning:</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{diff.reasoning}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
