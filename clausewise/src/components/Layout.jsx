import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentDocument } = useStore();

  const navLinks = [
    { name: 'Upload', path: '/upload' },
    { name: 'Risk Analysis', path: '/risk-analysis', disabled: !currentDocument },
    { name: 'Compare', path: '/compare' },
    { name: 'Ask AI', path: '/ask', disabled: !currentDocument },
    { name: 'Action Plan', path: '/action-plan', disabled: !currentDocument },
    { name: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-navy-900/80 border-b border-gray-200 dark:border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xl font-heading font-bold tracking-tight">
                ClauseWise
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.disabled ? '#' : link.path}
                  onClick={(e) => link.disabled && e.preventDefault()}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    link.disabled
                      ? 'text-gray-400 cursor-not-allowed opacity-50'
                      : isActive(link.path)
                      ? 'bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="ml-4 pl-4 border-l border-gray-200 dark:border-navy-700">
                <ThemeToggle />
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.disabled ? '#' : link.path}
                    onClick={(e) => {
                      if (link.disabled) e.preventDefault();
                      else setIsMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      link.disabled
                        ? 'text-gray-400 opacity-50'
                        : isActive(link.path)
                        ? 'bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Persistent Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/30 py-2 px-4 text-center text-xs text-amber-800 dark:text-amber-200/80">
        <span className="font-semibold">Disclaimer:</span> ClauseWise provides information and assistance only. It does not provide legal advice and is not a substitute for a licensed attorney.
      </div>

      <main className="flex-1 w-full relative">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-navy-900 border-t border-gray-200 dark:border-navy-700 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500 dark:text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} ClauseWise. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="hover:text-navy-900 dark:hover:text-white transition-colors">About</Link>
            <a href="https://github.com/placeholder/clausewise" target="_blank" rel="noopener noreferrer" className="hover:text-navy-900 dark:hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
