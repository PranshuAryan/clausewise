import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Scale, MessageSquare, ListChecks, ArrowRight } from 'lucide-react';

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    { icon: FileText, title: 'Simplify Legalese', desc: 'Translates complex clauses into plain English instantly.' },
    { icon: ShieldCheck, title: 'Highlight Risk', desc: 'Color-coded risk analysis identifies potential red flags.' },
    { icon: Scale, title: 'Compare Versions', desc: 'See exactly what changed between two document versions.' },
    { icon: MessageSquare, title: 'Ask Questions', desc: 'Chat directly with your document to find specific answers.' },
    { icon: ListChecks, title: 'Get Action Items', desc: 'Auto-generates checklists and emails for negotiations.' },
  ];

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="flex flex-col items-center pb-20"
    >
      {/* Hero Section */}
      <section className="w-full px-4 pt-20 pb-24 text-center max-w-5xl mx-auto">
        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>GenAI-Powered Legal Co-Pilot</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-navy-900 dark:text-white leading-tight mb-6">
          Understand contracts <br/><span className="text-emerald-600 dark:text-emerald-400">before you sign.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Upload any legal document and let AI break down the risks, explain the obligations, and help you negotiate better terms.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/upload" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-lg transition-colors flex items-center justify-center shadow-lg shadow-emerald-600/20">
            Upload Your Document <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/upload" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-navy-800 text-navy-900 dark:text-white border border-gray-200 dark:border-navy-700 rounded-xl font-medium text-lg hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors flex items-center justify-center">
            Try Demo
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-white dark:bg-navy-900 py-24 border-y border-gray-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-heading font-bold mb-4">Everything you need to review with confidence</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">ClauseWise combines the power of LLMs with a purpose-built interface for document analysis.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-navy-800/50 border border-gray-100 dark:border-navy-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-16">How it works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
            {[
              { step: '1', title: 'Upload', desc: 'Securely upload your PDF or DOCX file.' },
              { step: '2', title: 'Analyze', desc: 'AI breaks down the text into simplified clauses.' },
              { step: '3', title: 'Act', desc: 'Review risks and generate a negotiation checklist.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center flex-1"
              >
                <div className="w-16 h-16 rounded-full bg-navy-900 dark:bg-white text-white dark:text-navy-900 flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
