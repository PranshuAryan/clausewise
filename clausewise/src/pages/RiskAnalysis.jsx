import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, Filter, Download, HelpCircle } from 'lucide-react';
import useStore from '../store/useStore';

export default function RiskAnalysis() {
  const { currentDocument, analysisResults } = useStore();
  const [filter, setFilter] = useState('All');

  if (!currentDocument || !analysisResults) {
    return <Navigate to="/upload" replace />;
  }

  const clauses = analysisResults.clauses || [];
  const riskyClauses = clauses.filter(c => c.riskLevel === 'Red' || c.riskLevel === 'Yellow');
  const obligations = analysisResults.obligations || [];

  const filteredClauses = filter === 'All' 
    ? riskyClauses 
    : riskyClauses.filter(c => c.riskLevel === filter);

  // Pie chart data
  const data = [
    { name: 'High Risk', value: clauses.filter(c => c.riskLevel === 'Red').length, color: '#ef4444' }, // Red-500
    { name: 'Medium Risk', value: clauses.filter(c => c.riskLevel === 'Yellow').length, color: '#f59e0b' }, // Yellow-500
    { name: 'Low Risk', value: clauses.filter(c => c.riskLevel === 'Green').length, color: '#10b981' }, // Emerald-500
  ].filter(d => d.value > 0);

  const getRiskColor = (level) => {
    if (level === 'Red') return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';
    if (level === 'Yellow') return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
  };

  const exportChecklist = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Risk & Obligations Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyzing: <span className="font-semibold">{currentDocument.name}</span></p>
        </div>
        <button 
          onClick={exportChecklist}
          className="hidden md:flex px-4 py-2 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg hover:bg-gray-50 transition-colors items-center text-sm font-medium"
        >
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column: Summary & Chart */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Overall Risk Score</h2>
            <div className="flex flex-col items-center">
              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-4xl font-bold text-navy-900 dark:text-white">
                    {analysisResults.overallRiskScore || 50}
                  </span>
                  <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">/ 100</span>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-4 text-sm">
                {data.map(d => (
                  <div key={d.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></div>
                    <span className="text-gray-600 dark:text-gray-300">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Document Summary</h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {analysisResults.summary}
            </p>
          </div>
        </div>

        {/* Right Column: Flags & Obligations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Risk Flags */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Flagged Clauses
              </h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  className="text-sm border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 rounded-md focus:ring-emerald-500 outline-none p-1"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All Risks</option>
                  <option value="Red">High (Red)</option>
                  <option value="Yellow">Medium (Yellow)</option>
                </select>
              </div>
            </div>

            {filteredClauses.length === 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-6 rounded-xl text-center">
                <p className="text-emerald-800 dark:text-emerald-300">No risky clauses found in this document based on the current filter!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClauses.map((clause, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className={`p-5 rounded-xl border ${clause.riskLevel === 'Red' ? 'bg-red-50/50 border-red-200 dark:bg-red-900/10' : 'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getRiskColor(clause.riskLevel)}`}>
                        {clause.riskLevel} Risk • {clause.category}
                      </span>
                    </div>
                    
                    <p className="font-medium text-navy-900 dark:text-white mb-3 text-lg">{clause.simplified}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <strong className="text-sm text-gray-700 dark:text-gray-300 block mb-1">Why it's risky:</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{clause.riskReason}</p>
                      </div>
                      
                      {clause.suggestedQuestion && (
                        <div className="bg-white dark:bg-navy-800 p-3 rounded-lg border border-gray-200 dark:border-navy-700 flex items-start">
                          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <strong className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Ask the other party:</strong>
                            <p className="text-sm font-medium text-navy-900 dark:text-white">{clause.suggestedQuestion}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Obligations Table */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Obligations Matrix</h2>
            <div className="overflow-x-auto bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-navy-700">
                <thead className="bg-gray-50 dark:bg-navy-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Who</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owes What</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">By When</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consequence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-navy-700">
                  {obligations.length > 0 ? (
                    obligations.map((ob, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900 dark:text-white">{ob.who}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{ob.what}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{ob.when}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{ob.consequence}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No clear obligations extracted.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
}
