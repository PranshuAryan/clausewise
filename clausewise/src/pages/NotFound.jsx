import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
    >
      <AlertCircle className="w-24 h-24 text-emerald-500 mb-6" />
      <h1 className="text-5xl font-heading font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-8">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-navy-900 dark:bg-white text-white dark:text-navy-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </motion.div>
  );
}
