import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { Globe } from 'lucide-react';

export default function Settings() {
  const { jurisdiction, setJurisdiction } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-heading font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Preferences Section */}
        <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-semibold">Analysis Context</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Jurisdiction</label>
            <p className="text-gray-500 text-xs mb-3">Providing the correct jurisdiction helps the AI identify region-specific legal issues.</p>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="US (General)">United States (General)</option>
              <option value="US (California)">United States (California)</option>
              <option value="US (New York)">United States (New York)</option>
              <option value="US (Delaware)">United States (Delaware)</option>
              <option value="UK">United Kingdom</option>
              <option value="EU">European Union</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
