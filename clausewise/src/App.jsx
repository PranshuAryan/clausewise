import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import RiskAnalysis from './pages/RiskAnalysis';
import Compare from './pages/Compare';
import Ask from './pages/Ask';
import ActionPlan from './pages/ActionPlan';
import Settings from './pages/Settings';
import About from './pages/About';
import NotFound from './pages/NotFound';
import useStore from './store/useStore';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="upload" element={<Upload />} />
          <Route path="risk-analysis" element={<RiskAnalysis />} />
          <Route path="compare" element={<Compare />} />
          <Route path="ask" element={<Ask />} />
          <Route path="action-plan" element={<ActionPlan />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { theme } = useStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <AnimatedRoutes />
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
